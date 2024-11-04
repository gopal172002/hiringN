import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import uniqid from 'uniqid';

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ message: 'No file provided' }), { status: 400 });
        }

        const s3Client = new S3Client({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            },
        });

        const newFilename = `${uniqid()}-${file.name}`;
        const chunks = [];
        // @ts-ignore
        for await (const chunk of file.stream()) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const bucketName = 'dawid-job-board';
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            ACL: 'public-read',
            Body: buffer,
            ContentType: file.type,
        }));

        return Response.json({
            newFilename,
            url: `https://${bucketName}.s3.amazonaws.com/${newFilename}`,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error uploading file to S3:', error);
            return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
        } else {
            console.error('Unexpected error:', error);
            return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
        }
    }
}

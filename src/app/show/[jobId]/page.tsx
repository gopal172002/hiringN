import { JobModel, Job } from "@/models/Job";
import mongoose from "mongoose";
import Image from "next/image";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    jobId: string;
  };
};

export default async function SingleJobPage(props: PageProps) {
  const { jobId } = props.params;

  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI as string);
  }

  // Find the job document by ID
  const jobDoc = await JobModel.findById(jobId).lean();

  // Handle the case where no job is found
  if (!jobDoc) {
    return notFound(); // This will render the 404 page
  }

  // Use optional chaining for fields that might be undefined
  return (
    <div className="container mt-8 my-6">
      <div className="sm:flex">
        <div className="grow">
          <h1 className="text-4xl mb-2">{jobDoc.title}</h1>
          <div className="capitalize text-sm text-blue-800 mb-4">
            {jobDoc.remote}
            {' '}&middot;{' '}
            {jobDoc.type}-time
            {jobDoc.salary && (
              <> {' '}&middot;{' '}${jobDoc.salary}k/year</>
            )}
            {jobDoc.experience && (
              <> {' '}&middot;{' '} {jobDoc.experience} years experience</>
            )}
          </div>
        </div>
        <div>
          {/* Optional chaining to handle jobIcon potentially being undefined */}
          {jobDoc.jobIcon && (
            <Image
              src={jobDoc.jobIcon} alt="Job icon"
              width={500} height={500}
              className="w-auto h-auto max-w-16 max-h-16"
            />
          )}
        </div>
      </div>
      <div className="whitespace-pre-line text-sm text-gray-600">
        {jobDoc.description}
      </div>
      <div className="mt-4 bg-gray-200 p-8 rounded-lg">
        <h3 className="font-bold mb-2">Apply Here</h3>
        <div className="flex flex-col">
          {/* Ensure that the job URL exists */}
          {jobDoc.jobUrl && (
            <a
              href={jobDoc.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {jobDoc.jobUrl}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

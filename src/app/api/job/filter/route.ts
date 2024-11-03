// pages/api/jobs.ts

import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { JobModel } from '@/models/Job'; // Adjust the import path if necessary

const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in your .env.local
console.log("uri", MONGO_URI);

// Connect to the database
async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URI!);
    }
}

export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        await connectDB();

        const query = req.nextUrl.searchParams;
        const filters: any = {}; // Initialize an empty filters object

        // Construct filters based on query parameters
        if (query.has('type')) {
            const types = query.getAll('type'); // Get all values for type
            filters.type = { $in: types }; // Filter by type
        }

        if (query.has('experience')) {
            const experience = parseInt(query.get('experience') as string, 10);
            filters.experience = { $gte: experience }; // Filter by experience
        }

        // Check if salary filter is applied
        if (query.has('salary')) {
            const salary = query.get('salary') as string;
            if (salary === 'Competitive') {
                filters.salary = { $gte: 10 }; // Example threshold for competitive
            } else {
                const [min, max] = salary.split('-').map(sal => {
                    if (sal.includes('+')) return Infinity; // Handle salary ranges with +
                    return parseInt(sal.split(' ')[0], 10); // Parse salary
                });
                if (max !== undefined) {
                    filters.salary = { $gte: min, $lte: max }; // Filter by salary range
                } else {
                    filters.salary = { $gte: min }; // Filter by minimum salary
                }
            }
        }

        // Fetch jobs from the database
        const jobs = await JobModel.find(Object.keys(filters).length ? filters : {}); // Return all jobs if no filters

        return new Response(JSON.stringify(jobs), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return new Response(JSON.stringify({ message: 'Error fetching jobs' }), { status: 500 });
    }
}

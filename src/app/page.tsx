import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import { JobModel, Job } from "@/models/Job"; 
import { getUser } from "@workos-inc/authkit-nextjs";
import mongoose from "mongoose";

export default async function Home() {
    const { user } = await getUser(); 
    await mongoose.connect(process.env.MONGO_URI as string); 
    
    const allJobs: Job[] = await JobModel.find().lean(); 
    
    return (
        <>
            <Hero />
            <Jobs header="" jobs={allJobs} /> 
        </>
    );
}

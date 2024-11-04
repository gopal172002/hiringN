import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import { JobModel, Job } from "@/models/Job"; 
import { getUser } from "@workos-inc/authkit-nextjs";
import mongoose from "mongoose";

export default async function Home() {
    const { user } = await getUser(); 
    await mongoose.connect(process.env.MONGO_URI as string); 
    
    const allJobs = await JobModel.find().lean() as Job[]; 
    
    return (
        <>
            <Hero />
            <Jobs header="" jobs={allJobs} /> 
        </>
    );
}

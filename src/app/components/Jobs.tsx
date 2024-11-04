import JobRow from "@/app/components/JobRow";
import type { Job } from "@/models/Job";

export default function Jobs({ header, jobs }: { header: string, jobs: Job[] }) {
  const sortedJobs = jobs?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-slate-200 py-6 rounded-3xl">
      <div className="container">
        <h2 className="font-bold mb-4">{header || 'Recent jobs'}</h2>

        <div className="flex flex-col gap-4">
          {!sortedJobs?.length && (
            <div>No jobs found</div>
          )}
          {sortedJobs && sortedJobs.map(job => (
            <JobRow key={job.id} jobDoc={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

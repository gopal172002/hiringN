'use client';
import TimeAgo from "@/app/components/TimeAgo";
import { Job } from "@/models/Job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Link from "next/link";

export default function JobRow({ jobDoc }: { jobDoc: Job }) {
  const JobCardContent = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex gap-4">

        <div className="w-12 basis-12 shrink-0">
          {/* You can place any image or icon here if needed */}
        </div>

        <div className="grow sm:flex">
          <div className="grow">
            <div className="text-xs text-gray-600 mb-1">
              {jobDoc.remote} &middot; <span className="text-gray-700">{jobDoc.type}-time</span>
              {jobDoc.salary && (
                <>
                  {' '}&middot;{' '} <span className="text-gray-700">{jobDoc.salary} LPA</span>.
                </>
              )}
              {jobDoc.experience != null && (
                <>
                  {' '}&middot;{' '} <span className="text-gray-700">{jobDoc.experience} Yr Experience</span>
                </>
              )}
            </div>

            {/* Organization name */}
            <div>
              <Link href={`/jobs/${jobDoc.orgId}`} className="hover:underline text-gray-500 text-sm">
                {jobDoc.orgName || "."}
              </Link>
            </div>

            {/* Job title */}
            <div className="font-bold text-lg mb-1">
              {jobDoc.title}
            </div>

            {/* Admin options */}
            {jobDoc.isAdmin && (
              <div className="text-gray-400 text-sm capitalize mt-2 relative group">
                <Link href={'/jobs/edit/' + jobDoc._id} className="mr-2">Edit</Link>
                <span>&middot;</span>
                <button
                  type="button"
                  className="absolute top-2 right-2 p-2 bg-white-500 text-white rounded-full hidden group-hover:inline-flex items-center justify-center"
                  onClick={async () => {
                    await axios.delete('/api/jobs?id=' + jobDoc._id);
                    window.location.reload();
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </div>

          {/* Created at timestamp */}
          {jobDoc.createdAt && (
            <div className="self-end text-gray-500 text-sm">
              <TimeAgo createdAt={jobDoc.createdAt} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="border-t border-black my-4">
        {jobDoc.isAdmin ? (
          <JobCardContent />
        ) : (
          <Link href={'/show/' + jobDoc._id} className="block">
            <JobCardContent />
          </Link>
        )}
      </div>
    </>
  );
}

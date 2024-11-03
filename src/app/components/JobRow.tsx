'use client';
import TimeAgo from "@/app/components/TimeAgo";
import { Job } from "@/models/Job";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";

export default function JobRow({ jobDoc }: { jobDoc: Job }){
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm relative">
      <div className="flex grow gap-4">
        <div className="content-center w-12 basis-12 shrink-0">
          <img
            className="size-12"
            src={jobDoc?.jobIcon}
            alt="Job icon"
          />
        </div>
        <div className="grow sm:flex">
          <div className="grow">
            {/* Display job details in a small section above the title */}
            <div className="text-xs text-gray-400 mb-1">
              {jobDoc.remote} &middot; {jobDoc.type}-time 
              {jobDoc.salary && (
                <>
                  {' '}&middot;{' '} ${jobDoc.salary}LPA.
                </>
              )}
              {jobDoc.experience != null && (
                <>
                  {' '}&middot;{' '} {jobDoc.experience} Yr Experince
                </>
              )}
            </div>

            {/* Organization name */}
            <div>
              <Link href={`/jobs/${jobDoc.orgId}`} className="hover:underline text-gray-500 text-sm">
                {jobDoc.orgName || '?'}
              </Link>
            </div>

            {/* Job title */}
            <div className="font-bold text-lg mb-1">
              <Link className="hover:underline" href={'/show/' + jobDoc._id}>{jobDoc.title}</Link>
            </div>

            {/* Other details: admin options */}
            <div className="text-gray-400 text-sm capitalize mt-2">
              {jobDoc.isAdmin && (
                <>
                  <Link href={'/jobs/edit/' + jobDoc._id}>Edit</Link>
                  {' '}&middot;{' '}
                  <button
                    type="button"
                    onClick={async () => {
                      await axios.delete('/api/jobs?id=' + jobDoc._id);
                      window.location.reload();
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Created at timestamp */}
          {jobDoc.createdAt && (
            <div className="content-end text-gray-500 text-sm">
              <TimeAgo createdAt={jobDoc.createdAt} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

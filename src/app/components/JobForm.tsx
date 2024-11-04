'use client';

import { saveJobAction } from "@/app/actions/jobActions";
import { Button, RadioGroup, TextArea, TextField, Theme } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { useState } from "react";

interface Job {
  _id?: string;
  title?: string;
  remote?: string;
  type?: string;
  salary?: number;
  description?: string;
  jobUrl?: string;
  experience?: number; 
  expectedSalary?: string; 
  orgLogo?: string; // Added orgLogo field
}

export default function JobForm({ orgId, jobDoc }: { orgId: string; jobDoc?: Job }) {
  const [jobUrl, setJobUrl] = useState(jobDoc?.jobUrl || '');
  const [experience, setExperience] = useState(jobDoc?.experience || 0);
  const [expectedSalary, setExpectedSalary] = useState(jobDoc?.expectedSalary || '');
  const [title, setTitle] = useState(jobDoc?.title || '');
  const [remote, setRemote] = useState(jobDoc?.remote || 'hybrid');
  const [type, setType] = useState(jobDoc?.type || 'full');
  const [salary, setSalary] = useState(jobDoc?.salary || 0);
  const [description, setDescription] = useState(jobDoc?.description || '');
  const [orgLogo, setOrgLogo] = useState(jobDoc?.orgLogo || ''); // New state for organization logo URL
  const [error, setError] = useState<string | null>(null);
  const [savedJobDoc, setSavedJobDoc] = useState<Job | null>(null);

  async function handleSaveJob(data: FormData) {
    if (!title || !jobUrl || !expectedSalary || !description || !orgLogo) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    data.set('orgId', orgId);
    data.set('title', title);
    data.set('jobUrl', jobUrl);
    data.set('experience', experience.toString());
    data.set('expectedSalary', expectedSalary);
    data.set('remote', remote);
    data.set('type', type);
    data.set('salary', salary.toString());
    data.set('description', description);
    data.set('orgLogo', orgLogo); // Add the orgLogo field

    const jobDoc = await saveJobAction(data);
    setSavedJobDoc(jobDoc);
    redirect(`/jobs/${jobDoc.orgId}`);
  }

  return (
    <Theme>
      <form action={handleSaveJob} className="container mt-6 flex flex-col gap-4">
        {jobDoc && <input type="hidden" name="id" value={jobDoc?._id} />}

        <TextField.Root
          name="title"
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid sm:grid-cols-3 gap-6 *:grow">
          <div>
            Remote?
            <RadioGroup.Root value={remote} onValueChange={setRemote} name="Remote">
              <RadioGroup.Item value="Onsite">On-site</RadioGroup.Item>
              <RadioGroup.Item value="Hybrid">Hybrid-remote</RadioGroup.Item>
              <RadioGroup.Item value="Remote">Fully remote</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
          <div>
            Job Type
            <RadioGroup.Root value={type} onValueChange={setType} name="type">
              <RadioGroup.Item value="Full">Full-time</RadioGroup.Item>
              <RadioGroup.Item value="Intern">Internship</RadioGroup.Item>
              <RadioGroup.Item value="Part">Part-time</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
          {salary > 0 && ( 
            <div>
              Salary
              <TextField.Root
                name="salary"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <div>
          Experience Required (in years)
          <TextField.Root
            type="number"
            name="experience"
            placeholder="Enter experience in years"
            value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
          />
        </div>

        <div>
          Expected Salary
          <TextField.Root
            name="expectedSalary"
            placeholder="Expected salary (e.g., 6-10 LPA)"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
          />
        </div>

        <div>
          <h3>Job Opening URL</h3>
          <TextField.Root
            placeholder="Enter job opening URL"
            name="jobUrl"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>

        <div>
          <h3>Organization Logo URL</h3>
          <TextField.Root
            placeholder="Enter organization logo URL"
            name="orgLogo"
            value={orgLogo}
            onChange={(e) => setOrgLogo(e.target.value)} // Handle logo URL input
          />
        </div>

        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Job description"
          resize="vertical"
          name="description"
        />

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-center">
          <Button size="3">
            <span className="px-8">Save</span>
          </Button>
        </div>

        {savedJobDoc && (
          <div className="mt-4 text-center">
            <p>Job posted successfully!</p>
            <a href={savedJobDoc.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Job Opening
            </a>
          </div>
        )}
      </form>
    </Theme>
  );
}

'use client';

import { saveJobAction } from "@/app/actions/jobActions";
import { Button, RadioGroup, TextArea, TextField, Theme } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { useState } from "react";

// Ensure the Job type includes jobUrl
interface Job {
  _id?: string;
  title?: string;
  remote?: string;
  type?: string;
  salary?: number;
  description?: string;
  jobUrl?: string;
  experience?: number; // New property for experience required
  expectedSalary?: string; // New property for expected salary
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
  const [error, setError] = useState<string | null>(null);
  const [savedJobDoc, setSavedJobDoc] = useState<Job | null>(null);

  async function handleSaveJob(data: FormData) {
    // Check for empty fields
    if (!title || !jobUrl || !experience || !expectedSalary || !salary || !description) {
      setError('Please fill in all required fields.');
      return; // Do not proceed further if validation fails
    }

    // Clear any previous error
    setError(null);

    // Add data to formData
    data.set('orgId', orgId);
    data.set('title', title);
    data.set('jobUrl', jobUrl);
    data.set('experience', experience.toString());
    data.set('expectedSalary', expectedSalary);
    data.set('remote', remote);
    data.set('type', type);
    data.set('salary', salary.toString());
    data.set('description', description);

    // Save job
    const jobDoc = await saveJobAction(data);
    setSavedJobDoc(jobDoc); // Store the saved job document
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
            <RadioGroup.Root value={remote} onValueChange={setRemote} name="remote">
              <RadioGroup.Item value="onsite">On-site</RadioGroup.Item>
              <RadioGroup.Item value="hybrid">Hybrid-remote</RadioGroup.Item>
              <RadioGroup.Item value="remote">Fully remote</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
          <div>
            Job Type
            <RadioGroup.Root value={type} onValueChange={setType} name="type">
              <RadioGroup.Item value="full">Full-time</RadioGroup.Item>
              <RadioGroup.Item value="intern">Internship</RadioGroup.Item>
              <RadioGroup.Item value="part">Part-time</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
          <div>
            Salary
            <TextField.Root
              name="salary"
              placeholder="Salary"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
            />
          </div>
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

        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Job description"
          resize="vertical"
          name="description"
        />

        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

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

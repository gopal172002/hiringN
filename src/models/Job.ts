import { AutoPaginatable, OrganizationMembership, User, WorkOS } from "@workos-inc/node";
import mongoose, { model, models, Schema, Document, Model } from 'mongoose';

// Define the Job type
export interface Job extends Document {
  title: string;
  description: string;
  orgName?: string;
  remote: string;
  type: string;
  salary: number;
  jobIcon: string;
  jobUrl: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
  experience?: number;
  expectedSalary?: string;
}

// Define the schema
const JobSchema = new Schema<Job>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    remote: { type: String, required: true },
    type: { type: String, required: true },
    salary: { type: Number, required: true },
    jobIcon: { type: String },
    jobUrl: { type: String, required: true },
    orgId: { type: String, required: true },
    experience: { type: Number },
    expectedSalary: { type: String },
  },
  {
    timestamps: true,
  }
);

// Function to add org and user data to job documents
export async function addOrgAndUserData(
  jobsDocs: Job[],
  user: User | null
): Promise<Job[]> {
  jobsDocs = JSON.parse(JSON.stringify(jobsDocs));

  // Ensure mongoose is connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI as string);
  }

  const workos = new WorkOS(process.env.WORKOS_API_KEY as string);
  let oms: AutoPaginatable<OrganizationMembership> | null = null;

  if (user) {
    oms = await workos.userManagement.listOrganizationMemberships({
      userId: user.id,
    });
  }

  for (const job of jobsDocs) {
    const org = await workos.organizations.getOrganization(job.orgId);
    job.orgName = org.name;

    if (oms && oms.data.length > 0) {
      job.isAdmin = !!oms.data.find((om) => om.organizationId === job.orgId);
    }
  }

  return jobsDocs;
}

// Export the Job model with correct typing
export const JobModel: Model<Job> = models.Job || model<Job>('Job', JobSchema);

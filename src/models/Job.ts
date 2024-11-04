import { AutoPaginatable, OrganizationMembership, User, WorkOS } from "@workos-inc/node";
import mongoose, { model, models, Schema, Document, Model } from 'mongoose';


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
  logoUrl?: string; 
}


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
    logoUrl: { type: String }, 
  },
  {
    timestamps: true,
  }
);


export async function addOrgAndUserData(
  jobsDocs: Job[],
  user: User | null
): Promise<Job[]> {
  jobsDocs = JSON.parse(JSON.stringify(jobsDocs));

 
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

  console.log(user);


  const orgIds = jobsDocs.map(job => job.orgId);
  const orgs = await Promise.all(orgIds.map(orgId => workos.organizations.getOrganization(orgId)));

  const orgMap = new Map(orgs.map(org => [org.id, org.name]));

console.log("this is org mpp"+orgMap);

  for (const job of jobsDocs){
    job.orgName = orgMap.get(job.orgId) || '';

    if (oms && oms.data.length > 0) {
      job.isAdmin = oms.data.some((om) => om.organizationId === job.orgId);
    }
  }

  return jobsDocs;
}


export const JobModel: Model<Job> = models.Job || model<Job>('Job', JobSchema);

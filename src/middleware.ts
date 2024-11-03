import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();


export const config = {
  matcher: [
    '/',  // Home page
    '/new-listing',  // New listing page
    '/new-listing/:orgId*',  // Dynamic orgId
    '/new-company',  // New company page
    '/jobs/:orgId*',  // Dynamic orgId for jobs
    '/jobs/edit/:jobId*',  // Edit job page
    '/show/:jobId*',  // Show job page
    '/your-other-paths',  // Add any other paths you need
  ],
};

import { getSignInUrl, getUser, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import Image from "next/image";

export default async function Header() {
  const { user } = await getUser();
  const signInUrl = await getSignInUrl();

  return (
    <header>
      <div className="container flex items-center justify-between mx-auto my-4">
        <Link href="/">
          <Image
            className="h-12 w-auto object-contain"
            src="/assets/hiringnexus.png"
            alt="Logo"
            width={300} // Adjust width as needed
            height={48} // Adjust height as needed
          />
        </Link>
        <nav className="flex gap-2">
          {!user && (
            <Link
              className="rounded-md bg-white text-white py-1 px-2 sm:py-2 sm:px-4"
              href={signInUrl}
            >
              Sign In
            </Link>
          )}
          {user && (
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4"
              >
                Logout
              </button>
            </form>
          )}
          <Link
            className="rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-blue-600 text-white"
            href="/new-listing"
          >
            Post a job
          </Link>
        </nav>
      </div>
    </header>
  );
}

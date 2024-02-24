import Link from 'next/link';

export default function Home() {
  const isAuthenticated = false;

  // If the user is not authenticated, display a welcome message and links to sign in or sign up
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Welcome to the game!</h1>
        <div className="flex flex-row gap-2">
          <Link href="/signin" className="text-center underline">
            Sign in
          </Link>

          <Link href="/signup" className="text-center underline">
            Create an account
          </Link>
        </div>
      </main>
    );
  }

  // If the user is authenticated, display a welcome message for the game
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center">Welcome to the game!</h1>
      <Link href="/signout" className="text-center underline">
        Sign out
      </Link>
    </main>
  );
}

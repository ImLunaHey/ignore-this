'use client';

import { Box } from '@/components/box';
import { useEffect } from 'react';

export default function Signout() {
  useEffect(() => {
    //  Clear the cookie
    document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to the home page
    window.location.href = '/';
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] items-center justify-center gap-4">
      <Box>
        <p>Signing out...</p>
      </Box>
    </main>
  );
}

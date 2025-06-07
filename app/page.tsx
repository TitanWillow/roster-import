'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/import');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
    </div>
  );
}
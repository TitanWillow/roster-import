import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roster Profile Importer',
  description: 'Import your professional portfolio into Roster.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-300">{children}</body>
    </html>
  );
}
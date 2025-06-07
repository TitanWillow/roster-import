'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { mockCreateProfileFromUrl } from '../../lib/mockApi';

const IconLink2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const IconLoader = () => <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export const PortfolioUrlForm: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const exampleUrls = [
      { name: "Sonu's Portfolio", value: "https://sonuchoudhary.my.canva.site/portfolio" },
      { name: "Jane Doe", value: "https://test.com" },
  ];

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!url.trim()) return;
      setIsLoading(true);
      setError(null);

      try {
          const { profileId } = await mockCreateProfileFromUrl(url.trim());
          router.push(`/profile/${profileId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
          setError(err.message || 'An unknown error occurred.');
          setIsLoading(false);
      }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
          <div>
              <label htmlFor="portfolioUrl" className="block text-2xl font-medium text-gray-300 mb-6">Portfolio URL</label>
              <div className="flex group rounded-full shadow-sm bg-gray-900/70 border border-gray-600 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/50 transition-all">
                  <span className="inline-flex items-center pl-5 pr-2 text-gray-400 group-focus-within:text-orange-400 transition-colors"><IconLink2 /></span>
                  <input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(null); }}
                      required
                      disabled={isLoading}
                      className="flex-1 block w-full rounded-full bg-transparent py-4 px-3 text-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
                      placeholder="https://..."
                  />
              </div>
          </div>

          <div>
              <p className="text-base text-gray-400 mb-4">Need an example?</p>
              <div className="flex flex-wrap gap-3">
                  {exampleUrls.map(ex => (
                      <button type="button" key={ex.name} onClick={() => { setUrl(ex.value); setError(null);}}
                          className="text-xs font-medium text-orange-400 hover:text-white bg-orange-500/10 hover:bg-orange-500/20 px-4 py-1.5 rounded-full disabled:opacity-50 transition-all"
                          disabled={isLoading}
                      >{ex.name}</button>
                  ))}
              </div>
          </div>

          {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
              </div>
          )}

          <div>
              <button
                  type="submit"
                  disabled={isLoading || !url}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-lg text-base font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
              >
                  {isLoading && <IconLoader />}
                  {isLoading ? 'Processing...' : 'Generate Profile'}
              </button>
          </div>
      </form>
    </div>
  );
};
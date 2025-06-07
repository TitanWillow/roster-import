'use client';

import React, { useState } from 'react';
import { RosterProfile } from '../../lib/types';
import { getEmbedUrl } from '../../lib/utils';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
  return adjustedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const ProfileCard: React.FC<{ profile: RosterProfile }> = ({ profile }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    const profileUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => console.error('Failed to copy: ', err));
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = profileUrl;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } 
        catch (err) { console.error('Fallback copy failed', err); }
        document.body.removeChild(textArea);
    }
  };
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-12 space-y-12">

            <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{profile.firstName} {profile.lastName}</h1>
                    <p className="mt-2 text-xl text-orange-400 font-medium">Creative Professional</p>
                </div>
                <div className="mt-4 sm:mt-0 flex-shrink-0">
                    <button onClick={handleCopyLink} className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-4 rounded-full shadow-sm transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard mr-2" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                        Share Profile
                    </button>
                    {copied && <p className="text-xs text-green-400 mt-2 text-center">Copied!</p>}
                </div>
            </div>
            
            <section>
                <h2 className="text-lg uppercase font-bold tracking-widest text-blue-500 mb-4">About</h2>
                <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line prose prose-invert prose-p:text-gray-300 max-w-none">
                    {profile.summary || "No summary provided."}
                </div>
            </section>
            
            <section>
                <h2 className="text-lg uppercase font-bold tracking-widest text-blue-500 mb-8">Experience</h2>
                <div className="space-y-12">
                    {profile.experiences && profile.experiences.length > 0 ? (
                        profile.experiences.map((exp) => (
                            <div key={exp.id} className="pl-4 border-l-4 border-gray-700">
                                <h3 className="text-xl font-bold text-green-400">{exp.jobTitle}</h3>
                                <p className="text-lg text-gray-300 font-medium mt-1">{exp.employerOrClient}</p>
                                <p className="text-base text-gray-400 font-semibold mt-2">
                                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                    <span className="mx-2 text-gray-600">|</span>
                                    <span className="capitalize">{exp.employmentType}</span>
                                </p>
                                
                                {exp.contributionSummary && (
                                    <div className="mt-4 text-base text-gray-400 leading-relaxed whitespace-pre-line prose prose-invert prose-p:text-gray-400 max-w-none">
                                        {exp.contributionSummary}
                                    </div>
                                )}
                                
                                {exp.videos && exp.videos.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-200 mb-3">Work Samples:</h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {exp.videos.map(video => {
                                            const embedUrl = getEmbedUrl(video.url);

                                            return (
                                                <div key={video.id} className="border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-900/50 transform hover:-translate-y-1 transition-transform duration-300">
                                                    <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                                                        {embedUrl ? (
                                                            <iframe src={embedUrl} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full text-orange-400 p-4 text-center">
                                                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-300">
                                                                    <span>Unsupported Link: View Source →</span>
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4">
                                                        <h5 className="font-semibold text-gray-200 truncate" title={video.title}>{video.title || "Untitled Sample"}</h5>
                                                        {video.url && <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:underline">View Original Source</a>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="pl-4 border-l-4 border-gray-700 text-gray-500 italic">No work experiences have been added yet.</p>
                    )}
                </div>
            </section>
        </div>
    </div>
  );
};
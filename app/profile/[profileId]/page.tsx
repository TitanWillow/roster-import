'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProfileData, RosterProfile } from '../../../lib/types';
import { ProfileReviewForm } from '../../../components/importer/ProfileReviewForm';
import { ProfileCard } from '../../../components/profile/ProfileCard';
import { mockGetProfileById, mockUpdateProfile } from '../../../lib/mockApi';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.profileId as string;

  const [profile, setProfile] = useState<RosterProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    
    if (profileId) {
      setIsLoading(true);
      setError(null);
      mockGetProfileById(profileId)
        .then((data) => {
          setProfile(data);
          if (data.status === 'pending_review') {
              setIsEditing(true);
          }
        })
        .catch((err) => { setError(err.message); })
        .finally(() => { setIsLoading(false); });
    }
  }, [profileId]);

  const handleSaveProfile = async (updatedData: ProfileData) => {
    if (!profileId) return;
    setIsSaving(true);
    try {
        await mockUpdateProfile(profileId, updatedData);
        const updatedProfile = await mockGetProfileById(profileId);
        setProfile(updatedProfile);
        setIsEditing(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">Loading Profile...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4"><p className="text-xl text-red-400 font-semibold">Error</p><p className="text-red-400 mt-2">{error}</p><button onClick={() => router.push('/import')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Try Importing Again</button></div>;
  if (!profile) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-500">Profile Not Found.</div>;

  return (
    <main className="min-h-screen bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{isEditing ? 'Editing Profile' : 'Your Roster Profile'}</h2>
            <div>
              {isEditing && (
                 <button onClick={() => setIsEditing(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all">
                    Cancel Edit
                </button>
              )}
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all">
                    Edit Profile
                </button>
              )}
            </div>
        </div>
        {isEditing ? (
          <ProfileReviewForm initialProfileData={profile} onSave={handleSaveProfile} isLoading={isSaving} />
        ) : (
          <ProfileCard profile={profile} />
        )}
      </div>
    </main>
  );
}
'use client';

import React, { useState, FormEvent } from 'react';
import { ProfileData } from '../../lib/types';
import { v4 as uuidv4 } from 'uuid';

interface ProfileReviewFormProps {
  initialProfileData: ProfileData;
  onSave: (updatedData: ProfileData) => Promise<void>;
  isLoading: boolean;
}

const RequiredLabel = ({ label, htmlFor }: { label: string, htmlFor: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300">
    {label} <span className="text-orange-500">*</span>
  </label>
);

type EditableExperienceField = 'jobTitle' | 'employerOrClient' | 'startDate' | 'endDate' | 'employmentType' | 'contributionSummary';
type EditableVideoField = 'title' | 'url';

export const ProfileReviewForm: React.FC<ProfileReviewFormProps> = ({ initialProfileData, onSave, isLoading }) => {
  const [formData, setFormData] = useState<ProfileData>(JSON.parse(JSON.stringify(initialProfileData)));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.firstName.trim()) { newErrors.firstName = "First name is required."; isValid = false; }
    if (!formData.lastName.trim()) { newErrors.lastName = "Last name is required."; isValid = false; }
    
    formData.experiences.forEach((exp, index) => {
      if (!exp.jobTitle.trim()) { newErrors[`exp_${index}_jobTitle`] = "Job title is required."; isValid = false; }
      if (!exp.employerOrClient.trim()) { newErrors[`exp_${index}_employerOrClient`] = "Employer or client name is required."; isValid = false; }
      if (!exp.startDate) { newErrors[`exp_${index}_startDate`] = "Start date is required."; isValid = false; }
      if (!exp.employmentType) { newErrors[`exp_${index}_employmentType`] = "Please select an employment type."; isValid = false; }
      exp.videos.forEach((video, vIndex) => {
        if (!video.title.trim()) { newErrors[`exp_${index}_video_${vIndex}_title`] = "Sample title is required."; isValid = false; }
        if (!video.url.trim()) { newErrors[`exp_${index}_video_${vIndex}_url`] = "Sample URL is required."; isValid = false; }
      });
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExperienceChange = (index: number, field: EditableExperienceField, value: string) => {
    const newExperiences = formData.experiences.map((exp, i) => i === index ? { ...exp, [field]: value } : exp);
    setFormData(prev => ({ ...prev, experiences: newExperiences }));
  };

  const handleVideoChange = (expIndex: number, videoIndex: number, field: EditableVideoField, value: string) => {
    const newExperiences = formData.experiences.map((exp, i) => {
      if (i === expIndex) {
        const updatedVideos = exp.videos.map((video, j) => j === videoIndex ? { ...video, [field]: value } : video);
        return { ...exp, videos: updatedVideos };
      }
      return exp;
    });
    setFormData(prev => ({ ...prev, experiences: newExperiences }));
  };

  const addExperience = () => setFormData(prev => ({ ...prev, experiences: [...prev.experiences, { id: uuidv4(), jobTitle: '', employerOrClient: '', startDate: '', endDate: '', employmentType: '', contributionSummary: '', videos: [] }]}));
  const removeExperience = (index: number) => setFormData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  
  const addVideo = (expIndex: number) => {
    const newExperiences = formData.experiences.map((exp, i) => {
      if (i === expIndex) return { ...exp, videos: [...exp.videos, { id: uuidv4(), title: '', url: '' }] };
      return exp;
    });
    setFormData(prev => ({ ...prev, experiences: newExperiences }));
  };

  const removeVideo = (expIndex: number, videoIndex: number) => {
    const newExperiences = formData.experiences.map((exp, i) => {
      if (i === expIndex) return { ...exp, videos: exp.videos.filter((_, j) => j !== videoIndex) };
      return exp;
    });
    setFormData(prev => ({ ...prev, experiences: newExperiences }));
  };

  const inputClasses = "mt-2 block w-full bg-gray-900/70 border-gray-600 rounded-lg py-3 px-4 text-base text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition";
  const errorInputClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
  const normalInputClasses = "border-gray-600 focus:border-orange-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-10">
        <div>
            <h2 className="text-3xl font-bold text-white">Edit Your Profile</h2>
            <p className="mt-2 text-gray-400">Make sure all required fields (<span className="text-orange-500">*</span>) are filled correctly.</p>
        </div>
        
        <section className="space-y-6 border-t border-gray-700 pt-8">
            <h3 className="text-xl font-semibold text-white">Basic Information</h3>
            <div>
                <RequiredLabel label="First Name" htmlFor="firstName" />
                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleBasicInfoChange} className={`${inputClasses} ${errors.firstName ? errorInputClasses : normalInputClasses}`} />
                {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
            </div>
            <div>
                <RequiredLabel label="Last Name" htmlFor="lastName" />
                <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleBasicInfoChange} className={`${inputClasses} ${errors.lastName ? errorInputClasses : normalInputClasses}`} />
                {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
            </div>
            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-300">Summary / Bio</label>
                <textarea name="summary" id="summary" rows={5} value={formData.summary} onChange={handleBasicInfoChange} className={inputClasses} />
            </div>
        </section>

        <section className="space-y-8 border-t border-gray-700 pt-8">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Work Experience</h3>
                <button type="button" onClick={addExperience} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-sm transform hover:scale-105 transition-all"> + Add Experience</button>
            </div>

            {formData.experiences.map((exp, expIndex) => (
            <div key={exp.id} className="space-y-6 p-6 bg-gray-800 border border-gray-700/50 rounded-xl relative">
                <button type="button" onClick={() => removeExperience(expIndex)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl leading-none transition-colors" title="Remove Experience">&times;</button>
                <div>
                    <RequiredLabel label="Job Title" htmlFor={`jobTitle_${expIndex}`} />
                    <input id={`jobTitle_${expIndex}`} type="text" value={exp.jobTitle} onChange={(e) => handleExperienceChange(expIndex, 'jobTitle', e.target.value)} className={`${inputClasses} ${errors[`exp_${expIndex}_jobTitle`] ? errorInputClasses : normalInputClasses}`} />
                    {errors[`exp_${expIndex}_jobTitle`] && <p className="mt-1 text-xs text-red-400">{errors[`exp_${expIndex}_jobTitle`]}</p>}
                </div>
                <div>
                    <RequiredLabel label="Employer / Client" htmlFor={`employer_${expIndex}`} />
                    <input id={`employer_${expIndex}`} type="text" value={exp.employerOrClient} onChange={(e) => handleExperienceChange(expIndex, 'employerOrClient', e.target.value)} className={`${inputClasses} ${errors[`exp_${expIndex}_employerOrClient`] ? errorInputClasses : normalInputClasses}`} />
                    {errors[`exp_${expIndex}_employerOrClient`] && <p className="mt-1 text-xs text-red-400">{errors[`exp_${expIndex}_employerOrClient`]}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <RequiredLabel label="Start Date" htmlFor={`startDate_${expIndex}`} />
                        <input id={`startDate_${expIndex}`} type="date" value={exp.startDate || ''} onChange={(e) => handleExperienceChange(expIndex, 'startDate', e.target.value)} className={`${inputClasses} ${errors[`exp_${expIndex}_startDate`] ? errorInputClasses : normalInputClasses}`} />
                        {errors[`exp_${expIndex}_startDate`] && <p className="mt-1 text-xs text-red-400">{errors[`exp_${expIndex}_startDate`]}</p>}
                    </div>
                    <div>
                        <label htmlFor={`endDate_${expIndex}`} className="block text-sm font-medium text-gray-300">End Date (or leave blank)</label>
                        <input id={`endDate_${expIndex}`} type="date" value={exp.endDate || ''} onChange={(e) => handleExperienceChange(expIndex, 'endDate', e.target.value)} className={inputClasses} />
                    </div>
                </div>

                <div>
                    <RequiredLabel label="Employment Type" htmlFor={`employmentType_${expIndex}`} />
                    <select id={`employmentType_${expIndex}`} value={exp.employmentType} onChange={(e) => handleExperienceChange(expIndex, 'employmentType', e.target.value)} className={`${inputClasses} ${errors[`exp_${expIndex}_employmentType`] ? errorInputClasses : normalInputClasses}`}>
                        <option value="" disabled>Select a type...</option><option value="full-time">Full-time</option><option value="contract">Contract</option><option value="part-time">Part-time</option><option value="freelance">Freelance</option><option value="other">Other</option>
                    </select>
                    {errors[`exp_${expIndex}_employmentType`] && <p className="mt-1 text-xs text-red-400">{errors[`exp_${expIndex}_employmentType`]}</p>}
                </div>

                <div>
                    <label htmlFor={`summary_${expIndex}`} className="block text-sm font-medium text-gray-300">Contribution Summary</label>
                    <textarea id={`summary_${expIndex}`} rows={4} value={exp.contributionSummary} onChange={(e) => handleExperienceChange(expIndex, 'contributionSummary', e.target.value)} className={inputClasses} />
                </div>
                
                <div className="pt-6 mt-6 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Work Samples</h4>
                        <button type="button" onClick={() => addVideo(expIndex)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-full shadow-sm transform hover:scale-105 transition-all">+ Add Sample</button>
                    </div>
                    {exp.videos.map((video, videoIndex) => (
                    <div key={video.id} className="space-y-4 p-4 border border-gray-600 rounded-lg bg-gray-900/50 mb-4 relative">
                        <button type="button" onClick={() => removeVideo(expIndex, videoIndex)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl leading-none transition-colors" title="Remove Sample">&times;</button>
                        <div>
                            <RequiredLabel label="Sample Title" htmlFor={`videoTitle_${expIndex}_${videoIndex}`} />
                            <input id={`videoTitle_${expIndex}_${videoIndex}`} type="text" placeholder="e.g., Brand Anthem" value={video.title} onChange={e => handleVideoChange(expIndex, videoIndex, 'title', e.target.value)} className={`${inputClasses} text-sm ${errors[`exp_${expIndex}_video_${videoIndex}_title`] ? errorInputClasses : normalInputClasses}`}/>
                            {errors[`exp_${expIndex}_video_${videoIndex}_title`] && <p className="mt-1 text-xs text-red-400">{errors[`exp_${expIndex}_video_${videoIndex}_title`]}</p>}
                        </div>
                        <div>
                            <RequiredLabel label="Sample URL" htmlFor={`videoUrl_${expIndex}_${videoIndex}`} />
                            <input id={`videoUrl_${expIndex}_${videoIndex}`} type="url" placeholder="https://youtube.com/embed/..." value={video.url} onChange={e => handleVideoChange(expIndex, videoIndex, 'url', e.target.value)} className={`${inputClasses} text-sm ${errors[`exp_${expIndex}_video_${videoIndex}_url`] ? errorInputClasses : normalInputClasses}`}/>
                            {errors[`exp_${expIndex}_video_${videoIndex}_url`] && <p className="mt-1 text-xs text-red-400">{errors[`exp_${expIndex}_video_${videoIndex}_url`]}</p>}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            ))}
        </section>

        <div className="pt-8 flex justify-end">
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto flex justify-center items-center py-4 px-8 border border-transparent rounded-full shadow-lg text-base font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300">
                {isLoading ? 'Saving...' : 'Save & Publish Profile'}
            </button>
        </div>
    </form>
  );
};
export interface Video {
  id: string;
  title: string;
  url: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  employerOrClient: string;
  startDate: string;
  endDate: string;
  employmentType: 'full-time' | 'contract' | 'part-time' | 'freelance' | 'other' | '';
  contributionSummary: string;
  videos: Video[];
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  summary: string;
  experiences: Experience[];
}

export interface RosterProfile extends ProfileData {
  profileId: string;
  originalPortfolioUrl?: string;
  status: 'pending_review' | 'published';
  process : 'fail' | 'success'
}
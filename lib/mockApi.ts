import { ProfileData, RosterProfile } from './types';
import { v4 as uuidv4 } from 'uuid';

const mockParsePortfolio = (url: string): Partial<ProfileData> => {
  if (url.toLowerCase().includes("sonuchoudhary.my.canva.site")) {
    return {
      firstName: "Sonu",
      lastName: "Choudhary",
      summary: "I specialize in YouTube video editing, crafting high-quality content that captivates audiences and drives engagement. I’ve had the privilege of working with top creators like Uptin (3M+ followers) and XYZ Education (1M+ subscribers), contributing to content that has amassed over 5 million organic views.",
      experiences: [
        {
          id: uuidv4(),
          jobTitle: "Video Editor",
          employerOrClient: "TAKINGHEAD",
          startDate: "2022-01-01",
          endDate: "",
          employmentType: "full-time",
          contributionSummary: "",
          videos: [
            { id: uuidv4(), title: "From Waste to Wonder", url: "https://www.youtube.com/watch?v=2GP-WuXphTk" },
            { id: uuidv4(), title: "Mayuri Admission video", url: "https://www.youtube.com/watch?v=B6yRSDWiou4" }
          ]
        },
        {
          id: uuidv4(),
          jobTitle: "Video Editor",
          employerOrClient: "CASHCOWS",
          startDate: "2023-01-01",
          endDate: "",
          employmentType: "full-time",
          contributionSummary: "",
          videos: [
            { id: uuidv4(), title: "Title 1", url: "https://youtu.be/dXE_emchp5k" },
            { id: uuidv4(), title: "Title 2", url: "https://youtu.be/rSppFMxWsX4" }
          ]
        }
      ]
    };
  }
  if (url.toLowerCase().includes("test.com")) {
    return {
      firstName: "Jane (Mock)",
      lastName: "Doe",
      summary: "This profile was generated from your portfolio link...",
      experiences: [],
    };
  }
  return {};
};

export const mockCreateProfileFromUrl = (portfolioUrl: string): Promise<{ profileId: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!portfolioUrl) throw new Error("Portfolio URL cannot be empty.");
        
        const parsedData = mockParsePortfolio(portfolioUrl);
        const profileId = uuidv4();

        const newProfile: RosterProfile = {
          profileId,
          originalPortfolioUrl: portfolioUrl,
          firstName: parsedData.firstName || '',
          lastName: parsedData.lastName || '',
          summary: parsedData.summary || '',
          experiences: (parsedData.experiences || []).map(exp => ({...exp, id: exp.id || uuidv4(), videos: (exp.videos || []).map(vid => ({ ...vid, id: vid.id || uuidv4()}))})),
          status: 'pending_review',
          process : Object.keys(parsedData).length === 0 ? 'fail' : 'success'
        };

        localStorage.setItem(`roster_profile_${profileId}`, JSON.stringify(newProfile));
        resolve({ profileId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        reject({ message: error.message || "Failed to create mock profile." });
      }
    }, 1000);
  });
};

export const mockGetProfileById = (profileId: string): Promise<RosterProfile> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const profileData = localStorage.getItem(`roster_profile_${profileId}`);
            if (profileData) {
                resolve(JSON.parse(profileData));
            } else {
                reject({ message: "Profile not found." });
            }
        }, 500);
    });
};

export const mockUpdateProfile = (profileId: string, updatedData: ProfileData): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const profileString = localStorage.getItem(`roster_profile_${profileId}`);
            if (profileString) {
                const existingProfile: RosterProfile = JSON.parse(profileString);
                const newProfile: RosterProfile = { 
                  ...existingProfile, 
                  ...updatedData,
                  status: 'published',
                };
                localStorage.setItem(`roster_profile_${profileId}`, JSON.stringify(newProfile));
                resolve({ message: "Profile updated successfully." });
            } else {
                reject({ message: "Could not find profile to update." });
            }
        }, 500);
    });
};
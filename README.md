## Demo Walkthrough: Roster Profile Importer

This document provides a technical explanation of the Roster Profile Importer project, covering user flow, architecture, state management and future considerations.

### 1. The User Flow

The user journey is designed to be simple and intuitive, consisting of three main stages:

1.  **Import:** The user lands on a modern, dark-themed import page. They are prompted to enter the URL of their external portfolio. For convenience, example links are provided. Upon submission, a mock API call is initiated.

2.  **Review & Edit:** The user is immediately redirected to a unique URL for their new profile (e.g., `/profile/some-unique-id`).
    - If the mock parsing was successful, the form is pre-filled with the extracted data.
    - The user can edit all fields, add or remove work experiences and video samples, and correct any information. The form includes validation to ensure all mandatory fields are filled.

3.  **View & Share:** After a successful save, the page switches to a clean, non-editable "Profile Card" view. This card is designed for presentation, with clear typography and layout. From here, the user can copy the unique, shareable link to their clipboard or re-enter edit mode at any time.

### 2. Component Structure

The project is built using Next.js with the App Router and is organized for clarity and scalability. The key directory is `/components`.

-   **`/components/importer/`**: Contains components related to the data input and editing process.
    -   `PortfolioUrlForm.tsx`: A self-contained form for the initial URL submission. It handles its own state for the input field, loading, and errors, and calls the mock API on submit.
    -   `ProfileReviewForm.tsx`: The main editing interface. It receives the initial profile data as a prop and manages the complex state of all form fields, including dynamic lists for experiences and videos. It also handles form validation logic.

-   **`/components/profile/`**: Contains components for displaying the final data.
    -   `ProfileCard.tsx`: A read-only component that presents the final, saved profile data in a polished, professional layout.

-   **`/lib/`**: Contains non-component logic.
    -   `types.ts`: Defines all TypeScript interfaces (`ProfileData`, `Experience`, etc.) for type safety across the application.
    -   `mockApi.ts`: Simulates the entire backend. It contains functions that mimic API calls for creating, fetching, and updating profiles using the browser's `localStorage` for persistence during a session.
    -   `utils.ts`: Holds reusable helper functions, such as the `getEmbedUrl` function for converting video links.

### 3. State Management

State management is handled locally within each component using React's built-in `useState` hook, which is ideal for this application's scope.

-   **Local UI State:** Simple UI states (e.g., `isLoading`, `error` in `PortfolioUrlForm`, `isCopied` in `ProfileCard`) are managed directly within the components that need them.
-   **Form Data State:** The most complex state is the `formData` object within `ProfileReviewForm.tsx`. It is initialized with the data passed down from the main profile page. All user edits update this single state object. This centralized approach within the form makes it easy to manage validation and handle the final `onSave` event.
-   **Page-Level State:** The dynamic profile page (`app/profile/[profileId]/page.tsx`) acts as a controller. It manages the most critical state:
    -   The `profile` data object, fetched from the mock API.
    -   The `isEditing` boolean, which determines whether to render the `ProfileReviewForm` or the `ProfileCard`.

This strategy avoids the need for a global state management library (like Redux or Zustand), as all state is logically contained within the component or page that uses it.

### 4. Scalability & Edge Case Handling

While this project is a frontend mock, it was designed with scalability in mind.

-   **Backend Integration:** The use of a mock API layer in `/lib/mockApi.ts` means a backend developer can easily replace the mock functions with real `fetch` calls to the documented API endpoints without needing to refactor the UI components.
-   **Error Handling:** The current app handles basic errors (e.g., profile not found). A production app would add more granular error handling, such as specific messages for validation failures from the backend and a more robust notification system (e.g., toast pop-ups) for a better user experience.
-   **Performance:** For the work sample videos, lazy-loading the `<iframe>` elements would improve initial page load performance, especially for profiles with many videos.

## API Documentation: Roster Profile Importer

### Overview

This document outlines the API endpoints required by the frontend of the Roster Profile Importer. The goal is to replace the current mock API with a production-ready backend that handles portfolio parsing, data persistence, and profile management.

---

### Data Models

#### `Profile`
The primary data object representing a user's profile.

| Field                 | Type       | Description                                                                 |
| --------------------- | ---------- | --------------------------------------------------------------------------- |
| `profileId`           | `string`   | **Primary Key.** A unique identifier (UUID) for the profile.                |
| `userId`              | `string`   | **Foreign Key.** The ID of the authenticated user who owns this profile.                  |
| `originalPortfolioUrl`| `string`   | The external portfolio URL that was submitted.                   |
| `firstName`           | `string`   | User's first name. **Required.** |
| `lastName`            | `string`   | User's last name. **Required.** |
| `summary`             | `string`   | A personal bio or summary text. |
| `experiences`         | `array`    | An array of `Experience` objects.                                           |
| `status`              | `string`   | The profile's state. Enum: `"pending_review"`, `"published"`. |
| `process`              | `string`   | The profile's state. Enum: `"fail"`, `"success"`. |
| `createdAt`           | `datetime` | ISO 8601 timestamp for creation. |
| `updatedAt`           | `datetime` | ISO 8601 timestamp for the last update.                                      |

#### `Experience`
A sub-document within a `Profile`, representing a single work experience.

| Field                  | Type      | Description                                                    |
| ---------------------- | --------- | -------------------------------------------------------------- |
| `id`                   | `string`  | A unique identifier (UUID) for the experience item.                 |
| `jobTitle`             | `string`  | **Required.** The title of the role.                                   |
| `employerOrClient`     | `string`  | **Required.** The name of the company or client.                            |
| `startDate`            | `string`  | **Required.** The start date in `"YYYY-MM-DD"` format. |
| `endDate`              | `string`  | The end date in `"YYYY-MM-DD"` format. Can be `null` or empty for "Present". |
| `employmentType`       | `string`  | **Required.** Enum: `"full-time"`, `"contract"`, `"part-time"`, `"freelance"`, `"other"`. |
| `contributionSummary`  | `string`  | A description of the work performed.              |
| `videos`               | `array`   | An array of `Video` objects associated with this experience. |

#### `Video`
A sub-document within an `Experience`, representing a work sample.

| Field       | Type     | Description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| `id`        | `string` | A unique identifier (UUID) for the video item.                 |
| `title`     | `string` | **Required.** The title of the video or work sample. |
| `url`       | `string` | **Required.** The URL link to the work sample.                 |

---

### API Endpoints

#### 1. Create Profile from URL

Initiates the creation of a new profile by scraping a provided URL. The backend should parse the content, create a new `Profile` record with `status: "pending_review"`, and return the `profileId`.

- **Endpoint:** `POST /api/profiles`
- **Request Body Format:**
 
      {
        "portfolioUrl": "https://example-portfolio.com"
      }
      Success Response Format (201 Created):
    
        Error Response Format:
            400 Bad Request: { "error": "Portfolio URL is required." }
            500 Internal Server Error: { "error": "Failed to process portfolio." }

#### 2. Get Profile by ID

Retrieves a single, complete profile object. This endpoint should be publicly accessible.

-  **Endpoint:** GET /api/profiles/{profileId}
-  **Request Format:**
   
        URL parameter profileId is required.
        Success Response Format (200 OK):
    
        {
          "profileId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
          "userId": "user-abc-123",
          "firstName": "Jane",
          "lastName": "Doe",
          // ... all other fields from the Profile model
        }
    
        Error Response Format:
        404 Not Found: { "error": "Profile not found." }

#### 3. Update Profile

Updates an existing profile. This should be an authenticated endpoint. On the first successful update, the status should be changed to "published".

-   **Endpoint:** PUT /api/profiles/{profileId}
-   **Request Body Format:**
    
        A partial Profile object containing only the fields to be updated. The frontend will send the entire ProfileData section (firstName, lastName, summary, experiences).
    
        {
          "firstName": "Jane Updated",
          "lastName": "Doe",
          "summary": "An updated summary...",
          "experiences": [ /* full, updated array of experiences */ ]
        }
      
        Success Response Format (200 OK):
      
          {
            "message": "Profile updated successfully."
          }
      
          Error Response Format:
              403 Forbidden: { "error": "User does not have permission to edit this profile." }
              404 Not Found: { "error": "Profile not found." }
              422 Unprocessable Entity: If validation fails (e.g., required fields are empty). { "errors": { "firstName": "First name is required." } }



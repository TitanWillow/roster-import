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
  ```json
  {
    "portfolioUrl": "[https://example-portfolio.com](https://example-portfolio.com)"
  }
  Success Response Format (201 Created):

    Error Response Format:
        400 Bad Request: { "error": "Portfolio URL is required." }
        500 Internal Server Error: { "error": "Failed to process portfolio." }

2. Get Profile by ID

Retrieves a single, complete profile object. This endpoint should be publicly accessible.

    Endpoint: GET /api/profiles/{profileId}
    Request Format:
        URL parameter profileId is required.
    Success Response Format (200 OK):
    JSON

    {
      "profileId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "userId": "user-abc-123",
      "firstName": "Jane",
      "lastName": "Doe",
      // ... all other fields from the Profile model
    }

    Error Response Format:
        404 Not Found: { "error": "Profile not found." }

3. Update Profile

Updates an existing profile. This should be an authenticated endpoint. On the first successful update, the status should be changed to "published".

    Endpoint: PUT /api/profiles/{profileId}
    Request Body Format:
        A partial Profile object containing only the fields to be updated. The frontend will send the entire ProfileData section (firstName, lastName, summary, experiences).
    JSON

{
  "firstName": "Jane Updated",
  "lastName": "Doe",
  "summary": "An updated summary...",
  "experiences": [ /* full, updated array of experiences */ ]
}

Success Response Format (200 OK):
JSON

    {
      "message": "Profile updated successfully."
    }

    Error Response Format:
        403 Forbidden: { "error": "User does not have permission to edit this profile." }
        404 Not Found: { "error": "Profile not found." }
        422 Unprocessable Entity: If validation fails (e.g., required fields are empty). { "errors": { "firstName": "First name is required." } }



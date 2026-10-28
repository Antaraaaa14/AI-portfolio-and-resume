# REST API Reference Manual
## NexusPortfolio AI API (:5001)

All endpoints return JSON responses adhering to the following structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional status message"
}
```

---

### 1. Portfolio Management Endpoints (`/api/portfolio`)

#### `GET /api/portfolio`
Fetches the active candidate portfolio record.
- **Query Params**: None
- **Response**: Full `Portfolio` object containing all 10 modules.
- **Example**:
  ```bash
  curl -X GET http://localhost:5001/api/portfolio
  ```

#### `PUT /api/portfolio/:section`
Updates or appends items to a specific module section.
- **Path Params**: `section` (e.g. `personalInfo`, `skills`, `experience`, `projects`, `certifications`, `education`, `achievements`, `publications`, `languages`)
- **Request Body**: JSON payload corresponding to the section schema.
- **Example**:
  ```bash
  curl -X PUT http://localhost:5001/api/portfolio/skills \
    -H "Content-Type: application/json" \
    -d '{ "name": "TypeScript", "category": "Languages", "proficiency": "Intermediate", "yearsExperience": 1 }'
  ```

#### `DELETE /api/portfolio/:section/:itemId`
Deletes an item from an array module by its ID.
- **Path Params**: `section`, `itemId`
- **Example**:
  ```bash
  curl -X DELETE http://localhost:5001/api/portfolio/skills/653f1234abcd5678ef901234
  ```

#### `POST /api/portfolio/reset-sample`
Resets the database with Antara Palwankar's comprehensive portfolio data.
- **Request Body**: Empty
- **Response**: `{ success: true, message: "Sample portfolio reset successfully" }`

#### `POST /api/portfolio/parse-unstructured`
Parses raw unstructured text (such as an existing resume or LinkedIn profile) using Gemini AI.
- **Request Body**:
  ```json
  {
    "rawText": "Antara Palwankar, B.Tech CSE student at ITM Skills University. Proficient in HTML5, CSS3, JavaScript, Python..."
  }
  ```
- **Response**: Structured JSON categorized into schema fields ready to save.

---

### 2. Resume Generation & AI Endpoints (`/api/resume`)

#### `POST /api/resume/analyze-jd`
Sends target Job Description text to Gemini AI for keyword extraction and overlap scoring.
- **Request Body**:
  ```json
  {
    "jobDescription": "Looking for a Frontend Intern proficient in HTML5, CSS3, JavaScript, and responsive layouts..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "matchScore": 94,
      "requiredSkills": ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      "softSkills": ["Problem Solving", "Teamwork"],
      "missingSkills": [],
      "suggestions": ["Highlight web development projects and live demo links."],
      "tailoredSummary": "Motivated B.Tech CSE student specializing in responsive frontend development..."
    }
  }
  ```

#### `POST /api/resume/generate`
Generates a verified, customized resume object with anti-hallucination verification.
- **Request Body**:
  ```json
  {
    "jobDescription": "Frontend Web Development Intern JD...",
    "template": "modern",
    "selectedSkills": ["id1", "id2"],
    "selectedProjects": ["id3"],
    "selectedExperience": ["id4"],
    "customSummary": "Tailored summary..."
  }
  ```
- **Response**: Resume payload containing verified fields and `antiHallucinationReport` (`{ verified: true, score: 100 }`).

#### `POST /api/resume/export-pdf`
Generates and downloads an ATS-compliant vector PDF.
- **Request Body**: Same parameters as `/generate`.
- **Response**: Binary `application/pdf` stream with `Content-Disposition: attachment; filename="resume.pdf"`.

#### `POST /api/resume/export-docx`
Generates and downloads an editable Microsoft Word document.
- **Request Body**: Same parameters as `/generate`.
- **Response**: Binary `application/vnd.openxmlformats-officedocument.wordprocessingml.document` stream with `Content-Disposition: attachment; filename="resume.docx"`.

#### `GET /api/resume/sample-jds`
Returns two pre-configured, tested Job Descriptions:
1. Frontend & Web Development Intern (PixelCraft Technologies)
2. Junior Software Engineer / C++ & Python Trainee (NexGen Systems)

---

### 3. Google Sheets Synchronization (`/api/portfolio/sheets`)

#### `GET /api/portfolio/sheets/export-xlsx`
Generates and streams an 8-worksheet Excel `.xlsx` workbook.
- **Response**: Binary Excel file buffer containing all portfolio records neatly styled and partitioned into 8 tabs.

#### `POST /api/portfolio/sheets/sync-webhook`
Pushes active MongoDB portfolio records to a deployed Google Apps Script Web App URL.
- **Request Body**:
  ```json
  {
    "webhookUrl": "https://script.google.com/macros/s/AKfycbx.../exec"
  }
  ```
- **Response**: Confirmation from Google Apps Script acknowledging synced tabs and row counts.

---

### 4. Configuration & Health Endpoints (`/api/settings`)

#### `GET /api/settings`
Returns status of Gemini API, MongoDB connection, and Webhook configuration.

#### `POST /api/settings/gemini-key`
Saves or overrides the active Gemini API key and preferred model name.

#### `GET /api/settings/test-gemini`
Tests live round-trip latency to the Google Gemini API.

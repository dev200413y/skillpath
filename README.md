# JobPilot FreeStack 🚀

A fully AI-optimized, zero-cost job aggregator platform.
Built with **Next.js**, **Google Sheets**, **Gemini AI**, and **GitHub Actions**.

## 🌟 Features
-   **Zero Cost**: Runs entirely on free tiers.
-   **AI Powered**: Auto-generates SEO titles, descriptions, and keywords using Gemini.
-   **Automated**: Pushes data from Google Sheets to GitHub -> Deploys to Hostinger.
-   **Premium UI**: Glassmorphism design, dark mode, mobile-responsive.
-   **SEO Ready**: Schema.org `JobPosting` markup, sitemaps, and optimized meta tags.

## 🛠️ Setup Guide

### 1. Google Sheets (The CMS)
1.  Create a new Google Sheet.
2.  Add headers: `Title`, `Company`, `Link`, `Location`, `Description`, `SEO Title`, `Keywords`, `Summary`, `Schema`.
3.  **Extensions > Apps Script**: Paste the content of `scripts/ai-enrichment.js`.
4.  **Project Settings > Script Properties**:
    -   `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/).
    -   `GITHUB_TOKEN`: Generate a [Personal Access Token](https://github.com/settings/tokens) (Classic) with `repo` scope.
    -   `GITHUB_REPO`: Your username/repo (e.g., `johndoe/jobpilot`).
    -   `GITHUB_PATH`: `data/jobs.json`.

### 2. GitHub Repository
1.  Push this code to GitHub.
2.  **Settings > Secrets and variables > Actions**:
    -   `FTP_SERVER`: Your Hostinger FTP Host (e.g., `ftp.domain.com`).
    -   `FTP_USERNAME`: Your FTP User.
    -   `FTP_PASSWORD`: Your FTP Password.

### 3. Usage
1.  Add a job to the Sheet.
2.  **JobPilot AI > Enrich Selected Row**.
3.  **JobPilot AI > Sync to Website**.
4.  Wait for GitHub Action to finish.
5.  Your site is live!

## 📂 Project Structure
-   `src/app`: Next.js App Router pages.
-   `src/components`: UI Components (JobCard, Navbar).
-   `src/lib`: Data fetching logic.
-   `scripts`: Google Apps Script code.
-   `data`: JSON data storage.
-   `.github/workflows`: Deployment automation.

## 📄 License
MIT

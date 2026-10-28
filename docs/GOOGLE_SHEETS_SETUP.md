# Google Sheets Integration & Apps Script Deployment Guide

This guide explains how to set up bi-directional synchronization between the **NexusPortfolio AI** database and **Google Sheets**.

---

### Method 1: Instant Multi-Tab Excel / Spreadsheet Export (Zero Setup Required)

If you need a styled Google Sheet or Excel workbook immediately without setting up scripts:
1. In the web application, navigate to the **Google Sheets Sync** tab in the top navigation bar.
2. Click the green button **Download Excel / Sheet (.xlsx)**.
3. The server generates an 8-tab workbook (`Portfolio_Database_Antara_Palwankar.xlsx`) containing:
   - `Personal_Info`
   - `Skills`
   - `Experience`
   - `Projects`
   - `Certifications`
   - `Education`
   - `Achievements`
   - `Publications`
4. In Google Drive, click **New > File upload** and select the `.xlsx` file.
5. Click **Open with > Google Sheets**. Google Sheets preserves all 8 tabs, formatting, and header styles!

---

### Method 2: Live Webhook Synchronization (Google Apps Script)

To enable live, automated one-click syncing from the web app to a live Google Sheet:

#### Step 1: Create a Google Spreadsheet
1. Open [Google Sheets](https://sheets.new) in your web browser.
2. Give your spreadsheet a title, e.g., `Antara Palwankar - Portfolio Database`.

#### Step 2: Open the Apps Script Editor
1. In the top menu of your Google Sheet, click **Extensions > Apps Script**.
2. Delete any boilerplate code inside the script editor (`function myFunction() { ... }`).

#### Step 3: Paste the System Script
1. Open the file [`apps-script/Code.gs`](file:///Users/antarapalwankar/Desktop/ai-portfolio-resume-system/apps-script/Code.gs) located in this repository.
2. Copy the entire contents and paste it into the Apps Script editor.
3. Click the **Save** floppy icon (or press `Cmd + S` / `Ctrl + S`).

#### Step 4: Deploy as a Web App
1. In the top right corner of the Apps Script editor, click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Portfolio Sync Webhook`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Note: This allows the backend server to POST updates to your sheet without OAuth tokens)*.
4. Click **Deploy**.
5. Grant required permissions when prompted (select your Google account, click *Advanced*, then *Go to Portfolio Sync (unsafe)*, then *Allow*).
6. Copy the **Web App URL** provided (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

#### Step 5: Connect and Synchronize
1. Open the **NexusPortfolio AI** application at `http://localhost:5173`.
2. Click on the **Google Sheets Sync** tab.
3. Paste the copied Web App URL into the **Google Apps Script Webhook URL** input field.
4. Click **Sync to Google Sheets Webhook**.
5. The application sends the active MongoDB database to your sheet. Within seconds, your Google Sheet will automatically populate all 8 tabs with navy blue headers, zebra row striping, and auto-adjusted columns!

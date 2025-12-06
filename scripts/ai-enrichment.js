/**
 * JobPilot FreeStack - AI Enrichment & GitHub Sync
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Project Settings > Script Properties:
 *    - GEMINI_API_KEY: Your Gemini API Key
 *    - GITHUB_TOKEN: Your GitHub Personal Access Token (Repo scope)
 *    - GITHUB_REPO: username/repo-name (e.g., 'yourname/jobpilot')
 *    - GITHUB_PATH: data/jobs.json
 */

const PROPS = PropertiesService.getScriptProperties();
const GEMINI_API_KEY = PROPS.getProperty('GEMINI_API_KEY');
const GITHUB_TOKEN = PROPS.getProperty('GITHUB_TOKEN');
const GITHUB_REPO = PROPS.getProperty('GITHUB_REPO');
const GITHUB_PATH = PROPS.getProperty('GITHUB_PATH') || 'data/jobs.json';
const MODEL_NAME = 'gemini-1.5-flash';

function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('SkillPath AI')
        .addItem('1. Enrich Selected Row', 'enrichSelectedRow')
        .addItem('2. Sync to Website (GitHub)', 'syncToGitHub')
        .addToUi();
}

function enrichSelectedRow() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const row = sheet.getActiveRange().getRow();

    // Columns: A=Title, B=Company, C=Link, D=Location, E=Description, F=SEO Title, G=Keywords, H=Summary, I=Schema
    const title = sheet.getRange(row, 1).getValue();
    const company = sheet.getRange(row, 2).getValue();
    const location = sheet.getRange(row, 4).getValue();

    if (!title || !company) {
        SpreadsheetApp.getUi().alert('Please enter Title and Company first.');
        return;
    }

    const prompt = `
    You are an expert SEO copywriter for a job board.
    Write a compelling, SEO-optimized job description for:
    Role: ${title}
    Company: ${company}
    Location: ${location}
    
    Output strictly in JSON format with these fields:
    - description: A rich HTML description (use <h3>, <p>, <ul>) with "About Company", "Role Responsibilities", "Requirements".
    - seoTitle: A catchy SEO title (max 60 chars).
    - keywords: Comma-separated high-volume keywords.
    - summary: A 2-sentence summary for meta description.
    - schema: A valid JSON-LD JobPosting schema object (stringified).
  `;

    try {
        const response = callGemini(prompt);
        const data = JSON.parse(cleanJson(response));

        sheet.getRange(row, 5).setValue(data.description);
        sheet.getRange(row, 6).setValue(data.seoTitle);
        sheet.getRange(row, 7).setValue(data.keywords);
        sheet.getRange(row, 8).setValue(data.summary);
        sheet.getRange(row, 9).setValue(JSON.stringify(data.schema));

        SpreadsheetApp.getUi().alert('Enrichment Complete!');
    } catch (e) {
        SpreadsheetApp.getUi().alert('Error: ' + e.toString());
    }
}

function callGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText()).candidates[0].content.parts[0].text;
}

function cleanJson(text) {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

function syncToGitHub() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const headers = rows.shift();

    const jobs = rows.map(row => ({
        title: row[0],
        company: row[1],
        link: row[2],
        location: row[3],
        description: row[4],
        seoTitle: row[5],
        keywords: row[6],
        summary: row[7],
        schema: row[8],
        slug: convertToSlug(row[0] + '-' + row[1]),
        datePosted: new Date().toISOString().split('T')[0] // Simple date
    })).filter(j => j.title && j.description);

    const content = JSON.stringify(jobs, null, 2);
    const sha = getFileSha();

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
    const payload = {
        message: 'Update jobs data via JobPilot AI',
        content: Utilities.base64Encode(content),
        sha: sha
    };

    const options = {
        method: 'put',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        payload: JSON.stringify(payload)
    };

    try {
        UrlFetchApp.fetch(url, options);
        SpreadsheetApp.getUi().alert('Success! Website is rebuilding...');
    } catch (e) {
        SpreadsheetApp.getUi().alert('GitHub Error: ' + e.toString());
    }
}

function getFileSha() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
    const options = {
        method: 'get',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` },
        muteHttpExceptions: true
    };
    const res = UrlFetchApp.fetch(url, options);
    if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText()).sha;
    }
    return null; // File doesn't exist yet
}

function convertToSlug(text) {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}

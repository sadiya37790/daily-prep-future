// api/db.js
// Vercel serverless function proxying requests to the Google Sheets Apps Script URL.
// This resolves CORS issues and prevents browser extensions from blocking database calls.

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || "https://script.google.com/macros/s/AKfycbz8uQlLUghtZPMM77DrdYp0-LyYeX1GekT_2BcM6SCS36lGaiKVw4gjypCRtH9LvyM5qA/exec";

module.exports = async (req, res) => {
  // CORS configuration headers to support local testing under file:// protocol
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(GOOGLE_SHEETS_URL);
      const data = await response.json();
      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: body
      });
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      return res.status(405).json({ status: "error", message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Vercel Serverless Proxy Error:", error);
    return res.status(500).json({ status: "error", message: error.toString() });
  }
};

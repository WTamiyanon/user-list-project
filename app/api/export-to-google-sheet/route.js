import { google } from 'googleapis';

export async function POST(req) {
  try {
    const { filteredData } = await req.json();

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("Missing Google API credentials in environment variables");
    }

    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      throw new Error("Invalid or empty data received for export");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // ใช้ Spreadsheet ID และชื่อ Sheet ที่ระบุ
    const spreadsheetId = '1eqgXRJVjBWp3AMw6ErVM066s7LozpC2pHiUsIHO-raw';
    const sheetName = 'Sheet1';

    // เพิ่มข้อมูลใน Google Sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}`,
      valueInputOption: 'RAW',
      resource: {
        values: [
          Object.keys(filteredData[0]), // Header
          ...filteredData.map(Object.values), // Data rows
        ],
      },
    });

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    return new Response(JSON.stringify({ url: spreadsheetUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error exporting data to Google Sheet:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

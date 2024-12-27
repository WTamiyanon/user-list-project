import { google } from "googleapis";

export async function GET() {
  try {
    // ตั้งค่า Google Auth ด้วย Environment Variables
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // ดึง Spreadsheet ID และช่วงข้อมูลจาก Environment Variables
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "user_mock_data"; // ระบุช่วงข้อมูลที่ต้องการ

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "No data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // แยก Header กับ Data ออก
    const [headers, ...data] = rows;

    // จัดรูปแบบข้อมูลให้อยู่ในรูปแบบ JSON และปรับชื่อ key
    const formattedData = data.map((row) =>
      headers.reduce((acc, header, index) => {
        const normalizedHeader = header === "job_title" ? "jobTitle" : header; // เปลี่ยนชื่อ `job_title` เป็น `jobTitle`
        acc[normalizedHeader] = row[index] || "";
        return acc;
      }, {})
    );

    // ส่งข้อมูลกลับในรูปแบบ JSON
    return new Response(JSON.stringify({ data: formattedData }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);

    // ส่งข้อความ Error ในรูปแบบ JSON
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

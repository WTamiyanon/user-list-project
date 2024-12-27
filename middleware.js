import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/', // หากไม่ได้ล็อกอิน จะ Redirect ไปหน้า login
  },
});

export const config = {
  matcher: ['/dashboard/view-data', '/dashboard/:path*'], // ระบุเฉพาะเส้นทางที่ต้องการตรวจสอบ
};

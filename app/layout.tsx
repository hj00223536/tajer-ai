import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TAJER AI — مساعدك التجاري الذكي',
  description: 'أنشئ إعلانات ومنشورات وأوصاف منتجات بالعربية والإنجليزية باستخدام TAJER AI.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}

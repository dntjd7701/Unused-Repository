import type { Metadata } from 'next';
import './globals.scss';
import Gnb from '@/components/Gnb/gnb';

export const metadata: Metadata = {
  title: 'WS Playground',
  // description: 'Vanilla / React로 UI요소 만들기',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ko'>
      <body>
        <Gnb />
        <main>{children}</main>
      </body>
    </html>
  );
};
export default Layout;

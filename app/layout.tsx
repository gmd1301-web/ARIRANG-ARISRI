import type { Metadata } from 'next';
import './globals.css';
import './refinement.css';
import './details.css';
import './traditional.css';
import './story-map.css';
import './studio-built.css';
import './visual-polish.css';
import './map-pin-fix.css';
import './studio-screenshot.css';
import './incredibox.css';
import './font-system.css';
import './studio-view-fixes.css';
import './brush-title.css';
import './typography-system.css';
export const metadata: Metadata = { title: '아리랑 — 우리의 노래, 우리의 이야기', description: '아리랑을 듣고, 지역의 이야기를 만나고, 일곱 악기로 함께 연주하는 디지털 웹전시', openGraph: { title: '아리랑', description: '우리의 노래, 우리의 이야기' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }

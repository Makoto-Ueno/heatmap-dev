import Image from 'next/image';
import { Inter } from 'next/font/google';
import { Editor } from '@/components/Editor';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main>
      <Editor />
    </main>
  );
}

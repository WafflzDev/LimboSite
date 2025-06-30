"use client";
import { useRouter, usePathname } from 'next/navigation';
import styles from './NavBar.module.css';

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <button
        className={pathname === '/' ? styles.active : ''}
        onClick={() => router.push('/')}
      >
        Victors List
      </button>
      <button
        className={pathname === '/progress' ? styles.active : ''}
        onClick={() => router.push('/progress')}
      >
        Progress
      </button>
    </nav>
  );
}
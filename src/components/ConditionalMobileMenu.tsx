"use client";

import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';

export default function ConditionalMobileMenu() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Only render the MobileMenu if we're not on an admin page
  if (isAdminPage) {
    return null;
  }
  
  return <MobileMenu />;
}

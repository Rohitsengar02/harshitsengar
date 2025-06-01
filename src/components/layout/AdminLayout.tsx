"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Menu, X, Home, User, Briefcase, Cpu, 
  Mail, LogOut, Settings, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import AdminMobileMenu from './AdminMobileMenu';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/context/ThemeProvider';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
    { name: 'Projects', icon: <Briefcase size={20} />, path: '/admin/projects' },
    { name: 'Skills', icon: <Cpu size={20} />, path: '/admin/skills' },
    { name: 'About', icon: <User size={20} />, path: '/admin/about' },
    { name: 'Messages', icon: <Mail size={20} />, path: '/admin/messages' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Top Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/20 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/admin" className="ml-3 font-semibold text-xl text-gray-900 dark:text-gray-100">
            Admin Panel
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline hidden md:block">
            View Website
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar - for larger screens or when toggled on mobile */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <>
              {/* Overlay for mobile - closes sidebar when clicked */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-20"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              
              {/* Actual sidebar */}
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/20 w-64 py-4 z-30 ${isMobile ? 'fixed h-full' : 'relative'}`}
              >
                <div className="flex justify-between items-center px-4 mb-6">
                  <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">Harshit Sengar</h2>
                  {isMobile && (
                    <button 
                      onClick={() => setSidebarOpen(false)} 
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-1 px-3">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path || 
                                    (item.path !== '/admin' && pathname.startsWith(item.path));
                    
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => isMobile && setSidebarOpen(false)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                        {isActive && (
                          <ChevronRight size={16} className="ml-auto" />
                        )}
                      </Link>
                    );
                  })}
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 px-6">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      
      {/* Mobile bottom menu - Will be added later as a separate component */}
      {isMobile && <AdminMobileMenu pathname={pathname} />}
    </div>
    </ThemeProvider>
  );
};

export default AdminLayout;

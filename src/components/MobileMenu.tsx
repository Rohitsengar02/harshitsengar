"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Briefcase, Mail, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileMenu = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'About', icon: <User size={20} />, path: '/about' },
    { name: 'Projects', icon: <Briefcase size={20} />, path: '/projects' },
    { name: 'Contact', icon: <Mail size={20} />, path: '/contact' },
    { name: 'Admin', icon: <Settings size={20} />, path: '/admin' },
  ];

  return (
    <motion.nav
      className="mobile-menu md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.path}
            className={`flex flex-col items-center py-1 px-3 ${
              pathname === item.path 
                ? 'text-primary font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
};

export default MobileMenu;

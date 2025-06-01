"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Briefcase, Cpu, User, Mail, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminMobileMenuProps {
  pathname: string;
}

const AdminMobileMenu = ({ pathname }: AdminMobileMenuProps) => {
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
    { name: 'Projects', icon: <Briefcase size={20} />, path: '/admin/projects' },
    { name: 'Skills', icon: <Cpu size={20} />, path: '/admin/skills' },
    { name: 'About', icon: <User size={20} />, path: '/admin/about' },
    { name: 'Messages', icon: <Mail size={20} />, path: '/admin/messages' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10 md:hidden"
    >
      <div className="flex justify-between items-center px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || 
                          (item.path !== '/admin' && pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomIndicator"
                  className="absolute bottom-0 h-1 w-12 bg-blue-600 rounded-t-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AdminMobileMenu;

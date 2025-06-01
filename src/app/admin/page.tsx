"use client";

import { useState, useEffect } from 'react';
import { Briefcase, User, Mail, Grid3X3, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getProjects, getContactMessages, getSkills, getHeaders } from '@/lib/firebase';

export default function AdminDashboard() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);
  const [headersCount, setHeadersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get counts of various items
        const projects = await getProjects();
        setProjectsCount(projects.length);

        const messages = await getContactMessages();
        setMessagesCount(messages.length);
        setUnreadMessagesCount(messages.filter((msg: any) => !msg.read).length);

        const skills = await getSkills();
        setSkillsCount(skills.length);

        const headers = await getHeaders();
        setHeadersCount(headers.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardCards = [
    {
      title: 'Projects',
      count: projectsCount,
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      link: '/admin/projects',
      color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Skills',
      count: skillsCount,
      icon: <Grid3X3 className="h-8 w-8 text-green-500" />,
      link: '/admin/skills',
      color: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Header',
      count: headersCount,
      icon: <LayoutTemplate className="h-8 w-8 text-orange-500" />,
      link: '/admin/header/all',
      color: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Profile',
      count: 1,
      icon: <User className="h-8 w-8 text-purple-500" />,
      link: '/admin/about',
      color: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Messages',
      count: messagesCount,
      unread: unreadMessagesCount,
      icon: <Mail className="h-8 w-8 text-yellow-500" />,
      link: '/admin/messages',
      color: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Welcome to your portfolio dashboard. Manage your content from here.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={card.link}>
                <div className={`${card.color} rounded-xl p-6 h-full transition-transform hover:scale-105 cursor-pointer`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h2>
                      <div className="mt-4 flex items-baseline">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.count}</p>
                        {card.unread && card.unread > 0 && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full">
                            {card.unread} unread
                          </span>
                        )}
                      </div>
                    </div>
                    {card.icon}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/projects/add">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </div>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Add New Project</span>
              </div>
            </div>
          </Link>
          <Link href="/admin/skills/add">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                  <Grid3X3 className="h-5 w-5 text-green-500" />
                </div>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Add New Skill</span>
              </div>
            </div>
          </Link>
          <Link href="/admin/about">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                  <User className="h-5 w-5 text-purple-500" />
                </div>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Update Profile</span>
              </div>
            </div>
          </Link>
          <Link href="/admin/header">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                  <LayoutTemplate className="h-5 w-5 text-orange-500" />
                </div>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Manage Header</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

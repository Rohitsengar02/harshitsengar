"use client";

import { motion } from 'framer-motion';
import { Code, Database, Layout, Server, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSkills } from '@/lib/firebase';

// Fallback skills data
const fallbackSkills = [
  { name: 'React', category: 'Frontend', icon: <Code size={24} /> },
  { name: 'Next.js', category: 'Frontend', icon: <Layout size={24} /> },
  { name: 'Node.js', category: 'Backend', icon: <Server size={24} /> },
  { name: 'Firebase', category: 'Backend', icon: <Database size={24} /> },
  { name: 'TypeScript', category: 'Language', icon: <Code size={24} /> },
  { name: 'Tailwind CSS', category: 'Frontend', icon: <Layout size={24} /> },
];

export default function Skills() {
  const [skills, setSkills] = useState(fallbackSkills);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // If you have a getSkills function in your firebase.ts, uncomment this
        // const skillsData = await getSkills();
        // if (skillsData && skillsData.length > 0) {
        //   setSkills(skillsData);
        // }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(skills.map(skill => skill.category))];

  // Filter skills by active category
  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend':
        return <Layout size={16} />;
      case 'Backend':
        return <Server size={16} />;
      case 'Language':
        return <Code size={16} />;
      default:
        return <Star size={16} />;
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Skills & Expertise</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here are the technologies and tools I specialize in. I'm constantly learning and adding new skills to my repertoire.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))
          ) : (
            // Actual skills
            filteredSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {skill.icon || <Star size={24} />}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{skill.name}</h3>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  {getCategoryIcon(skill.category)}
                  <span className="ml-1">{skill.category}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from 'framer-motion';
import { Code, Layout, Smartphone, Database, PenTool, Search } from 'lucide-react';

// Services data
const services = [
  {
    title: 'Frontend Development',
    description: 'Creating responsive, interactive and user-friendly web interfaces using React and Next.js.',
    icon: <Layout size={24} />,
  },
  {
    title: 'Backend Development',
    description: 'Building robust server-side applications and APIs using Node.js and Firebase.',
    icon: <Database size={24} />,
  },
  {
    title: 'Mobile-First Design',
    description: 'Designing websites that look great on all devices, with a focus on mobile experience.',
    icon: <Smartphone size={24} />,
  },
  {
    title: 'UI/UX Design',
    description: 'Creating beautiful user interfaces with intuitive user experiences.',
    icon: <PenTool size={24} />,
  },
  {
    title: 'Custom Web Applications',
    description: 'Developing tailored web applications to meet your specific business needs.',
    icon: <Code size={24} />,
  },
  {
    title: 'SEO Optimization',
    description: 'Improving website visibility and search engine rankings with SEO best practices.',
    icon: <Search size={24} />,
  },
];

export default function Services() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Services I Offer</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            As a MERN stack developer, I provide comprehensive web development services to help bring your ideas to life.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

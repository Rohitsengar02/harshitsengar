"use client";

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AlertCircle, Briefcase, Calendar, Download, GraduationCap, Mail, MapPin, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { About as AboutType, Education, Experience } from '@/types';
import { getAbout } from '@/lib/firebase';
import Link from 'next/link';

export default function About() {
  const [about, setAbout] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const aboutData = await getAbout();
        setAbout(aboutData);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading-xl mb-10 text-center">About Me</h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : !about ? (
            <div className="text-center py-10">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg inline-flex items-center">
                <span className="mr-2"><AlertCircle size={18} /></span>
                No profile information available yet.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Image & Contact */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="md:col-span-1 space-y-6"
              >
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {about.profileImage ? (
                      <Image 
                        src={about.profileImage} 
                        alt={about.name} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                        priority
                      />
                    ) : about.imageUrl ? (
                      <Image 
                        src={about.imageUrl} 
                        alt={about.name} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{about.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{about.title}</p>
                  
                  {/* Contact Information */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <h3 className="font-medium">Contact Information</h3>
                    
                    {about.email && (
                      <div className="flex items-start gap-2">
                        <Mail size={16} className="text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <a href={`mailto:${about.email}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                            {about.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {about.location && (
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{about.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Resume Download */}
                  {about.resumeUrl && (
                    <div className="mt-6">
                      <a 
                        href={about.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                      >
                        <Download size={18} />
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* About Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="md:col-span-2 space-y-8"
              >
                {/* Biography */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h2 className="heading-md mb-4">Biography</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    {about.bio && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{about.bio}</p>
                    )}
                    {about.bioExtended && (
                      <p className="text-gray-700 dark:text-gray-300">{about.bioExtended}</p>
                    )}
                  </div>
                </motion.div>

                {/* Education */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h2 className="heading-md mb-4 flex items-center gap-2">
                    <GraduationCap className="text-primary" />
                    Education
                  </h2>
                  
                  {about.education && about.education.length > 0 ? (
                    <div className="space-y-6">
                      {about.education.map((edu: Education, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="border-l-2 border-primary pl-4 py-1"
                        >
                          <h3 className="font-bold text-lg">{edu.degree}</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {edu.institution}
                            {edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar size={14} className="mr-1" />
                            {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                          </div>
                          {edu.description && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              {edu.description}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No education information available.</p>
                  )}
                </motion.div>

                {/* Experience */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h2 className="heading-md mb-4 flex items-center gap-2">
                    <Briefcase className="text-primary" />
                    Experience
                  </h2>
                  
                  {about.experience && about.experience.length > 0 ? (
                    <div className="space-y-6">
                      {about.experience.map((exp: Experience, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="border-l-2 border-primary pl-4 py-1"
                        >
                          <h3 className="font-bold text-lg">{exp.position}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{exp.company}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar size={14} className="mr-1" />
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </div>
                          {exp.description && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              {exp.description}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No experience information available.</p>
                  )}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </>
  );
}

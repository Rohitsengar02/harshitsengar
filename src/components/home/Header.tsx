"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAbout, getActiveHeader } from '@/lib/firebase';
import { About, HeaderData } from '@/types';

export default function Header() {
  const [profile, setProfile] = useState<About | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both profile and header data in parallel
        const [aboutData, headerContent] = await Promise.all([
          getAbout(),
          getActiveHeader()
        ]);
        
        setProfile(aboutData);
        setHeaderData(headerContent);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-white py-10 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {headerData?.subtitle || "Online Platform"}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
                {headerData?.title || profile?.name || "Harshit Sengar"}
              </h1>
            </div>
            
            <p className="text-gray-600 text-lg">
              {headerData?.description || "Join a vibrant community of learners and transform your aspirations into achievements starting today."}
            </p>
            
            <Link 
              href={headerData?.ctaLink || "/projects"} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md"
            >
              {headerData?.ctaText || "Get Started"}
              <ArrowRight size={18} />
            </Link>
            
            {headerData?.secondaryCtaText && (
              <Link 
                href={headerData.secondaryCtaLink || "/contact"}
                className="inline-flex items-center gap-2 px-6 py-3 ml-4 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
              >
                {headerData.secondaryCtaText}
                <ArrowRight size={18} />
              </Link>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{headerData?.totalProjects || "15+"}</div>
                <div className="text-gray-500 text-sm">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{headerData?.experience || "2"}{headerData?.experience === 1 ? " Year" : "+ Years"}</div>
                <div className="text-gray-500 text-sm">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{headerData?.rating || "4.9"}</div>
                <div className="text-gray-500 text-sm">Rating ({headerData?.reviewCount || "25"})</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[320px] md:h-[400px] bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl overflow-hidden"
          >
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            ) : (
              headerData?.bannerImage ? (
                <Image
                  src={headerData.bannerImage}
                  alt={headerData.title || profile?.name || 'Student'}
                  fill
                  className="object-contain"
                  priority
                />
              ) : profile?.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile?.name || 'Student'}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-r from-orange-100 to-pink-100">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-64 h-64 rounded-full bg-orange-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 text-6xl font-bold text-orange-500">
                      {profile?.name?.charAt(0) || 'H'}
                    </div>
                    <div className="absolute bottom-10 right-10 bg-white p-4 rounded-xl shadow-lg">
                      <div className="text-orange-500 font-bold text-xl">Let's Learn!</div>
                      <div className="text-gray-600">Start your journey</div>
                    </div>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Fallback testimonials data
const fallbackTestimonials = [
  {
    id: '1',
    name: 'Rahul Kumar',
    position: 'Project Manager',
    company: 'TechSolutions India',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1583304962/samples/people/smiling-man.jpg',
    testimonial: 'Harshit delivered exceptional work on our e-commerce project. His frontend skills and attention to detail made our website both beautiful and functional.',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    position: 'Startup Founder',
    company: 'InnovateX',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1583304962/samples/people/jazz.jpg',
    testimonial: 'Working with Harshit was a pleasure. He understood our requirements perfectly and delivered a website that exceeded our expectations.',
  },
  {
    id: '3',
    name: 'Vikram Singh',
    position: 'UX Director',
    company: 'DesignHub',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1583304962/samples/people/boy-snow-hoodie.jpg',
    testimonial: "Harshit's technical skills combined with his design sensibility make him a rare find. He transformed our concept into a beautiful, responsive website.",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // If you have a getTestimonials function in firebase.ts, uncomment this
        // const testimonialsData = await getTestimonials();
        // if (testimonialsData && testimonialsData.length > 0) {
        //   setTestimonials(testimonialsData);
        // }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Navigate to previous testimonial
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next testimonial
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Client Testimonials</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            What others say about working with me and the results we've achieved together.
          </p>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            // Loading skeleton
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="relative">
              {/* Testimonial card */}
              <motion.div
                key={testimonials[activeIndex].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md relative"
              >
                <div className="absolute top-6 left-6 text-primary opacity-20">
                  <Quote size={48} />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg italic">
                    "{testimonials[activeIndex].testimonial}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-16 h-16 relative mr-4">
                      {testimonials[activeIndex].avatar ? (
                        <Image
                          src={testimonials[activeIndex].avatar}
                          alt={testimonials[activeIndex].name}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-400">
                            {testimonials[activeIndex].name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {testimonials[activeIndex].name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonials[activeIndex].position}, {testimonials[activeIndex].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation buttons */}
              <div className="flex justify-center mt-6 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      activeIndex === index
                        ? 'bg-primary'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

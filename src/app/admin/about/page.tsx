// src/app/admin/about/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { getAbout, getAboutById, updateAbout, createAbout, uploadFile, deleteFile } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, List, Plus, Trash2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { About, Education, Experience } from '@/types';
import Link from 'next/link';

export default function AboutAdmin() {
  const searchParams = useSearchParams();
  const idFromQuery = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [aboutId, setAboutId] = useState<string | null>(idFromQuery);
  
  // State for basic info
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    title: '',
    bio: '',
    bioExtended: '',
    email: '',
    location: '',
    resumeUrl: '',
  });
  
  // State for education and experience
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('basic');
  
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        let aboutData;
        
        if (idFromQuery) {
          // If we have an ID from the query, load that specific about entry
          aboutData = await getAboutById(idFromQuery);
          if (aboutData) {
            setAboutId(aboutData.id);
          } else {
            setError('About entry not found');
          }
        } else {
          // Otherwise load the default (first) about entry
          const allAboutData = await getAbout();
          if (allAboutData && Array.isArray(allAboutData) && allAboutData.length > 0) {
            aboutData = allAboutData[0];
            setAboutId(aboutData.id);
          }
        }
        
        if (aboutData) {
          setBasicInfo({
            name: aboutData.name || '',
            title: aboutData.title || '',
            bio: aboutData.bio || '',
            bioExtended: aboutData.bioExtended || '',
            email: aboutData.email || '',
            location: aboutData.location || '',
            resumeUrl: aboutData.resumeUrl || '',
          });
          
          if (aboutData.education && Array.isArray(aboutData.education)) {
            setEducation(aboutData.education);
          }
          
          if (aboutData.experience && Array.isArray(aboutData.experience)) {
            setExperience(aboutData.experience);
          }
          
          if (aboutData.profileImage) {
            setImagePreview(aboutData.profileImage);
            setOriginalImageUrl(aboutData.profileImage);
          } else if (aboutData.imageUrl) {
            setImagePreview(aboutData.imageUrl);
            setOriginalImageUrl(aboutData.imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        setError('Failed to load profile information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);
  
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Functions to add/edit/remove education items
  const handleAddEducation = () => {
    setEducation(prev => [
      ...prev,
      {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        description: '',
      }
    ]);
  };
  
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setEducation(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };
  
  const handleRemoveEducation = (index: number) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };
  
  // Functions to add/edit/remove experience items
  const handleAddExperience = () => {
    setExperience(prev => [
      ...prev,
      {
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false,
      }
    ]);
  };
  
  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    setExperience(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };
  
  const handleRemoveExperience = (index: number) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      let imageUrl = originalImageUrl;
      
      // Upload new image if selected
      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const fileName = `profile/${Date.now()}-${file.name}`;
        
        // Delete old image if it exists
        if (originalImageUrl && originalImageUrl.includes('firebase')) {
          try {
            const oldPath = originalImageUrl.split('?')[0].split('/o/')[1];
            if (oldPath) {
              await deleteFile(decodeURIComponent(oldPath));
            }
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
        
        imageUrl = await uploadFile(file, fileName);
      }
      
      const aboutData: Partial<About> = {
        ...basicInfo,
        profileImage: imageUrl,
        education,
        experience,
      };
      
      if (aboutId) {
        // Update existing about document
        await updateAbout(aboutId, aboutData);
      } else {
        // If no about data exists, create new one
        // Ensure all required fields are present for a new About document
        const newAboutData = {
          name: aboutData.name || '',
          title: aboutData.title || '',
          bio: aboutData.bio || '',
          email: aboutData.email || '',
          location: aboutData.location || '',
          profileImage: aboutData.profileImage || '',
          education: aboutData.education || [],
          experience: aboutData.experience || [],
          resumeUrl: aboutData.resumeUrl || ''
        };
        await createAbout(newAboutData);
      }
      
      setError('');
      setSaving(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {idFromQuery ? 'Edit Profile Information' : 'Profile Information'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {idFromQuery 
              ? 'Update the selected profile information'
              : 'Update your personal information, education, and work experience'
            }
          </p>
        </div>
        <Link href="/admin/about/all" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors shadow-sm">
          <List size={18} />
          View All About Entries
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'basic'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'education'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'experience'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Experience
            </button>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={basicInfo.name}
                      onChange={handleBasicInfoChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={basicInfo.title}
                      onChange={handleBasicInfoChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={basicInfo.email}
                      onChange={handleBasicInfoChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={basicInfo.location}
                      onChange={handleBasicInfoChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    id="resumeUrl"
                    name="resumeUrl"
                    value={basicInfo.resumeUrl}
                    onChange={handleBasicInfoChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/your-resume.pdf"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Link to your downloadable resume or CV
                  </p>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Bio *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={basicInfo.bio}
                    onChange={handleBasicInfoChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="A brief introduction"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="bioExtended" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Extended Bio
                  </label>
                  <textarea
                    id="bioExtended"
                    name="bioExtended"
                    value={basicInfo.bioExtended}
                    onChange={handleBasicInfoChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="A more detailed description about yourself"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile preview" 
                          className="h-full object-contain"
                        />
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                {education.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No education items added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                      Add Education
                    </button>
                  </div>
                ) : (
                  <div>
                    {education.map((edu, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Institution *
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                              required
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Degree *
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                              required
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              value={edu.fieldOfStudy || ''}
                              onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Start Year *
                              </label>
                              <input
                                type="text"
                                value={edu.startYear}
                                onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                End Year
                              </label>
                              <input
                                type="text"
                                value={edu.endYear || ''}
                                onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                                placeholder="Present"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={edu.description || ''}
                            onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Brief description of your studies"
                          ></textarea>
                        </div>
                      </motion.div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="mt-4 inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                      Add Another Education
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                {experience.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No experience items added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                      Add Experience
                    </button>
                  </div>
                ) : (
                  <div>
                    {experience.map((exp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Position *
                            </label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                              required
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Company *
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                              required
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Start Date *
                            </label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                              required
                              placeholder="Jan 2022"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              End Date
                            </label>
                            <input
                              type="text"
                              value={exp.endDate || ''}
                              onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                              placeholder="Present"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`current-${index}`}
                              checked={exp.current || false}
                              onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Current Position
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={exp.description || ''}
                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Describe your responsibilities and achievements"
                          ></textarea>
                        </div>
                      </motion.div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="mt-4 inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                      Add Another Experience
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
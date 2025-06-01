"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getSkill, updateSkill } from '@/lib/firebase';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Skill } from '@/types';

interface EditSkillParams {
  params: { id: string };
}

export default function EditSkill({ params }: EditSkillParams) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 75,
    description: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const skillData = await getSkill(id);
        
        if (skillData) {
          setFormData({
            name: skillData.name || '',
            category: skillData.category || '',
            proficiency: skillData.proficiency || 75,
            description: skillData.description || '',
          });
        } else {
          setError('Skill not found');
        }
      } catch (error) {
        console.error('Error fetching skill:', error);
        setError('Failed to load skill. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Skill name is required');
      }

      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }

      if (formData.proficiency < 0 || formData.proficiency > 100) {
        throw new Error('Proficiency must be between 0 and 100');
      }

      // Update skill in Firebase
      await updateSkill(id, {
        name: formData.name,
        category: formData.category,
        proficiency: formData.proficiency,
        description: formData.description,
        updatedAt: new Date().toISOString(),
      });

      // Redirect to skills list
      router.push('/admin/skills');
    } catch (error) {
      console.error('Error updating skill:', error);
      setError(error instanceof Error ? error.message : 'Failed to update skill. Please try again.');
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Skill</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Update the details of your skill
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skill Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., React.js, UI/UX Design"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>Select a category</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Design">Design</option>
                <option value="DevOps">DevOps</option>
                <option value="Tools">Tools</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Proficiency (%) *
              </label>
              <input
                type="range"
                id="proficiency"
                name="proficiency"
                min="0"
                max="100"
                step="5"
                value={formData.proficiency}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Beginner</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formData.proficiency}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Expert</span>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Brief description of your experience with this skill"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Link
              href="/admin/skills"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
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
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

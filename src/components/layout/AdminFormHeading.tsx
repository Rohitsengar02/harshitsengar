"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AdminFormHeadingProps {
  title: string;
  description?: string;
  backUrl?: string;
  backText?: string;
}

const AdminFormHeading = ({ 
  title, 
  description,
  backUrl = '/admin', 
  backText = 'Back to dashboard' 
}: AdminFormHeadingProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      )}
      {backUrl && (
        <Link 
          href={backUrl}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Link>
      )}
    </div>
  );
};

export default AdminFormHeading;

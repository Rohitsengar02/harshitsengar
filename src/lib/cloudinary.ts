import { CldUploadWidget } from 'next-cloudinary';

// Type definitions
export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  format: string;
  original_filename: string;
};

export type CloudinaryUploadInfo = {
  event: string;
  info: CloudinaryUploadResult;
};

// Get Cloudinary cloud name from environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

if (!cloudName) {
  console.error('Cloudinary cloud name is not set in .env.local');
}

// Helper to get upload preset based on folder
export const getUploadPreset = (folder: string): string => {
  switch (folder) {
    case 'projects':
      return 'harshit_projects';
    case 'about':
      return 'harshit_about';
    case 'skills':
      return 'harshit_skills';
    default:
      return 'harshit_portfolio';
  }
};

// Function to generate a Cloudinary URL from a public ID
export const getCloudinaryUrl = (publicId: string): string => {
  if (!publicId) return '';
  
  // If the publicId is already a full URL, return it
  if (publicId.startsWith('http')) {
    return publicId;
  }
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
};

// Function to extract public ID from a Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's not a cloudinary URL, return empty
  if (!url.includes('cloudinary.com')) {
    return '';
  }
  
  // Extract the public ID from the URL
  const parts = url.split('/upload/');
  if (parts.length < 2) return '';
  
  return parts[1];
};

// Function to delete an image from Cloudinary
// Note: This requires a server-side API call with your API secret
// We'll need to implement this as a Next.js API route
export const deleteCloudinaryImage = async (publicId: string): Promise<boolean> => {
  if (!publicId) return false;
  
  try {
    // Make a request to your API route that handles Cloudinary deletion
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

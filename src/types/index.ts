// Project type
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  imageUrl?: string; // For backward compatibility
  technologies: string[];
  tags?: string[]; // For backward compatibility
  category: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: any; // Firebase timestamp
  updatedAt?: any; // Firebase timestamp
}

// About type
export interface About {
  id: string;
  name: string;
  title: string;
  role?: string;
  bio: string;
  bioExtended?: string;
  email: string;
  location: string;
  profileImage?: string;
  imageUrl?: string; // For backward compatibility
  education: Education[];
  experience: Experience[];
  resumeUrl?: string;
  createdAt?: any; // Firebase timestamp
  updatedAt?: any; // Firebase timestamp
}

// Education type
export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear: string | number;
  endYear?: string | number;
  current?: boolean;
  description?: string;
}

// Skill type
export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  icon?: string;
  description?: string;
  createdAt?: any; // Firebase timestamp
  updatedAt?: any; // Firebase timestamp
}

// Header type
export interface Header {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  bannerImage: string;
  totalProjects: number;
  experience: number;
  rating: number;
  reviewCount: number;
  createdAt?: any;
  updatedAt?: any;
}

// Export alias for Header to avoid naming conflicts
export type HeaderData = Header;

export interface ContactForm {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: any; // Firebase timestamp
  read?: boolean;
  readAt?: any; // Firebase timestamp
}

// ContactFormData used in firebase.ts
export type ContactFormData = Omit<ContactForm, 'id' | 'createdAt' | 'read' | 'readAt'>;

// Auth User type
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// Experience type
export interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

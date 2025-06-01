import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { About, Project, ContactFormData, ContactForm, Skill, HeaderData } from "@/types";

// Your Firebase configuration
// You will need to replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

// Configure Auth with appropriate cookie settings
const auth = getAuth(app);
// Set persistence to local to mitigate third-party cookie issues
auth.useDeviceLanguage();

// Improve cross-origin handling
if (typeof window !== 'undefined') {
  // Set session cookie settings
  document.cookie = 'firebaseAuth=true; SameSite=Strict; Secure';
}

export { app, db, storage, auth };

// Authentication Functions
export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

// Projects CRUD
export const getProjects = async (): Promise<Project[]> => {
  const projectsRef = collection(db, "projects");
  const snapshot = await getDocs(projectsRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Project[];
};

export const getProject = async (id: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    }
    return null;
  } catch (error) {
    console.error("Error getting project:", error);
    return null;
  }
};

export const addProject = async (project: Omit<Project, "id">) => {
  return await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const projectRef = doc(db, "projects", id);
  return await updateDoc(projectRef, {
    ...project,
    updatedAt: serverTimestamp()
  });
};

export const deleteProject = async (id: string) => {
  return await deleteDoc(doc(db, "projects", id));
};

// About CRUD
export const getAbout = async (): Promise<About | null> => {
  try {
    const aboutCollection = collection(db, "about");
    const snapshot = await getDocs(aboutCollection);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as About;
    }
    return null;
  } catch (error) {
    console.error("Error getting about:", error);
    return null;
  }
};

// Get all about entries
export const getAllAbout = async (): Promise<About[]> => {
  try {
    const aboutCollection = collection(db, "about");
    const snapshot = await getDocs(aboutCollection);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as About[];
  } catch (error) {
    console.error("Error getting all about entries:", error);
    return [];
  }
};

// Get a specific about entry by ID
export const getAboutById = async (id: string): Promise<About | null> => {
  try {
    const docRef = doc(db, "about", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as About;
    }
    return null;
  } catch (error) {
    console.error("Error getting about by ID:", error);
    return null;
  }
};

export const updateAbout = async (id: string, about: Partial<About>) => {
  const aboutRef = doc(db, "about", id);
  return await updateDoc(aboutRef, {
    ...about,
    updatedAt: serverTimestamp()
  });
};

// If no about document exists, create one
export const createAbout = async (about: Omit<About, "id">) => {
  return await addDoc(collection(db, "about"), {
    ...about,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const deleteAbout = async (id: string) => {
  return await deleteDoc(doc(db, "about", id));
};

// Skills CRUD
export const getSkills = async (): Promise<Skill[]> => {
  const skillsRef = collection(db, "skills");
  const snapshot = await getDocs(skillsRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Skill[];
};

export const addSkill = async (skill: Omit<Skill, "id">) => {
  return await addDoc(collection(db, "skills"), {
    ...skill,
    createdAt: serverTimestamp()
  });
};

export const updateSkill = async (id: string, skill: Partial<Skill>) => {
  const skillRef = doc(db, "skills", id);
  return await updateDoc(skillRef, {
    ...skill,
    updatedAt: serverTimestamp()
  });
};

export const deleteSkill = async (id: string) => {
  return await deleteDoc(doc(db, "skills", id));
};

export const getSkill = async (id: string): Promise<Skill | null> => {
  try {
    const docRef = doc(db, "skills", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Skill;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting skill:", error);
    return null;
  }
};

// Contact Form
export const submitContactForm = async (formData: ContactFormData) => {
  return await addDoc(collection(db, "contacts"), {
    ...formData,
    createdAt: serverTimestamp(),
    read: false
  });
};

export const getContactMessages = async (): Promise<ContactForm[]> => {
  const contactsRef = collection(db, "contacts");
  const snapshot = await getDocs(contactsRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ContactForm[];
};

export const markMessageAsRead = async (id: string) => {
  const messageRef = doc(db, "contacts", id);
  return await updateDoc(messageRef, {
    read: true,
    readAt: serverTimestamp()
  });
};

export const deleteMessage = async (id: string) => {
  return await deleteDoc(doc(db, "contacts", id));
};

// Header CRUD
export const getHeaders = async (): Promise<HeaderData[]> => {
  try {
    const headerCollection = collection(db, "header");
    const snapshot = await getDocs(headerCollection);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HeaderData[];
  } catch (error) {
    console.error("Error getting headers:", error);
    return [];
  }
};

export const getActiveHeader = async (): Promise<HeaderData | null> => {
  try {
    const headerCollection = collection(db, "header");
    const snapshot = await getDocs(headerCollection);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]; // Get the first header entry
      return {
        id: doc.id,
        ...doc.data()
      } as HeaderData;
    }
    return null;
  } catch (error) {
    console.error("Error getting active header:", error);
    return null;
  }
};

export const getHeaderById = async (id: string): Promise<HeaderData | null> => {
  try {
    const docRef = doc(db, "header", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as HeaderData;
    }
    return null;
  } catch (error) {
    console.error("Error getting header by ID:", error);
    return null;
  }
};

// Image management with Cloudinary instead of Firebase Storage

// Simplified Cloudinary upload function using unsigned upload preset
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Extract folder from path (e.g., "projects/image.png" -> "projects")
    const folder = path.split('/')[0];
    
    // Create form data with a generic upload preset
    const formData = new FormData();
    formData.append('file', file);
    // Use a single generic upload preset for now, you can create this in Cloudinary dashboard
    formData.append('upload_preset', 'portfolio_uploads');
    // Add a unique timestamp to avoid collisions
    const timestamp = new Date().getTime();
    const uniqueFilename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    formData.append('public_id', `${folder}/${uniqueFilename}`);
    
    // Log what we're sending for debugging
    console.log('Uploading to Cloudinary:', {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: 'portfolio_uploads',
      folder,
      filename: uniqueFilename
    });
    
    // Upload to Cloudinary using their upload API
    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    console.log('Upload URL:', uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary response:', errorText);
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Upload successful:', data);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Delete file from Cloudinary
export const deleteFile = async (path: string): Promise<void> => {
  try {
    // If path is a URL, extract the public ID
    let publicId = path;
    
    if (path.includes('cloudinary.com')) {
      // Extract the public ID from the URL
      const urlParts = path.split('/');
      const filenameWithExtension = urlParts[urlParts.length - 1];
      const filename = filenameWithExtension.split('.')[0];
      const folder = path.includes('/upload/') ? path.split('/upload/')[1].split('/')[0] : '';
      publicId = folder ? `${folder}/${filename}` : filename;
    }
    
    // Call the API route to delete the image
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    if (!response.ok) {
      throw new Error(`Delete failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

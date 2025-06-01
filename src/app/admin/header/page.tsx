"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Toast } from "@/components/Toast";
// AdminLayout import removed as it's not used
import AdminFormHeading from "@/components/layout/AdminFormHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

interface HeaderData {
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
}

const DEFAULT_HEADER: HeaderData = {
  title: "Harshit Sengar - MERN Stack Developer",
  subtitle: "Portfolio",
  description: "BCA graduate and skilled MERN stack developer with a passion for creating responsive web applications.",
  ctaText: "View Projects",
  ctaLink: "/projects",
  secondaryCtaText: "Hire Me",
  secondaryCtaLink: "/contact",
  bannerImage: "",
  totalProjects: 15,
  experience: 2,
  rating: 4.9,
  reviewCount: 25
};

export default function HeaderAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData>(DEFAULT_HEADER);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch header data if ID is provided
  useEffect(() => {
    const fetchHeader = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const headerRef = doc(db, "header", id);
        const headerSnap = await getDoc(headerRef);
        
        if (headerSnap.exists()) {
          const data = headerSnap.data() as HeaderData;
          setHeaderData({ ...data, id: headerSnap.id });
          
          if (data.bannerImage) {
            setImagePreview(data.bannerImage);
          }
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
        setToast({
          message: "Failed to load header data",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeader();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (["totalProjects", "experience", "rating", "reviewCount"].includes(name)) {
      setHeaderData({
        ...headerData,
        [name]: name === "rating" ? parseFloat(value) : parseInt(value, 10),
      });
    } else {
      setHeaderData({
        ...headerData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setHeaderData({
      ...headerData,
      bannerImage: "",
    });
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return headerData.bannerImage;

    const storageRef = ref(storage, `header/banner-${Date.now()}`);
    await uploadBytes(storageRef, imageFile);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = headerData.bannerImage;

      // Upload image if a new one is selected
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const updatedHeaderData = {
        ...headerData,
        bannerImage: imageUrl,
      };

      if (id) {
        // Update existing header
        const headerRef = doc(db, "header", id);
        await updateDoc(headerRef, updatedHeaderData);
        setToast({
          message: "Header updated successfully",
          type: "success",
        });
      } else {
        // Create new header
        const headerRef = collection(db, "header");
        const docRef = await addDoc(headerRef, updatedHeaderData);
        setHeaderData({ ...updatedHeaderData, id: docRef.id });
        
        // Update URL with the new ID
        router.push(`/admin/header?id=${docRef.id}`);
        
        setToast({
          message: "Header created successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error saving header:", error);
      setToast({
        message: "Failed to save header data",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // View all headers
  const handleViewAll = () => {
    router.push("/admin/header/all");
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <AdminFormHeading 
        title={id ? "Edit Header" : "Create Header"} 
        description="Manage your website's header content" 
        backUrl="/admin"
      />

      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleViewAll}
          className="text-sm"
        >
          View All Headers
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="main">Main Content</TabsTrigger>
            <TabsTrigger value="cta">Call to Action</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="image">Banner Image</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="main" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="subtitle">Subtitle/Badge Text</Label>
                    <Input
                      id="subtitle"
                      name="subtitle"
                      value={headerData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Online Platform"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Main Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={headerData.title}
                      onChange={handleInputChange}
                      placeholder="Start Your Learning Journey Today"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={headerData.description}
                      onChange={handleInputChange}
                      placeholder="Join a vibrant community of learners..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cta" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ctaText">Primary Button Text</Label>
                  <Input
                    id="ctaText"
                    name="ctaText"
                    value={headerData.ctaText}
                    onChange={handleInputChange}
                    placeholder="Get Started"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ctaLink">Primary Button Link</Label>
                  <Input
                    id="ctaLink"
                    name="ctaLink"
                    value={headerData.ctaLink}
                    onChange={handleInputChange}
                    placeholder="/projects"
                  />
                </div>
                
                <div>
                  <Label htmlFor="secondaryCtaText">Secondary Button Text</Label>
                  <Input
                    id="secondaryCtaText"
                    name="secondaryCtaText"
                    value={headerData.secondaryCtaText}
                    onChange={handleInputChange}
                    placeholder="Hire Me"
                  />
                </div>
                
                <div>
                  <Label htmlFor="secondaryCtaLink">Secondary Button Link</Label>
                  <Input
                    id="secondaryCtaLink"
                    name="secondaryCtaLink"
                    value={headerData.secondaryCtaLink}
                    onChange={handleInputChange}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalProjects">Total Projects</Label>
                  <Input
                    id="totalProjects"
                    name="totalProjects"
                    type="number"
                    value={headerData.totalProjects}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    value={headerData.experience}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rating">Rating (out of 5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    value={headerData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reviewCount">Number of Reviews</Label>
                  <Input
                    id="reviewCount"
                    name="reviewCount"
                    type="number"
                    value={headerData.reviewCount}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bannerImage">Banner Image</Label>
                  <div className="mt-2">
                    <div className="flex items-center gap-4">
                      <Label
                        htmlFor="bannerImage"
                        className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      >
                        <Upload className="w-6 h-6 mr-2" />
                        <span>Upload Image</span>
                        <input
                          id="bannerImage"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </Label>
                      
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                    <div className="relative w-full h-48 md:h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Banner preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={saving} className="w-full md:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : id ? "Update Header" : "Create Header"}
              </Button>
            </div>
          </form>
        </Tabs>
      )}
    </>
  );
}

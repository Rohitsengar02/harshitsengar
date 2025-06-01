"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Toast } from "@/components/Toast";
// AdminLayout import removed as it's not used
import AdminFormHeading from "@/components/layout/AdminFormHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HeaderData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  totalProjects: number;
  experience: number;
  rating: number;
  reviewCount: number;
}

export default function AllHeaders() {
  const router = useRouter();
  const [headers, setHeaders] = useState<HeaderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch all headers
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const headersRef = collection(db, "header");
        const headersSnap = await getDocs(headersRef);
        const headersData = headersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as HeaderData[];
        
        setHeaders(headersData);
      } catch (error) {
        console.error("Error fetching headers:", error);
        setToast({
          message: "Failed to load headers",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeaders();
  }, []);

  // Handle edit button click
  const handleEdit = (id: string) => {
    router.push(`/admin/header?id=${id}`);
  };

  // Handle delete header
  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      const headerRef = doc(db, "header", id);
      await deleteDoc(headerRef);
      
      // Update local state
      setHeaders(headers.filter(header => header.id !== id));
      
      setToast({
        message: "Header deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting header:", error);
      setToast({
        message: "Failed to delete header",
        type: "error",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle create new header
  const handleCreateNew = () => {
    router.push("/admin/header");
  };

  // Truncate text for table display
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <AdminFormHeading 
        title="All Headers" 
        description="View and manage all your website headers" 
        backUrl="/admin"
      />
      
      <div className="mb-4 flex justify-end">
        <Button onClick={handleCreateNew} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Create New Header
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : headers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No headers found</p>
          <Button onClick={handleCreateNew} variant="outline">Create Your First Header</Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headers.map((header) => (
                <TableRow key={header.id}>
                  <TableCell className="font-medium">{truncateText(header.title, 30)}</TableCell>
                  <TableCell>
                    {header.subtitle ? (
                      <Badge variant="outline">{truncateText(header.subtitle, 20)}</Badge>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">{truncateText(header.description, 40)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="secondary">{header.totalProjects} Projects</Badge>
                      <Badge variant="secondary">{header.experience} {header.experience === 1 ? 'Year' : 'Years'} Exp</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(header.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the header and remove it from your website.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(header.id)}
                              disabled={deleteLoading === header.id}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              {deleteLoading === header.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Deleting...
                                </>
                              ) : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

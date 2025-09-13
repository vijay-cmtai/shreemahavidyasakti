"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  FileText,
  Trash2,
  MoreVertical,
  TrendingUp,
  BarChart3,
  Share2,
  Heart,
  PenTool,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Image,
  Video,
  X,
  Calendar
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Post {
  _id?: string;
  title: string;
  hindiTitle: string;
  content: string;
  excerpt: string;
  author: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  tags: string | string[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishDate: string;
  featuredImage?: File | string;
  images?: File[] | string[];
  readTime: string;
  views?: string | number;
  likes?: number;
  comments?: number;
  commentCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string | string[];
  slug?: string;
  lastModified?: string;
  featured: boolean;
  trending: boolean;
  published: boolean;
  allowComments: boolean;
  relatedPosts?: string[];
  customFields?: any;
}

interface BlogFormData {
  title: string;
  hindiTitle: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  authorName: string;
  authorAvatar: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  status: string;
  featured: boolean;
  trending: boolean;
  published: boolean;
  readTime: string;
  allowComments: boolean;
  featuredImage?: File;
  images: File[];
  relatedPosts: string;
  customFields: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    hindiTitle: '',
    excerpt: '',
    content: '',
    category: 'Astrology',
    tags: '',
    author: '507f1f77bcf86cd799439011',
    authorName: 'पंडित राम कुमार शर्मा',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    status: 'draft',
    featured: false,
    trending: false,
    published: false,
    readTime: '12 min read',
    allowComments: true,
    images: [],
    relatedPosts: '',
    customFields: '{"difficulty": "intermediate", "language": "hindi", "readingLevel": "advanced"}'
  });
  
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('');
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    published: 'bg-green-100 text-green-800 border-green-200',
    archived: 'bg-red-100 text-red-800 border-red-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const statusIcons = {
    draft: PenTool,
    published: CheckCircle,
    archived: XCircle,
    scheduled: Clock
  };

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/blogs`);
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard: Raw API response:', data);
        
        // Handle different API response structures
        let blogsArray = [];
        if (data.blogs && Array.isArray(data.blogs)) {
          // API returns { blogs: [...], pagination: {...} }
          blogsArray = data.blogs;
        } else if (Array.isArray(data)) {
          // API returns direct array
          blogsArray = data;
        }
        
        console.log('Dashboard: Extracted blogs array:', blogsArray);
        setPosts(blogsArray);
      } else {
        console.error('Failed to fetch blogs:', response.statusText);
        toast.error('Failed to fetch blogs');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

    // Create blog with form data
  const createBlog = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }
      
      // Log form data for debugging
      console.log('Form Data being sent:', formData);
      
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('hindiTitle', formData.hindiTitle);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('authorAvatar', formData.authorAvatar);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('readTime', formData.readTime);
      
      // Generate slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      formDataToSend.append('slug', slug + '-' + Date.now());
      
      // Handle tags - send as comma-separated string (most backends expect this)
      if (formData.tags) {
        const cleanTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).join(',');
        console.log('Tags being sent as string:', cleanTags);
        formDataToSend.append('tags', cleanTags);
      }
      
      // Handle keywords - send as comma-separated string  
      if (formData.keywords) {
        const cleanKeywords = formData.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0).join(',');
        console.log('Keywords being sent as string:', cleanKeywords);
        formDataToSend.append('keywords', cleanKeywords);
      }
      
      // SEO fields
      formDataToSend.append('metaTitle', formData.metaTitle || formData.title);
      formDataToSend.append('metaDescription', formData.metaDescription || formData.excerpt);
      
      // Boolean fields
      formDataToSend.append('featured', formData.featured.toString());
      formDataToSend.append('trending', formData.trending.toString());
      formDataToSend.append('published', formData.published.toString());
      formDataToSend.append('allowComments', formData.allowComments.toString());
      
      // Author ID (required)
      formDataToSend.append('author', formData.author);
      
      // Custom fields (if any)
      if (formData.customFields) {
        formDataToSend.append('customFields', formData.customFields);
      }
      
      // Add featured image (required)
      if (formData.featuredImage) {
        console.log('Adding featured image:', formData.featuredImage.name);
        formDataToSend.append('featuredImage', formData.featuredImage);
      } else {
        toast.error('Featured image is required');
        setLoading(false);
        return;
      }
      
      // Add gallery images
      formData.images.forEach((image, index) => {
        console.log(`Adding gallery image ${index}:`, image.name);
        formDataToSend.append('images', image);
      });

      console.log('Sending request to backend...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/blogs/create`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const newBlog = await response.json();
        console.log('Blog created successfully:', newBlog);
        setPosts(prev => Array.isArray(prev) ? [newBlog, ...prev] : [newBlog]);
        toast.success('Blog created successfully!');
        resetForm();
        setIsCreateModalOpen(false);
      } else {
        const errorData = await response.text();
        console.error('Backend error response:', errorData);
        throw new Error(`Failed to create blog: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to create blog: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update blog
  const updateBlog = async (id: string) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }
      
      // Validate author field
      if (!formData.author) {
        toast.error('Author ID is required');
        setLoading(false);
        return;
      }
      
      // Additional author validation
      if (formData.author === 'null' || formData.author === null) {
        console.error('Author field is null in formData:', formData);
        toast.error('Author ID is invalid. Please try editing the post again.');
        setLoading(false);
        return;
      }
      
      // Final safeguard - ensure author is never lost
      const authorId = formData.author || selectedPost?.author || '507f1f77bcf86cd799439011';
      
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('hindiTitle', formData.hindiTitle);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('authorAvatar', formData.authorAvatar);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('readTime', formData.readTime);
      
      // Generate slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      formDataToSend.append('slug', slug + '-' + Date.now());
      
      // Handle tags - send as comma-separated string
      if (formData.tags) {
        const cleanTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).join(',');
        formDataToSend.append('tags', cleanTags);
      }
      
      // Handle keywords - send as comma-separated string  
      if (formData.keywords) {
        const cleanKeywords = formData.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0).join(',');
        formDataToSend.append('keywords', cleanKeywords);
      }
      
      // SEO fields
      formDataToSend.append('metaTitle', formData.metaTitle || formData.title);
      formDataToSend.append('metaDescription', formData.metaDescription || formData.excerpt);
      
      // Boolean fields
      formDataToSend.append('featured', formData.featured.toString());
      formDataToSend.append('trending', formData.trending.toString());
      formDataToSend.append('published', formData.published.toString());
      formDataToSend.append('allowComments', formData.allowComments.toString());
      
      // Author ID (required)
      formDataToSend.append('author', formData.author);
      
      // Custom fields (if any)
      if (formData.customFields) {
        formDataToSend.append('customFields', formData.customFields);
      }
      
      // Related posts
      if (formData.relatedPosts) {
        formDataToSend.append('relatedPosts', formData.relatedPosts);
      }
      
      // Add featured image if changed
      if (formData.featuredImage instanceof File) {
        console.log('Adding new featured image:', formData.featuredImage.name);
        formDataToSend.append('featuredImage', formData.featuredImage);
      } else if (featuredImagePreview && !formData.featuredImage) {
        // If we have a preview but no new file, it means we're keeping the existing image
        console.log('Keeping existing featured image');
        // You might want to send the existing image URL or handle this differently
      }
      
      // Add gallery images if changed
      if (formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          if (image instanceof File) {
            console.log(`Adding new gallery image ${index}:`, image.name);
            formDataToSend.append('images', image);
          }
        });
      }

      console.log('Sending update request to backend...');
      console.log('Form data being sent:', {
        title: formData.title,
        author: formData.author,
        status: formData.status,
        featured: formData.featured,
        trending: formData.trending,
        published: formData.published
      });
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/blogs/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedBlog = await response.json();
        console.log('Blog updated successfully:', updatedBlog);
        setPosts(prev => prev.map(post => post._id === id ? updatedBlog : post));
        toast.success('Blog updated successfully!');
        setIsEditModalOpen(false);
        setSelectedPost(null);
        
        // Don't reset form after successful update - just clear previews
        setFeaturedImagePreview('');
        setImagesPreviews([]);
      } else {
        const errorData = await response.text();
        console.error('Backend error response:', errorData);
        throw new Error(`Failed to update blog: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to update blog: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prev => prev.filter(post => post._id !== id));
        toast.success('Blog deleted successfully!');
    setIsDeleteModalOpen(false);
    setSelectedPost(null);
      } else {
        throw new Error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setLoading(false);
    }
  };

  // Handle file uploads
  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagesPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeFeaturedImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: undefined
    }));
    setFeaturedImagePreview('');
  };

  const removeCurrentGalleryImage = (index: number) => {
    // This would need to be handled on the backend to actually remove the image
    // For now, we'll just show a message
    toast.info('Gallery image removal will be handled on the backend');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      hindiTitle: '',
      excerpt: '',
      content: '',
      category: 'Astrology',
      tags: '',
      author: '507f1f77bcf86cd799439011',
      authorName: 'पंडित राम कुमार शर्मा',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      status: 'draft',
      featured: false,
      trending: false,
      published: false,
      readTime: '12 min read',
      allowComments: true,
      images: [],
      relatedPosts: '',
      customFields: '{"difficulty": "intermediate", "language": "hindi", "readingLevel": "advanced"}'
    });
    setFeaturedImagePreview('');
    setImagesPreviews([]);
  };

  // Sample data for fallback
  const samplePosts: Post[] = [
    {
      _id: "sample1",
      title: "Sample Blog Post",
      hindiTitle: "नमूना ब्लॉग पोस्ट",
      content: "<h1>Sample Content</h1><p>This is a sample blog post to demonstrate the interface.</p>",
      excerpt: "This is a sample blog post to demonstrate the interface.",
      author: "507f1f77bcf86cd799439011",
      authorName: "Sample Author",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      category: "Astrology",
      tags: ["sample", "demo", "test"],
      status: "published" as const,
      publishDate: new Date().toISOString().split('T')[0],
      readTime: "5 min read",
      views: 100,
      likes: 10,
      comments: 2,
      metaTitle: "Sample Blog Post",
      metaDescription: "This is a sample blog post",
      keywords: ["sample", "demo"],
      featured: false,
      trending: false,
      published: true,
      allowComments: true,
      relatedPosts: [],
      customFields: {}
    }
  ];

  // Test backend connectivity
  const testBackendConnection = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/blogs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Backend test response:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  };

  // Load posts on component mount
  useEffect(() => {
    const initializeDashboard = async () => {
      const isBackendAvailable = await testBackendConnection();
      
      if (isBackendAvailable) {
        fetchBlogs();
      } else {
        console.log('Backend not available, using sample data');
        setPosts(samplePosts);
        toast.error('Backend server not available. Using sample data for demonstration.');
      }
    };

    initializeDashboard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug formData changes
  useEffect(() => {
    console.log('FormData changed:', {
      title: formData.title,
      author: formData.author,
      status: formData.status,
      featured: formData.featured,
      trending: formData.trending,
      published: formData.published
    });
  }, [formData]);

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const tagsString = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagsString.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }) : [];

  const getStatusCount = (status: string) => {
    return Array.isArray(posts) ? posts.filter(post => status === 'all' ? true : post.status === status).length : 0;
  };

  const getCategoryCount = (category: string) => {
    return Array.isArray(posts) ? posts.filter(post => category === 'all' ? true : post.category === category).length : 0;
  };

  const totalViews = Array.isArray(posts) ? posts.reduce((sum, post) => {
    if (typeof post.views === 'number') {
      return sum + post.views;
    } else if (typeof post.views === 'string') {
      const viewsStr = post.views;
      const parsedViews = parseInt(viewsStr.replace(/k/g, '000'));
      return sum + (isNaN(parsedViews) ? 0 : parsedViews);
    }
    return sum;
  }, 0) : 0;
  const totalLikes = Array.isArray(posts) ? posts.reduce((sum, post) => sum + (post.likes || 0), 0) : 0;
  const totalComments = Array.isArray(posts) ? posts.reduce((sum, post) => sum + (post.comments || post.commentCount || 0), 0) : 0;
  const categories = ["all", "Astrology", "Rudraksha", "Marriage", "Gemstones", "Yantra", "Career"];
  
  const handleEditPost = (post: Post) => {
    const tagsString = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');
    const keywordsString = Array.isArray(post.keywords) ? post.keywords.join(', ') : (post.keywords || '');
    
    console.log('Setting form data for edit:', {
      title: post.title,
      author: post.author,
      authorName: post.authorName,
      status: post.status
    });
    
    // Ensure author field is preserved and valid
    const authorId = post.author || '507f1f77bcf86cd799439011';
    
    setFormData({
      title: post.title,
      hindiTitle: post.hindiTitle,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: tagsString,
      author: authorId,
      authorName: post.authorName,
      authorAvatar: post.authorAvatar,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      keywords: keywordsString,
      status: post.status,
      featured: post.featured,
      trending: post.trending,
      published: post.published,
      readTime: post.readTime,
      allowComments: post.allowComments,
      images: [],
      relatedPosts: Array.isArray(post.relatedPosts) ? post.relatedPosts.join(', ') : '',
      customFields: JSON.stringify(post.customFields || {})
    });

    // Set featured image preview if it exists
    if (post.featuredImage) {
      if (typeof post.featuredImage === 'string') {
        setFeaturedImagePreview(post.featuredImage);
      } else {
        // If it's a File object, create preview
        const reader = new FileReader();
        reader.onload = () => {
          setFeaturedImagePreview(reader.result as string);
        };
        reader.readAsDataURL(post.featuredImage);
      }
    } else {
      setFeaturedImagePreview('');
    }

    // Set gallery images previews if they exist
    if (post.images && post.images.length > 0) {
      const previews: string[] = [];
      post.images.forEach((image) => {
        if (typeof image === 'string') {
          previews.push(image);
        } else if (image && typeof image === 'object' && 'type' in image) {
          try {
            // If it's a File or Blob, create preview
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.result) {
                previews.push(reader.result as string);
              }
            };
            reader.readAsDataURL(image as Blob);
          } catch (error) {
            console.warn('Failed to read image data:', error);
            previews.push('/placeholder.jpg');
          }
        } else {
          // Fallback for unknown image types
          previews.push('/placeholder.jpg');
        }
      });
      
      // Wait for all readers to complete
      setTimeout(() => {
        setImagesPreviews(previews);
      }, 200);
    } else {
      setImagesPreviews([]);
    }

    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
          <p className="text-gray-600">Create, edit, and manage astrology and spiritual blog posts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Posts', count: Array.isArray(posts) ? posts.length : 0, color: 'bg-blue-500', icon: FileText },
            { label: 'Published', count: getStatusCount('published'), color: 'bg-green-500', icon: CheckCircle },
            { label: 'Drafts', count: getStatusCount('draft'), color: 'bg-gray-500', icon: PenTool },
            { label: 'Scheduled', count: getStatusCount('scheduled'), color: 'bg-blue-500', icon: Clock },
            { label: 'Total Views', count: totalViews, color: 'bg-purple-500', icon: Eye },
            { label: 'Total Likes', count: totalLikes, color: 'bg-red-500', icon: Heart }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`w-8 h-8 rounded-full ${stat.color} opacity-20 flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category} className="flex justify-between">
                  <span className="text-gray-600">{category === 'all' ? 'All' : category}:</span>
                  <span className="font-semibold">
                    {getCategoryCount(category)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Views:</span>
                <span className="font-semibold text-blue-600">
                  {Array.isArray(posts) && posts.length > 0 ? Math.round(totalViews / posts.length) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Likes:</span>
                <span className="font-semibold text-red-600">
                  {Array.isArray(posts) && posts.length > 0 ? Math.round(totalLikes / posts.length) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Comments:</span>
                <span className="font-semibold text-green-600">
                  {totalComments}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <MoreVertical className="w-6 h-6 text-gray-500" />
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  resetForm();
                  setIsCreateModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Export Posts
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share2 className="w-4 h-4 mr-2" />
                Share Posts
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search posts by title, content, author, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Create Post Button */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Create a comprehensive blog post with all required fields, images, and SEO settings.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                  <div>
                        <Label htmlFor="title">Title (English) *</Label>
                    <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="कुंडली में ग्रहों का विश्लेषण और उनका प्रभाव"
                          required
                    />
                  </div>
                  <div>
                        <Label htmlFor="hindiTitle">Title (Hindi) *</Label>
                    <Input
                          id="hindiTitle"
                          value={formData.hindiTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, hindiTitle: e.target.value }))}
                          placeholder="कुंडली में ग्रहों का विश्लेषण और उनका प्रभाव"
                          required
                    />
                  </div>
                    </div>
                    
                  <div>
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="कुंडली में स्थित ग्रह हमारे जीवन के हर पहलू को प्रभावित करते हैं।"
                      rows={3}
                        required
                    />
                  </div>

                    <div className="grid grid-cols-2 gap-4">
                  <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Astrology">Astrology</SelectItem>
                            <SelectItem value="Rudraksha">Rudraksha</SelectItem>
                            <SelectItem value="Marriage">Marriage</SelectItem>
                            <SelectItem value="Gemstones">Gemstones</SelectItem>
                            <SelectItem value="Yantra">Yantra</SelectItem>
                            <SelectItem value="Career">Career</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags *</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="कुंडली, ग्रह, सूर्य, चंद्रमा, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु"
                        required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="authorName">Author Name *</Label>
                      <Input
                          id="authorName"
                          value={formData.authorName}
                          onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                          placeholder="पंडित राम कुमार शर्मा"
                          required
                      />
                    </div>
                    <div>
                        <Label htmlFor="authorAvatar">Author Avatar URL</Label>
                      <Input
                          id="authorAvatar"
                          value={formData.authorAvatar}
                          onChange={(e) => setFormData(prev => ({ ...prev, authorAvatar: e.target.value }))}
                          placeholder="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                      />
                    </div>
                    <div>
                        <Label htmlFor="readTime">Read Time</Label>
                      <Input
                          id="readTime"
                          value={formData.readTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                          placeholder="12 min read"
                      />
                    </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                    <div>
                      <Label htmlFor="content">Content (HTML) *</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="<h1>कुंडली में ग्रहों का महत्व</h1><p>ज्योतिष शास्त्र के अनुसार...</p>"
                        rows={15}
                        className="font-mono text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="relatedPosts">Related Posts (IDs, comma separated)</Label>
                      <Input
                        id="relatedPosts"
                        value={formData.relatedPosts}
                        onChange={(e) => setFormData(prev => ({ ...prev, relatedPosts: e.target.value }))}
                        placeholder="Leave empty for now"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customFields">Custom Fields (JSON)</Label>
                      <Textarea
                        id="customFields"
                        value={formData.customFields}
                        onChange={(e) => setFormData(prev => ({ ...prev, customFields: e.target.value }))}
                        placeholder='{"difficulty": "intermediate", "language": "hindi", "readingLevel": "advanced"}'
                        rows={3}
                        className="font-mono text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                  <div>
                      <Label>Featured Image/Video *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <label htmlFor="featuredImage" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload featured image or video
                              </span>
                              <input
                                id="featuredImage"
                                type="file"
                                className="sr-only"
                                accept="image/*,video/*"
                                onChange={handleFeaturedImageChange}
                              />
                            </label>
                  </div>
                        </div>
                        {featuredImagePreview && (
                          <div className="mt-4">
                            <img src={featuredImagePreview} alt="Featured preview" className="max-h-48 mx-auto rounded" />
                          </div>
                        )}
                      </div>
                    </div>

                  <div>
                      <Label>Gallery Images (Multiple)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <label htmlFor="galleryImages" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload gallery images
                              </span>
                              <input
                                id="galleryImages"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                multiple
                                onChange={handleImagesChange}
                              />
                            </label>
                  </div>
                        </div>
                        {imagesPreviews.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {imagesPreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img src={preview} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover rounded" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4">
                  <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                        placeholder="कुंडली में ग्रहों का विश्लेषण - Jyoti Darshan"
                    />
                  </div>

                  <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                        placeholder="कुंडली में स्थित ग्रहों का विश्लेषण और उनका हमारे जीवन पर प्रभाव।"
                      rows={3}
                    />
                  </div>

                  <div>
                      <Label htmlFor="keywords">Keywords</Label>
                    <Input
                        id="keywords"
                        value={formData.keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="कुंडली, ग्रह, सूर्य, चंद्रमा, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु, ज्योतिष, horoscope, planets"
                    />
                  </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                        />
                        <Label htmlFor="featured">Featured Post</Label>
                </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="trending"
                          checked={formData.trending}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trending: !!checked }))}
                        />
                        <Label htmlFor="trending">Trending Post</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="published"
                          checked={formData.published}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: !!checked }))}
                        />
                        <Label htmlFor="published">Published</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allowComments"
                          checked={formData.allowComments}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowComments: !!checked }))}
                        />
                        <Label htmlFor="allowComments">Allow Comments</Label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createBlog} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
                    {loading ? 'Creating...' : 'Create Post'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading blogs...</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first blog post.</p>
                        <Button 
                          onClick={() => {
                            resetForm();
                            setIsCreateModalOpen(true);
                          }}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Post
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : null}
                {filteredPosts.map((post, index) => (
                  <motion.tr
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-600">{post.hindiTitle}</div>
                          <div className="text-sm text-gray-500">{post.excerpt.slice(0, 100)}...</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(post.publishDate).toLocaleDateString()} • {post.readTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.authorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={statusColors[post.status]}>
                        {React.createElement(statusIcons[post.status], { className: "w-3 h-3" })}
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>👁️ {typeof post.views === 'number' ? post.views.toLocaleString() : (post.views || '0')} views</div>
                        <div>❤️ {post.likes || 0} likes</div>
                        <div>💬 {post.comments || post.commentCount || 0} comments</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* View Post */}
                        <Dialog open={isViewModalOpen && selectedPost?._id === post._id} onOpenChange={(open) => {
                          setIsViewModalOpen(open);
                          if (open) setSelectedPost(post);
                          else setSelectedPost(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{post.title}</DialogTitle>
                              <DialogDescription>
                                {post.excerpt}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Post Content:</h3>
                                <p className="text-gray-700">{post.content}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Author</label>
                                  <p className="text-sm text-gray-900">{post.author}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Category</label>
                                  <p className="text-sm text-gray-900">{post.category}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Status</label>
                                  <Badge className={statusColors[post.status]}>
                                    {post.status}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Publish Date</label>
                                  <p className="text-sm text-gray-900">{new Date(post.publishDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Read Time</label>
                                  <p className="text-sm text-gray-900">{post.readTime} minutes</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Slug</label>
                                  <p className="text-sm text-gray-900">{post.slug}</p>
                                </div>
                              </div>
                              {post.tags && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Tags</label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {Array.isArray(post.tags) 
                                      ? post.tags.map((tag: string, i: number) => (
                                          <Badge key={i} variant="outline">
                                            {tag}
                                          </Badge>
                                        ))
                                      : post.tags.split(',').map((tag: string, i: number) => (
                                          <Badge key={i} variant="outline">
                                            {tag.trim()}
                                          </Badge>
                                        ))
                                    }
                                  </div>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                                Close
                              </Button>
                              <Button 
                                onClick={() => {
                                  setIsViewModalOpen(false);
                                  setSelectedPost(post);
                                  setIsEditModalOpen(true);
                                }}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Edit Post
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Edit Post */}
                        <Dialog open={isEditModalOpen && selectedPost?._id === post._id} onOpenChange={(open) => {
                          setIsEditModalOpen(open);
                          if (open) handleEditPost(post);
                          else setSelectedPost(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Blog Post</DialogTitle>
                              <DialogDescription>
                                Update all details for "{post.title}"
                              </DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="basic" className="w-full">
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="content">Content</TabsTrigger>
                                <TabsTrigger value="media">Media</TabsTrigger>
                                <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="basic" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="editTitle">Title (English) *</Label>
                                    <Input
                                      id="editTitle"
                                      value={formData.title}
                                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="कुंडली में ग्रहों का विश्लेषण और उनका प्रभाव"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editHindiTitle">Title (Hindi) *</Label>
                                    <Input
                                      id="editHindiTitle"
                                      value={formData.hindiTitle}
                                      onChange={(e) => setFormData(prev => ({ ...prev, hindiTitle: e.target.value }))}
                                      placeholder="कुंडली में ग्रहों का विश्लेषण और उनका प्रभाव"
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="editExcerpt">Excerpt *</Label>
                                  <Textarea
                                    id="editExcerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    placeholder="कुंडली में स्थित ग्रह हमारे जीवन के हर पहलू को प्रभावित करते हैं।"
                                    rows={3}
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="editCategory">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Astrology">Astrology</SelectItem>
                                        <SelectItem value="Rudraksha">Rudraksha</SelectItem>
                                        <SelectItem value="Marriage">Marriage</SelectItem>
                                        <SelectItem value="Gemstones">Gemstones</SelectItem>
                                        <SelectItem value="Yantra">Yantra</SelectItem>
                                        <SelectItem value="Career">Career</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="editStatus">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="editTags">Tags *</Label>
                                  <Input
                                    id="editTags"
                                    value={formData.tags}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="कुंडली, ग्रह, सूर्य, चंद्रमा, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु"
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label htmlFor="editAuthorName">Author Name *</Label>
                                    <Input
                                      id="editAuthorName"
                                      value={formData.authorName}
                                      onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                                      placeholder="पंडित राम कुमार शर्मा"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editAuthorAvatar">Author Avatar URL</Label>
                                    <Input
                                      id="editAuthorAvatar"
                                      value={formData.authorAvatar}
                                      onChange={(e) => setFormData(prev => ({ ...prev, authorAvatar: e.target.value }))}
                                      placeholder="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editReadTime">Read Time</Label>
                                    <Input
                                      id="editReadTime"
                                      value={formData.readTime}
                                      onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                                      placeholder="12 min read"
                                    />
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="content" className="space-y-4">
                                <div>
                                  <Label htmlFor="editContent">Content (HTML) *</Label>
                                  <Textarea
                                    id="editContent"
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="<h1>कुंडली में ग्रहों का महत्व</h1><p>ज्योतिष शास्त्र के अनुसार...</p>"
                                    rows={15}
                                    className="font-mono text-sm"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="editRelatedPosts">Related Posts (IDs, comma separated)</Label>
                                  <Input
                                    id="editRelatedPosts"
                                    value={formData.relatedPosts}
                                    onChange={(e) => setFormData(prev => ({ ...prev, relatedPosts: e.target.value }))}
                                    placeholder="Leave empty for now"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="editCustomFields">Custom Fields (JSON)</Label>
                                  <Textarea
                                    id="editCustomFields"
                                    value={formData.customFields}
                                    onChange={(e) => setFormData(prev => ({ ...prev, customFields: e.target.value }))}
                                    placeholder='{"difficulty": "intermediate", "language": "hindi", "readingLevel": "advanced"}'
                                    rows={3}
                                    className="font-mono text-sm"
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="media" className="space-y-4">
                                <div>
                                  <Label>Featured Image/Video *</Label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <div className="text-center">
                                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                      <div className="mt-4">
                                        <label htmlFor="editFeaturedImage" className="cursor-pointer">
                                          <span className="mt-2 block text-sm font-medium text-gray-900">
                                            Upload new featured image or video
                                          </span>
                                          <input
                                            id="editFeaturedImage"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*,video/*"
                                            onChange={handleFeaturedImageChange}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                    {featuredImagePreview && (
                                      <div className="mt-4">
                                        <img src={featuredImagePreview} alt="Featured preview" className="max-h-48 mx-auto rounded" />
                                      </div>
                                    )}
                                    {!featuredImagePreview && post.featuredImage && (
                                      <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Current featured image:</p>
                                        <div className="relative">
                                          <img 
                                            src={typeof post.featuredImage === 'string' ? post.featuredImage : (post.featuredImage && typeof post.featuredImage === 'object' && 'type' in post.featuredImage ? (() => {
                                              try {
                                                return URL.createObjectURL(post.featuredImage as Blob);
                                              } catch (error) {
                                                console.warn('Failed to create object URL for featured image:', error);
                                                return '/placeholder.jpg';
                                              }
                                            })() : '/placeholder.jpg')} 
                                            alt="Current featured" 
                                            className="max-h-48 mx-auto rounded" 
                                          />
                                          <button
                                            type="button"
                                            onClick={removeFeaturedImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            title="Remove current featured image"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label>Gallery Images (Multiple)</Label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <div className="text-center">
                                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                                      <div className="mt-4">
                                        <label htmlFor="editGalleryImages" className="cursor-pointer">
                                          <span className="mt-2 block text-sm font-medium text-gray-900">
                                            Upload new gallery images
                                          </span>
                                          <input
                                            id="editGalleryImages"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImagesChange}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                    {imagesPreviews.length > 0 && (
                                      <div className="mt-4 grid grid-cols-3 gap-4">
                                        {imagesPreviews.map((preview, index) => (
                                          <div key={index} className="relative">
                                            <img src={preview} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover rounded" />
                                            <button
                                              type="button"
                                              onClick={() => removeImage(index)}
                                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {post.images && post.images.length > 0 && (
                                      <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Current gallery images:</p>
                                        <div className="grid grid-cols-3 gap-4">
                                          {post.images.map((image, index) => {
                                            let imageSrc = '/placeholder.jpg';
                                            if (typeof image === 'string') {
                                              imageSrc = image;
                                            } else if (image && typeof image === 'object' && 'type' in image) {
                                              try {
                                                imageSrc = URL.createObjectURL(image as Blob);
                                              } catch (error) {
                                                console.warn('Failed to create object URL for image:', error);
                                                imageSrc = '/placeholder.jpg';
                                              }
                                            }
                                            
                                            return (
                                              <div key={index} className="relative">
                                                <img 
                                                  src={imageSrc} 
                                                  alt={`Gallery ${index + 1}`} 
                                                  className="h-24 w-full object-cover rounded" 
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => removeCurrentGalleryImage(index)}
                                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                  title="Remove current gallery image"
                                                >
                                                  <X className="h-3 w-3" />
                                                </button>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="seo" className="space-y-4">
                                <div>
                                  <Label htmlFor="editMetaTitle">Meta Title</Label>
                                  <Input
                                    id="editMetaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                    placeholder="कुंडली में ग्रहों का विश्लेषण - Jyoti Darshan"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="editMetaDescription">Meta Description</Label>
                                  <Textarea
                                    id="editMetaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                    placeholder="कुंडली में स्थित ग्रहों का विश्लेषण और उनका हमारे जीवन पर प्रभाव।"
                                    rows={3}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="editKeywords">Keywords</Label>
                                  <Input
                                    id="editKeywords"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                    placeholder="कुंडली, ग्रह, सूर्य, चंद्रमा, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु, ज्योतिष, horoscope, planets"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="editFeatured"
                                      checked={formData.featured}
                                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                                    />
                                    <Label htmlFor="editFeatured">Featured Post</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="editTrending"
                                      checked={formData.trending}
                                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trending: !!checked }))}
                                    />
                                    <Label htmlFor="editTrending">Trending Post</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="editPublished"
                                      checked={formData.published}
                                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: !!checked }))}
                                    />
                                    <Label htmlFor="editPublished">Published</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="editAllowComments"
                                      checked={formData.allowComments}
                                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowComments: !!checked }))}
                                    />
                                    <Label htmlFor="editAllowComments">Allow Comments</Label>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={() => updateBlog(post._id!)}
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90"
                              >
                                {loading ? 'Updating...' : 'Update Post'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Post */}
                        <Dialog open={isDeleteModalOpen && selectedPost?._id === post._id} onOpenChange={(open) => {
                          setIsDeleteModalOpen(open);
                          if (open) setSelectedPost(post);
                          else setSelectedPost(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Post</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => deleteBlog(post._id!)}
                                disabled={loading}
                              >
                                {loading ? 'Deleting...' : 'Delete Post'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
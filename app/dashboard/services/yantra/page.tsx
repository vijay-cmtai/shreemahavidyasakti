"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Star, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Ruler,
  Zap,
  Heart,
  Shield,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

// Types
interface Yantra {
  _id: string;
  name: string;
  englishName: string;
  category: string;
  deity: string;
  material: string;
  size: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  description: string;
  benefits: string[];
  activation: string;
  isBlessed: boolean;
  isCustom: boolean;
  isEnergized: boolean;
  inStock: boolean;
  isActive: boolean;
  stock: number;
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface YantraFormData {
  name: string;
  englishName: string;
  category: string;
  deity: string;
  material: string;
  size: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  description: string;
  benefits: string;
  activation: string;
  isBlessed: boolean;
  isCustom: boolean;
  isEnergized: boolean;
  inStock: boolean;
  isActive: boolean;
  stock: number;
  rating?: number;
  reviews?: number;
}

interface ApiResponse {
  yantra: Yantra[];
  totalPages: number;
  currentPage: number;
  totalYantra: number;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Functions
const yantraAPI = {
  // Get all yantra for admin
  getAll: async (params: Record<string, any> = {}): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/api/yantra/admin/all?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch yantra');
    return response.json();
  },
  
  // Create new yantra
  create: async (formData: FormData): Promise<{ message: string; data: Yantra }> => {
    const response = await fetch(`${API_BASE_URL}/api/yantra/create`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      console.error('Backend error response:', error);
      throw new Error(error.error || error.errorMessage || 'Failed to create yantra');
    }
    return response.json();
  },
  
  // Update yantra
  update: async (id: string, formData: FormData): Promise<{ message: string; data: Yantra }> => {
    const response = await fetch(`${API_BASE_URL}/api/yantra/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update yantra');
    }
    return response.json();
  },
  
  // Delete yantra
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/yantra/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete yantra');
    return response.json();
  },
  
  // Get categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/yantra/categories/list`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch categories`);
      }
      const categories = await response.json();
      return Array.isArray(categories) ? categories : [];
    } catch (error) {
      console.error('Categories API Error:', error);
      throw error;
    }
  },

  // Get deities
  getDeities: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/yantra/deities/list`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch deities`);
      }
      const deities = await response.json();
      return Array.isArray(deities) ? deities : [];
    } catch (error) {
      console.error('Deities API Error:', error);
      throw error;
    }
  },

  // Get energized yantra
  getEnergized: async (): Promise<Yantra[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/yantra/energized/list`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch energized yantra`);
      }
      const data = await response.json();
      return data.yantra || [];
    } catch (error) {
      console.error('Energized yantra API Error:', error);
      throw error;
    }
  }
};

export default function YantraManagement() {
  const [yantras, setYantras] = useState<Yantra[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingYantra, setEditingYantra] = useState<Yantra | null>(null);
  const [categories, setCategories] = useState<string[]>([
    'Sacred Geometry',
    'Protection Yantra', 
    'Success Yantra',
    'Planetary Yantra',
    'Deity Yantra',
    'Custom Yantra'
  ]);
  const [deities, setDeities] = useState<string[]>([
    'Lord Shiva', 'Lord Ganesha', 'Lord Vishnu', 'Lord Brahma',
    'Maa Durga', 'Maa Lakshmi', 'Lord Hanuman', 'Surya Dev',
    'Agni Dev', 'Kartikeya', 'Ardhanarishwar', 'Navdurga'
  ]);
  const [materials] = useState<string[]>([
    'Copper', 'Silver', 'Brass', 'Gold', 'Panchdhatu', 'Steel'
  ]);
  const [formData, setFormData] = useState<YantraFormData>({
    name: '',
    englishName: '',
    category: '',
    deity: '',
    material: '',
    size: '',
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    description: '',
    benefits: '',
    activation: 'Yes',
    isBlessed: false,
    isCustom: false,
    isEnergized: false,
    inStock: true,
    isActive: true,
    stock: 0,
    rating: 4.5,
    reviews: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalYantra, setTotalYantra] = useState(0);

  // Load data on component mount
  useEffect(() => {
    fetchYantras();
    fetchCategories();
    fetchDeities();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchYantras = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      };
      
      const data = await yantraAPI.getAll(params);
      setYantras(data.yantra || []);
      setTotalPages(data.totalPages || 1);
      setTotalYantra(data.totalYantra || 0);
    } catch (error) {
      console.error('Error fetching yantras:', error);
      setError(`Failed to load yantras: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setYantras([]);
      setTotalPages(1);
      setTotalYantra(0);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const categoryData = await yantraAPI.getCategories();
      if (categoryData && categoryData.length > 0) {
        const defaultCategories = [
          'Sacred Geometry',
          'Protection Yantra', 
          'Success Yantra',
          'Planetary Yantra',
          'Deity Yantra',
          'Custom Yantra'
        ];
        const allCategories = [...new Set([...defaultCategories, ...categoryData])];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDeities = async () => {
    try {
      const deityData = await yantraAPI.getDeities();
      if (deityData && deityData.length > 0) {
        const defaultDeities = [
          'Lord Shiva', 'Lord Ganesha', 'Lord Vishnu', 'Lord Brahma',
          'Maa Durga', 'Maa Lakshmi', 'Lord Hanuman', 'Surya Dev',
          'Agni Dev', 'Kartikeya', 'Ardhanarishwar', 'Navdurga'
        ];
        const allDeities = [...new Set([...defaultDeities, ...deityData])];
        setDeities(allDeities);
      }
    } catch (error) {
      console.error('Error fetching deities:', error);
    }
  };

  const filteredYantras = yantras.filter(yantra => {
    const matchesSearch = yantra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         yantra.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         yantra.englishName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || yantra.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof YantraFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      englishName: '',
      category: '',
      deity: '',
      material: '',
      size: '',
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      description: '',
      benefits: '',
      activation: 'Yes',
      isBlessed: false,
      isCustom: false,
      isEnergized: false,
      inStock: true,
      isActive: true,
      stock: 0,
      rating: 4.5,
      reviews: 0
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingYantra(null);
    setError('');
    setSuccess('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate required fields
      const requiredFields = ['name', 'englishName', 'category', 'deity', 'material', 'size', 'price', 'description'];
      const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof YantraFormData];
        return !value || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && value <= 0);
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Missing or empty required fields: ${missingFields.join(', ')}`);
      }

      // Validate that image is selected for new yantra
      if (!editingYantra && !selectedImage) {
        throw new Error('Image is required for new yantra');
      }

      // Prepare the data object
      const dataToSubmit = {
        ...formData,
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
      };

      // Debug log
      console.log('Submitting data:', dataToSubmit);

      // If there's an image, use FormData
      if (selectedImage) {
        const submitData = new FormData();
        
        // Add all form fields individually to FormData
        submitData.append('name', dataToSubmit.name);
        submitData.append('englishName', dataToSubmit.englishName);
        submitData.append('category', dataToSubmit.category);
        submitData.append('deity', dataToSubmit.deity);
        submitData.append('material', dataToSubmit.material);
        submitData.append('size', dataToSubmit.size);
        submitData.append('price', dataToSubmit.price.toString());
        submitData.append('originalPrice', (dataToSubmit.originalPrice || 0).toString());
        submitData.append('discountPercentage', (dataToSubmit.discountPercentage || 0).toString());
        submitData.append('description', dataToSubmit.description);
        submitData.append('benefits', JSON.stringify(dataToSubmit.benefits));
        submitData.append('activation', dataToSubmit.activation);
        submitData.append('isBlessed', dataToSubmit.isBlessed.toString());
        submitData.append('isCustom', dataToSubmit.isCustom.toString());
        submitData.append('isEnergized', dataToSubmit.isEnergized.toString());
        submitData.append('inStock', dataToSubmit.inStock.toString());
        submitData.append('isActive', dataToSubmit.isActive.toString());
        submitData.append('stock', dataToSubmit.stock.toString());
        submitData.append('rating', (dataToSubmit.rating || 4.5).toString());
        submitData.append('reviews', (dataToSubmit.reviews || 0).toString());
        
        // Add image file
        submitData.append('image', selectedImage);
        
        // Debug log
        console.log('FormData entries:');
        for (let [key, value] of submitData.entries()) {
          console.log(key, value);
        }
        
        if (editingYantra) {
          await yantraAPI.update(editingYantra._id, submitData);
          setSuccess('Yantra updated successfully!');
        } else {
          await yantraAPI.create(submitData);
          setSuccess('Yantra created successfully!');
        }
        
        // Reset form and close modal on success
        resetForm();
        setShowAddForm(false);
        fetchYantras();
      } else {
        // If no image, send as JSON
        const response = await fetch(`${API_BASE_URL}/api/yantra${editingYantra ? `/${editingYantra._id}` : '/create'}`, {
          method: editingYantra ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save yantra');
        }

        setSuccess(editingYantra ? 'Yantra updated successfully!' : 'Yantra created successfully!');
        
        // Reset form and close modal on success
        resetForm();
        setShowAddForm(false);
        fetchYantras();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof Error) {
        if (error.message.includes('validation failed')) {
          setError(`Validation Error: ${error.message}. Please check all required fields.`);
        } else {
          setError(error.message);
        }
      } else {
        setError('An error occurred while submitting the form');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (yantra: Yantra) => {
    setFormData({
      name: yantra.name || '',
      englishName: yantra.englishName || '',
      category: yantra.category || '',
      deity: yantra.deity || '',
      material: yantra.material || '',
      size: yantra.size || '',
      price: yantra.price || 0,
      originalPrice: yantra.originalPrice || 0,
      discountPercentage: yantra.discountPercentage || 0,
      description: yantra.description || '',
      benefits: Array.isArray(yantra.benefits) ? yantra.benefits.join(', ') : yantra.benefits || '',
      activation: yantra.activation || 'Yes',
      isBlessed: yantra.isBlessed || false,
      isCustom: yantra.isCustom || false,
      isEnergized: yantra.isEnergized || false,
      inStock: yantra.inStock !== false,
      isActive: yantra.isActive !== false,
      stock: yantra.stock || 0,
      rating: yantra.rating || 4.5,
      reviews: yantra.reviews || 0
    });
    setImagePreview(yantra.image || '');
    setEditingYantra(yantra);
    setShowAddForm(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this yantra?')) {
      try {
        await yantraAPI.delete(id);
        setSuccess('Yantra deleted successfully!');
        fetchYantras();
      } catch (error) {
        setError('Failed to delete yantra');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yantra Management</h1>
          <p className="text-gray-600 mt-2">Manage yantra and sacred geometry services</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Yantra
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Yantras</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalYantra}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Yantras</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : yantras.filter((y: Yantra) => y.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : yantras.reduce((sum, y) => sum + y.stock, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `₹${yantras.reduce((sum, y) => sum + (y.price * y.stock), 0).toLocaleString()}`}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search yantras by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center justify-between">
            <div>
              <strong>Error:</strong> {error}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchYantras}
              className="ml-4"
            >
              Retry
            </Button>
          </div>
          <div className="text-sm mt-2 text-red-600">
            Make sure your backend server is running on the correct port and the API endpoints are accessible.
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Yantras List */}
      <Card>
        <CardHeader>
          <CardTitle>Yantras ({totalYantra})</CardTitle>
          <CardDescription>Manage your yantra and sacred geometry services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading yantras...</span>
            </div>
          ) : (
          <div className="space-y-4">
              {filteredYantras.map((yantra: Yantra) => (
              <div key={yantra._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded flex items-center justify-center overflow-hidden">
                    {yantra.image ? (
                      <Image 
                        src={yantra.image} 
                        alt={yantra.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                    <Star className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{yantra.name}</h3>
                    <p className="text-sm text-gray-600">{yantra.englishName}</p>
                    <p className="text-gray-600 text-sm">{yantra.description?.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={yantra.isActive ? 'default' : 'secondary'}>
                        {yantra.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{yantra.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Ruler className="w-3 h-3" />
                        {yantra.material}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Zap className="w-3 h-3" />
                        {yantra.size}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold">₹{yantra.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Stock: {yantra.stock}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {yantra.activation === "Yes" && <Badge variant="outline" className="text-xs">Activated</Badge>}
                      {yantra.isBlessed && <Badge variant="outline" className="text-xs">Blessed</Badge>}
                      {yantra.isCustom && <Badge variant="outline" className="text-xs">Custom</Badge>}
                      {yantra.isEnergized && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Energized</Badge>}
                      {yantra.inStock && <Badge variant="outline" className="text-xs bg-green-100 text-green-800">In Stock</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(yantra)} title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(yantra._id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
              
              {filteredYantras.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No yantras found.</p>
                  <Button onClick={() => setShowAddForm(true)} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Yantra
                  </Button>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Add Yantra Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editingYantra ? 'Edit Yantra' : 'Add New Yantra'}</CardTitle>
                  <CardDescription>
                    {editingYantra ? 'Update yantra details' : 'Enter yantra details to add to your services'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-sm">
                <strong>Note:</strong> All fields marked with * are required. Make sure to fill in all required fields before submitting.
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium text-red-600">Yantra Image *</label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingYantra}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                    {!editingYantra && (
                      <p className="text-xs text-red-600 mt-1">Image is required for new yantra</p>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-red-600">Yantra Name *</label>
                    <Input 
                      placeholder="e.g., Sri Yantra"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-red-600">English Name *</label>
                    <Input 
                      placeholder="e.g., Sacred Sri Yantra"
                      value={formData.englishName}
                      onChange={(e) => handleInputChange('englishName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-red-600">Category *</label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                  <div>
                    <label className="text-sm font-medium text-red-600">Deity *</label>
                    <Select value={formData.deity} onValueChange={(value) => handleInputChange('deity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deity" />
                      </SelectTrigger>
                      <SelectContent>
                        {deities.map(deity => (
                          <SelectItem key={deity} value={deity}>{deity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-red-600">Material *</label>
                    <Select value={formData.material} onValueChange={(value) => handleInputChange('material', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                        {materials.map(material => (
                          <SelectItem key={material} value={material}>{material}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                    <label className="text-sm font-medium text-red-600">Size *</label>
                    <Input 
                      placeholder="e.g., 6 inches"
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      required
                    />
                </div>
              </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-red-600">Price (₹) *</label>
                    <Input 
                      placeholder="0" 
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      required
                    />
                  </div>
                <div>
                    <label className="text-sm font-medium">Original Price (₹)</label>
                    <Input 
                      placeholder="0" 
                      type="number"
                      value={formData.originalPrice || 0}
                      onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Discount %</label>
                    <Input 
                      placeholder="0" 
                      type="number"
                      value={formData.discountPercentage || 0}
                      onChange={(e) => handleInputChange('discountPercentage', Number(e.target.value))}
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-red-600">Activation Required *</label>
                    <Select value={formData.activation} onValueChange={(value) => handleInputChange('activation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Optional">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  <div>
                    <label className="text-sm font-medium">Initial Stock</label>
                    <Input 
                      placeholder="0" 
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <Input 
                      placeholder="4.5" 
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating || 4.5}
                      onChange={(e) => handleInputChange('rating', Number(e.target.value))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Default: 4.5 stars</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reviews Count</label>
                    <Input 
                      placeholder="0" 
                      type="number"
                      min="0"
                      value={formData.reviews || 0}
                      onChange={(e) => handleInputChange('reviews', Number(e.target.value))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Number of customer reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                <div className="flex items-center space-x-2">
                      <Switch 
                        id="blessed" 
                        checked={formData.isBlessed}
                        onCheckedChange={(checked) => handleInputChange('isBlessed', checked)}
                      />
                  <label htmlFor="blessed" className="text-sm font-medium">Blessed by Guru</label>
                </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="custom" 
                        checked={formData.isCustom}
                        onCheckedChange={(checked) => handleInputChange('isCustom', checked)}
                      />
                      <label htmlFor="custom" className="text-sm font-medium">Custom Made</label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="energized" 
                        checked={formData.isEnergized}
                        onCheckedChange={(checked) => handleInputChange('isEnergized', checked)}
                      />
                      <label htmlFor="energized" className="text-sm font-medium">Energized</label>
              </div>
              <div className="flex items-center space-x-2">
                      <Switch 
                        id="inStock" 
                        checked={formData.inStock}
                        onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                      />
                      <label htmlFor="inStock" className="text-sm font-medium">In Stock</label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isActive" 
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">Active</label>
              </div>

              <div>
                <label className="text-sm font-medium">Benefits</label>
                  <Textarea 
                    placeholder="Enter benefits separated by commas (e.g., Prosperity, Abundance, Spiritual Growth)"
                    value={formData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple benefits with commas</p>
              </div>

              <div>
                  <label className="text-sm font-medium text-red-600">Description *</label>
                  <Textarea 
                    placeholder="Detailed description of the yantra..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    required
                  />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={submitting}>
                  Cancel
                </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingYantra ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingYantra ? 'Update Yantra' : 'Add Yantra'
                    )}
                </Button>
              </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

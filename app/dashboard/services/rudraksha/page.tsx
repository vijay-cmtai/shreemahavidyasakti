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
  CircleDot, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Circle,
  Zap,
  Heart,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

// Types
interface WorshipOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  silverCap: boolean;
  premium?: boolean;
}

interface Rudraksha {
  _id: string;
  name: string;
  englishName: string;
  category: string;
  deity: string;
  planet: string;
  image: string;
  description: string;
  benefits: string[];
  size: string;
  origin: string;
  certified: boolean;
  rare: boolean;
  inStock: boolean;
  worshipOptions: WorshipOption[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface RudrakshaFormData {
  name: string;
  englishName: string;
  category: string;
  deity: string;
  planet: string;
  description: string;
  benefits: string;
  size: string;
  origin: string;
  certified: boolean;
  rare: boolean;
  inStock: boolean;
  isActive: boolean;
  worshipOptions: WorshipOption[];
}

interface ApiResponse {
  rudraksha: Rudraksha[];
  totalPages: number;
  currentPage: number;
  totalRudraksha: number;
}

// API Base URL - Update this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Functions
const rudrakshaAPI = {
  // Get all rudraksha for admin
  getAll: async (params: Record<string, any> = {}): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/api/rudraksha/admin/all?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch rudraksha');
    return response.json();
  },
  
  // Create new rudraksha
  create: async (formData: FormData): Promise<{ message: string; data: Rudraksha }> => {
    const response = await fetch(`${API_BASE_URL}/api/rudraksha/create`, {
      method: 'POST',
      body: formData, // FormData for file upload
    });
    if (!response.ok) {
      const error = await response.json();
      console.error('Backend error response:', error);
      throw new Error(error.error || error.errorMessage || 'Failed to create rudraksha');
    }
    return response.json();
  },
  
  // Update rudraksha
  update: async (id: string, formData: FormData): Promise<{ message: string; data: Rudraksha }> => {
    const response = await fetch(`${API_BASE_URL}/api/rudraksha/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update rudraksha');
    }
    return response.json();
  },
  
  // Delete rudraksha
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/rudraksha/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete rudraksha');
    return response.json();
  },
  
  // Get categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rudraksha/categories/list`);
      
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
      const response = await fetch(`${API_BASE_URL}/api/rudraksha/deities/list`);
      
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

  // Get planets
  getPlanets: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rudraksha/planets/list`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch planets`);
      }
      
      const planets = await response.json();
      return Array.isArray(planets) ? planets : [];
    } catch (error) {
      console.error('Planets API Error:', error);
      throw error;
    }
  },

  // Get rare items
  getRare: async (): Promise<Rudraksha[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rudraksha/rare/list`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch rare items`);
      }
      
      const data = await response.json();
      return data.rudraksha || [];
    } catch (error) {
      console.error('Rare items API Error:', error);
      throw error;
    }
  },

  // Get certified items
  getCertified: async (): Promise<Rudraksha[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rudraksha/certified/list`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch certified items`);
      }
      
      const data = await response.json();
      return data.rudraksha || [];
    } catch (error) {
      console.error('Certified items API Error:', error);
      throw error;
    }
  }
};

export default function RudrakshaManagement() {
  const [rudrakshas, setRudrakshas] = useState<Rudraksha[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRudraksha, setEditingRudraksha] = useState<Rudraksha | null>(null);
  const [categories, setCategories] = useState<string[]>([
    'Natural Rudraksha',
    'Silver Rudraksha', 
    'Gold Rudraksha',
    'Rudraksha Mala',
    'Rudraksha Set',
    'Certified Rudraksha',
    'Rare Rudraksha'
  ]);
  const [deities, setDeities] = useState<string[]>([
    'Lord Shiva', 'Lord Ganesha', 'Lord Vishnu', 'Lord Brahma',
    'Maa Durga', 'Maa Lakshmi', 'Lord Hanuman', 'Surya Dev',
    'Agni Dev', 'Kartikeya', 'Ardhanarishwar', 'Navdurga', 'Ekadash Rudra'
  ]);
  const [planets, setPlanets] = useState<string[]>([
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus',
    'Saturn', 'Rahu', 'Ketu', 'All Directions', 'Combined', 'Third Eye'
  ]);
  const [formData, setFormData] = useState<RudrakshaFormData>({
    name: '',
    englishName: '',
    category: '',
    deity: '',
    planet: '',
    description: '',
    benefits: '',
    size: '',
    origin: '',
    certified: false,
    rare: false,
    inStock: true,
    isActive: true,
    worshipOptions: []
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRudraksha, setTotalRudraksha] = useState(0);

  // Load data on component mount
  useEffect(() => {
    fetchRudrakshas();
    fetchCategories();
    fetchDeities();
    fetchPlanets();
  }, [currentPage, searchTerm, selectedCategory]);
  
  const fetchRudrakshas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      };
      
      const data = await rudrakshaAPI.getAll(params);
      setRudrakshas(data.rudraksha || []);
      setTotalPages(data.totalPages || 1);
      setTotalRudraksha(data.totalRudraksha || 0);
    } catch (error) {
      console.error('Error fetching rudrakshas:', error);
      setError(`Failed to load rudrakshas: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Set empty state on error
      setRudrakshas([]);
      setTotalPages(1);
      setTotalRudraksha(0);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const categoryData = await rudrakshaAPI.getCategories();
      if (categoryData && categoryData.length > 0) {
        // Merge API categories with defaults, removing duplicates
        const defaultCategories = [
          'Natural Rudraksha',
          'Silver Rudraksha', 
          'Gold Rudraksha',
          'Rudraksha Mala',
          'Rudraksha Set',
          'Certified Rudraksha',
          'Rare Rudraksha'
        ];
        const allCategories = [...new Set([...defaultCategories, ...categoryData])];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Keep the default categories that are already set
    }
  };

  const fetchDeities = async () => {
    try {
      const deityData = await rudrakshaAPI.getDeities();
      if (deityData && deityData.length > 0) {
        // Merge API deities with defaults, removing duplicates
        const defaultDeities = [
          'Lord Shiva', 'Lord Ganesha', 'Lord Vishnu', 'Lord Brahma',
          'Maa Durga', 'Maa Lakshmi', 'Lord Hanuman', 'Surya Dev',
          'Agni Dev', 'Kartikeya', 'Ardhanarishwar', 'Navdurga', 'Ekadash Rudra'
        ];
        const allDeities = [...new Set([...defaultDeities, ...deityData])];
        setDeities(allDeities);
      }
    } catch (error) {
      console.error('Error fetching deities:', error);
      // Keep the default deities that are already set
    }
  };

  const fetchPlanets = async () => {
    try {
      const planetData = await rudrakshaAPI.getPlanets();
      if (planetData && planetData.length > 0) {
        // Merge API planets with defaults, removing duplicates
        const defaultPlanets = [
          'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus',
          'Saturn', 'Rahu', 'Ketu', 'All Directions', 'Combined', 'Third Eye'
        ];
        const allPlanets = [...new Set([...defaultPlanets, ...planetData])];
        setPlanets(allPlanets);
      }
    } catch (error) {
      console.error('Error fetching planets:', error);
      // Keep the default planets that are already set
    }
  };
  
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

  const handleInputChange = (field: keyof RudrakshaFormData, value: any) => {
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
      planet: '',
      description: '',
      benefits: '',
      size: '',
      origin: '',
      certified: false,
      rare: false,
      inStock: true,
      isActive: true,
      worshipOptions: []
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingRudraksha(null);
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
      const requiredFields = ['name', 'englishName', 'category', 'deity', 'planet', 'description', 'size', 'origin'];
      const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof RudrakshaFormData];
        return !value || (typeof value === 'string' && value.trim() === '');
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Missing or empty required fields: ${missingFields.join(', ')}`);
      }

      // Validate that image is selected for new rudraksha
      if (!editingRudraksha && !selectedImage) {
        throw new Error('Image is required for new rudraksha');
      }

      // Validate worship options if any exist
      if (formData.worshipOptions.length > 0) {
        const invalidOptions = formData.worshipOptions.filter(option => 
          !option.name || !option.description || option.price <= 0
        );
        if (invalidOptions.length > 0) {
          throw new Error('All worship options must have a name, description, and valid price');
        }
      }

      // Prepare the data object
      const dataToSubmit = {
        ...formData,
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
        worshipOptions: formData.worshipOptions
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
        submitData.append('planet', dataToSubmit.planet);
        submitData.append('description', dataToSubmit.description);
        submitData.append('benefits', JSON.stringify(dataToSubmit.benefits));
        submitData.append('size', dataToSubmit.size);
        submitData.append('origin', dataToSubmit.origin);
        submitData.append('certified', dataToSubmit.certified.toString());
        submitData.append('rare', dataToSubmit.rare.toString());
        submitData.append('inStock', dataToSubmit.inStock.toString());
        submitData.append('isActive', dataToSubmit.isActive.toString());
        
        // Send worship options as individual entries for each option
        dataToSubmit.worshipOptions.forEach((option, index) => {
          submitData.append(`worshipOptions[${index}][id]`, option.id);
          submitData.append(`worshipOptions[${index}][name]`, option.name);
          submitData.append(`worshipOptions[${index}][description]`, option.description);
          submitData.append(`worshipOptions[${index}][price]`, option.price.toString());
          submitData.append(`worshipOptions[${index}][silverCap]`, option.silverCap.toString());
          submitData.append(`worshipOptions[${index}][premium]`, (option.premium || false).toString());
          
          // Add features as individual entries
          option.features.forEach((feature, featureIndex) => {
            submitData.append(`worshipOptions[${index}][features][${featureIndex}]`, feature);
          });
        });
        
        // Add image file
        submitData.append('image', selectedImage);
        
        // Debug log
        console.log('FormData entries:');
        for (let [key, value] of submitData.entries()) {
          console.log(key, value);
        }
        
        // Additional debug for worship options
        console.log('Worship Options being sent:', dataToSubmit.worshipOptions);
        console.log('Benefits being sent:', dataToSubmit.benefits);
        
        if (editingRudraksha) {
          await rudrakshaAPI.update(editingRudraksha._id, submitData);
          setSuccess('Rudraksha updated successfully!');
        } else {
          await rudrakshaAPI.create(submitData);
          setSuccess('Rudraksha created successfully!');
        }
        
        // Reset form and close modal on success
        resetForm();
        setShowAddForm(false);
        fetchRudrakshas();
      } else {
        // If no image, send as JSON
        const response = await fetch(`${API_BASE_URL}/api/rudraksha${editingRudraksha ? `/${editingRudraksha._id}` : '/create'}`, {
          method: editingRudraksha ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save rudraksha');
        }

        setSuccess(editingRudraksha ? 'Rudraksha updated successfully!' : 'Rudraksha created successfully!');
        
        // Reset form and close modal on success
        resetForm();
        setShowAddForm(false);
        fetchRudrakshas();
      }
          } catch (error) {
        console.error('Form submission error:', error);
        if (error instanceof Error) {
          // Check if it's a validation error from backend
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
  
  const handleEdit = (rudraksha: Rudraksha) => {
    setFormData({
      name: rudraksha.name || '',
      englishName: rudraksha.englishName || '',
      category: rudraksha.category || '',
      deity: rudraksha.deity || '',
      planet: rudraksha.planet || '',
      description: rudraksha.description || '',
      benefits: Array.isArray(rudraksha.benefits) ? rudraksha.benefits.join(', ') : rudraksha.benefits || '',
      size: rudraksha.size || '',
      origin: rudraksha.origin || '',
      certified: rudraksha.certified || false,
      rare: rudraksha.rare || false,
      inStock: rudraksha.inStock !== false,
      isActive: rudraksha.isActive !== false,
      worshipOptions: rudraksha.worshipOptions || []
    });
    setImagePreview(rudraksha.image || '');
    setEditingRudraksha(rudraksha);
    setShowAddForm(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this rudraksha?')) {
      try {
        await rudrakshaAPI.delete(id);
        setSuccess('Rudraksha deleted successfully!');
        fetchRudrakshas();
      } catch (error) {
        setError('Failed to delete rudraksha');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rudraksha Management</h1>
          <p className="text-gray-600 mt-2">Manage rudraksha bead services</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Rudraksha
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rudrakshas</CardTitle>
            <CircleDot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalRudraksha}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rudrakshas</CardTitle>
            <CircleDot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : rudrakshas.filter((r: Rudraksha) => r.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : rudrakshas.filter((r: Rudraksha) => r.inStock).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certified</CardTitle>
            <CircleDot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : rudrakshas.filter((r: Rudraksha) => r.certified).length}</div>
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
                  placeholder="Search rudrakshas by name or description..."
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
              onClick={fetchRudrakshas}
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

      {/* Rudrakshas List */}
      <Card>
        <CardHeader>
          <CardTitle>Rudrakshas ({totalRudraksha})</CardTitle>
          <CardDescription>Manage your rudraksha bead services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading rudrakshas...</span>
            </div>
          ) : (
          <div className="space-y-4">
              {rudrakshas.map((rudraksha: Rudraksha) => (
              <div key={rudraksha._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded flex items-center justify-center overflow-hidden">
                    {rudraksha.image ? (
                      <Image 
                        src={rudraksha.image} 
                        alt={rudraksha.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                    <CircleDot className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{rudraksha.name}</h3>
                    <p className="text-sm text-gray-600">{rudraksha.englishName}</p>
                    <p className="text-gray-600 text-sm">{rudraksha.description?.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={rudraksha.isActive ? 'default' : 'secondary'}>
                        {rudraksha.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{rudraksha.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Circle className="w-3 h-3" />
                        {rudraksha.deity}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Zap className="w-3 h-3" />
                        {rudraksha.size}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Planet: {rudraksha.planet}</p>
                    <p className="text-sm text-gray-500">Origin: {rudraksha.origin}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {rudraksha.certified && <Badge variant="outline" className="text-xs">Certified</Badge>}
                      {rudraksha.rare && <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Rare</Badge>}
                      {rudraksha.inStock && <Badge variant="outline" className="text-xs bg-green-100 text-green-800">In Stock</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(rudraksha)} title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rudraksha._id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
              
              {rudrakshas.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No rudrakshas found.</p>
                  <Button onClick={() => setShowAddForm(true)} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Rudraksha
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

      {/* Add Rudraksha Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingRudraksha ? 'Edit Rudraksha' : 'Add New Rudraksha'}</CardTitle>
                <CardDescription>
                  {editingRudraksha ? 'Update rudraksha details' : 'Enter rudraksha details to add to your services'}
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
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-red-600">Rudraksha Image *</label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingRudraksha}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    </div>
                  )}
                  {!editingRudraksha && (
                    <p className="text-xs text-red-600 mt-1">Image is required for new rudraksha</p>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-red-600">Rudraksha Name *</label>
                  <Input 
                    placeholder="e.g., 5 Mukhi Rudraksha"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-red-600">English Name *</label>
                  <Input 
                    placeholder="e.g., Five Face Rudraksha"
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
                  <label className="text-sm font-medium text-red-600">Planet *</label>
                  <Select value={formData.planet} onValueChange={(value) => handleInputChange('planet', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select planet" />
                    </SelectTrigger>
                    <SelectContent>
                      {planets.map(planet => (
                        <SelectItem key={planet} value={planet}>{planet}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-red-600">Size *</label>
                  <Input 
                    placeholder="e.g., 12-15mm"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Origin *</label>
                  <Select value={formData.origin} onValueChange={(value) => handleInputChange('origin', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nepal">Nepal</SelectItem>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Java">Java</SelectItem>
                      <SelectItem value="Haridwar">Haridwar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="certified" 
                      checked={formData.certified}
                      onCheckedChange={(checked) => handleInputChange('certified', checked)}
                    />
                    <label htmlFor="certified" className="text-sm font-medium">Certified</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="rare" 
                      checked={formData.rare}
                      onCheckedChange={(checked) => handleInputChange('rare', checked)}
                    />
                    <label htmlFor="rare" className="text-sm font-medium">Rare</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="inStock" 
                      checked={formData.inStock}
                      onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                    />
                    <label htmlFor="inStock" className="text-sm font-medium">In Stock</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch 
                      id="isActive" 
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Benefits *</label>
                <Textarea 
                  placeholder="Enter benefits separated by commas (e.g., Wisdom, Knowledge, Mental Peace)"
                  value={formData.benefits}
                  onChange={(e) => handleInputChange('benefits', e.target.value)}
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple benefits with commas</p>
              </div>

              <div>
                <label className="text-sm font-medium">Description *</label>
                <Textarea 
                  placeholder="Detailed description of the rudraksha..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Worship Options Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium">Worship Options</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOption: WorshipOption = {
                        id: `option-${Date.now()}`,
                        name: '',
                        description: '',
                        price: 0,
                        features: [],
                        silverCap: false,
                        premium: false
                      };
                      handleInputChange('worshipOptions', [...formData.worshipOptions, newOption]);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Worship Option
                  </Button>
                </div>

                {formData.worshipOptions.map((option, index) => (
                  <div key={option.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Worship Option {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedOptions = formData.worshipOptions.filter((_, i) => i !== index);
                          handleInputChange('worshipOptions', updatedOptions);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-medium">Name *</label>
                        <Input
                          placeholder="e.g., Basic Blessed"
                          value={option.name}
                          onChange={(e) => {
                            const updatedOptions = [...formData.worshipOptions];
                            updatedOptions[index].name = e.target.value;
                            handleInputChange('worshipOptions', updatedOptions);
                          }}
                        />
              </div>
              <div>
                        <label className="text-xs font-medium">Price (₹) *</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={option.price}
                          onChange={(e) => {
                            const updatedOptions = [...formData.worshipOptions];
                            updatedOptions[index].price = Number(e.target.value);
                            handleInputChange('worshipOptions', updatedOptions);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="text-xs font-medium">Description *</label>
                      <Textarea
                        placeholder="Description of this worship option"
                        value={option.description}
                        rows={2}
                        onChange={(e) => {
                          const updatedOptions = [...formData.worshipOptions];
                          updatedOptions[index].description = e.target.value;
                          handleInputChange('worshipOptions', updatedOptions);
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="text-xs font-medium">Features</label>
                      <Textarea
                        placeholder="Enter features separated by commas"
                        value={option.features.join(', ')}
                        rows={2}
                        onChange={(e) => {
                          const updatedOptions = [...formData.worshipOptions];
                          updatedOptions[index].features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                          handleInputChange('worshipOptions', updatedOptions);
                        }}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`silverCap-${index}`}
                          checked={option.silverCap}
                          onCheckedChange={(checked) => {
                            const updatedOptions = [...formData.worshipOptions];
                            updatedOptions[index].silverCap = checked;
                            handleInputChange('worshipOptions', updatedOptions);
                          }}
                        />
                        <label htmlFor={`silverCap-${index}`} className="text-xs font-medium">Silver Cap</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`premium-${index}`}
                          checked={option.premium}
                          onCheckedChange={(checked) => {
                            const updatedOptions = [...formData.worshipOptions];
                            updatedOptions[index].premium = checked;
                            handleInputChange('worshipOptions', updatedOptions);
                          }}
                        />
                        <label htmlFor={`premium-${index}`} className="text-xs font-medium">Premium</label>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.worshipOptions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No worship options added. Click "Add Worship Option" to create one.
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingRudraksha ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingRudraksha ? 'Update Rudraksha' : 'Add Rudraksha'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


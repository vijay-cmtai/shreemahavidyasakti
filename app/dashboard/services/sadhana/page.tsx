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
  Brain, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Clock,
  Users,
  Calendar,
  BookOpen,
  Loader2
} from 'lucide-react';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
interface Sadhana {
  _id: string;
  name: string;
  englishName: string;
  duration: string;
  icon: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  process: string[];
  benefits: string[];
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  deity: string;
  inStock: boolean;
  isActive: boolean;
  discountPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface SadhanaFormData {
  name: string;
  englishName: string;
  duration: string;
  icon: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  process: string;
  benefits: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  deity: string;
  inStock: boolean;
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  sadhanas?: Sadhana[];
}

// Helper function to get image URL
const getImageUrl = (sadhana: Sadhana): string => {
  if (!sadhana || !sadhana.image) return '';
  
  // If it's already a full URL, return as is
  if (sadhana.image.startsWith('http://') || sadhana.image.startsWith('https://')) {
    return sadhana.image;
  }
  
  // If it starts with /, it's a relative path
  if (sadhana.image.startsWith('/')) {
    return `${API_BASE_URL}${sadhana.image}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `${API_BASE_URL}/uploads/${sadhana.image}`;
};

// API functions
const sadhanaAPI = {
  getAll: async (): Promise<Sadhana[]> => {
    // Try admin endpoint first, then fallback to public endpoint
    const endpoints = [
      `${API_BASE_URL}/api/sadhana/admin/all`,
      `${API_BASE_URL}/api/sadhana/public`,
      `${API_BASE_URL}/api/sadhana/all`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint);
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          console.log('API Response from', endpoint, ':', data);
          
          // Handle different response formats
          if (data.success && data.data) {
            return Array.isArray(data.data) ? data.data : [];
          } else if (data.sadhanas) {
            return Array.isArray(data.sadhanas) ? data.sadhanas : [];
          } else if (data.sadhana) {
            return Array.isArray(data.sadhana) ? data.sadhana : [];
          } else if (Array.isArray(data)) {
            return data;
          } else {
            console.warn('Unexpected response format:', data);
            continue; // Try next endpoint
          }
        } else {
          console.warn(`Endpoint ${endpoint} failed:`, response.status, response.statusText);
        }
      } catch (err) {
        console.warn(`Error with endpoint ${endpoint}:`, err);
        continue; // Try next endpoint
      }
    }
    
    throw new Error('All API endpoints failed to fetch sadhanas');
  },

  create: async (formData: FormData): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/sadhana/create`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create sadhana');
    return response.json();
  },

  update: async (id: string, formData: FormData): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/sadhana/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update sadhana');
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/sadhana/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete sadhana');
    return response.json();
  }
};

export default function SadhanaManagement() {
  // State
  const [sadhanas, setSadhanas] = useState<Sadhana[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSadhana, setEditingSadhana] = useState<Sadhana | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [formData, setFormData] = useState<SadhanaFormData>({
    name: '',
    englishName: '',
    duration: '',
    icon: '',
    price: 0,
    originalPrice: 0,
    rating: 4.5,
    reviews: 0,
    description: '',
    process: '',
    benefits: '',
    level: 'Beginner',
    category: '',
    deity: '',
    inStock: true,
    isActive: true
  });

  // Fetch sadhanas on component mount
  useEffect(() => {
    console.log('Component mounted, API_BASE_URL:', API_BASE_URL);
    fetchSadhanas();
  }, []);

  const fetchSadhanas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching sadhanas from:', `${API_BASE_URL}/api/sadhana/admin/all`);
      const data = await sadhanaAPI.getAll();
      console.log('Fetched sadhanas:', data);
      console.log('Number of sadhanas:', data.length);
      setSadhanas(data);
    } catch (err: any) {
      console.error('Error fetching sadhanas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSadhanas = sadhanas.filter(sadhana => {
    const matchesSearch = sadhana.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sadhana.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sadhana.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sadhana.deity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sadhana.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dynamic categories from API data
  const categories = Array.from(new Set(sadhanas.map(s => s.category)));
  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  // Form handlers
  const handleInputChange = (field: keyof SadhanaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessChange = (value: string) => {
    setFormData(prev => ({ ...prev, process: value }));
  };

  const handleBenefitsChange = (value: string) => {
    setFormData(prev => ({ ...prev, benefits: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      englishName: '',
      duration: '',
      icon: '',
      price: 0,
      originalPrice: 0,
      rating: 4.5,
      reviews: 0,
      description: '',
      process: '',
      benefits: '',
      level: 'Beginner',
      category: '',
      deity: '',
      inStock: true,
      isActive: true
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingSadhana(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      // Validate required fields
      if (!formData.name || !formData.englishName || !formData.duration || !formData.category || !formData.deity) {
        setError('Please fill in all required fields');
        return;
      }

      if (!editingSadhana && !selectedImage) {
        setError('Please select an image for the sadhana');
        return;
      }

      const submitData = new FormData();
      
      // Add image if selected
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      // Add all form fields individually to FormData
      submitData.append('name', formData.name);
      submitData.append('englishName', formData.englishName);
      submitData.append('duration', formData.duration);
      submitData.append('icon', formData.icon);
      submitData.append('price', formData.price.toString());
      submitData.append('originalPrice', formData.originalPrice.toString());
      submitData.append('rating', formData.rating.toString());
      submitData.append('reviews', formData.reviews.toString());
      submitData.append('description', formData.description);
      submitData.append('process', JSON.stringify(formData.process.split(',').map(p => p.trim()).filter(p => p)));
      submitData.append('benefits', JSON.stringify(formData.benefits.split(',').map(b => b.trim()).filter(b => b)));
      submitData.append('level', formData.level);
      submitData.append('category', formData.category);
      submitData.append('deity', formData.deity);
      submitData.append('inStock', formData.inStock.toString());
      submitData.append('isActive', formData.isActive.toString());

      let response;
      if (editingSadhana) {
        response = await sadhanaAPI.update(editingSadhana._id, submitData);
        setSuccess('Sadhana updated successfully!');
      } else {
        response = await sadhanaAPI.create(submitData);
        setSuccess('Sadhana created successfully!');
      }

      resetForm();
      setShowAddForm(false);
      fetchSadhanas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (sadhana: Sadhana) => {
    // Helper function to parse array fields that might be JSON strings
    const parseArrayField = (field: any): string => {
      if (Array.isArray(field)) {
        return field.map(item => {
          // If item is a JSON string, try to parse it
          if (typeof item === 'string' && item.startsWith('[')) {
            try {
              const parsed = JSON.parse(item);
              return Array.isArray(parsed) ? parsed.join(', ') : item;
            } catch {
              return item;
            }
          }
          return item;
        }).join(', ');
      }
      return field || '';
    };

    setFormData({
      name: sadhana.name || '',
      englishName: sadhana.englishName || '',
      duration: sadhana.duration || '',
      icon: sadhana.icon || '',
      price: sadhana.price || 0,
      originalPrice: sadhana.originalPrice || 0,
      rating: sadhana.rating || 4.5,
      reviews: sadhana.reviews || 0,
      description: sadhana.description || '',
      process: parseArrayField(sadhana.process),
      benefits: parseArrayField(sadhana.benefits),
      level: sadhana.level || 'Beginner',
      category: sadhana.category || '',
      deity: sadhana.deity || '',
      inStock: sadhana.inStock !== false,
      isActive: sadhana.isActive !== false
    });
    setImagePreview(sadhana.image || '');
    setEditingSadhana(sadhana);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sadhana?')) {
      try {
        await sadhanaAPI.delete(id);
        setSuccess('Sadhana deleted successfully!');
        fetchSadhanas();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sadhana Management</h1>
          <p className="text-gray-600 mt-2">Manage spiritual practice services</p>
        </div>
                 <div className="flex gap-2">
           <Button variant="outline" onClick={fetchSadhanas}>
             <Search className="w-4 h-4 mr-2" />
             Refresh
           </Button>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Sadhana
        </Button>
      </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sadhanas</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sadhanas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sadhanas</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sadhanas.filter(s => s.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sadhanas.filter(s => s.inStock).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sadhanas.length > 0 ? `₹${Math.round(sadhanas.reduce((sum, s) => sum + s.price, 0) / sadhanas.length)}` : '₹0'}
            </div>
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
                  placeholder="Search sadhanas by name, deity, or description..."
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

      {/* Sadhanas List */}
      <Card>
        <CardHeader>
          <CardTitle>Sadhanas ({filteredSadhanas.length})</CardTitle>
          <CardDescription>Manage your spiritual practice services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading sadhanas...</p>
            </div>
          ) : (
          <div className="space-y-4">
            {filteredSadhanas.map((sadhana) => (
                <div key={sadhana._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center overflow-hidden">
                      {sadhana.image ? (
                        <img 
                          src={getImageUrl(sadhana)} 
                          alt={sadhana.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{sadhana.name}</h3>
                       <p className="text-gray-600">{sadhana.englishName}</p>
                       <p className="text-sm text-gray-500 mb-2 line-clamp-2">{sadhana.description}</p>
                       <div className="flex items-center gap-2 mt-1 flex-wrap">
                         <Badge variant={sadhana.isActive ? 'default' : 'secondary'}>
                           {sadhana.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{sadhana.category}</Badge>
                         <Badge variant="outline">{sadhana.level}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {sadhana.duration}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-3 h-3" />
                           {sadhana.deity}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold">₹{sadhana.price.toLocaleString()}</p>
                      {sadhana.originalPrice > sadhana.price && (
                        <p className="text-sm text-gray-500 line-through">₹{sadhana.originalPrice.toLocaleString()}</p>
                      )}
                    <div className="flex items-center gap-2 mt-1">
                        {sadhana.inStock && <Badge variant="outline" className="text-xs">In Stock</Badge>}
                        <Badge variant="outline" className="text-xs">⭐ {sadhana.rating}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(sadhana)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(sadhana._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
              {filteredSadhanas.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sadhanas found</p>
                </div>
              )}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Sadhana Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingSadhana ? 'Edit Sadhana' : 'Add New Sadhana'}</CardTitle>
              <CardDescription>Enter sadhana details to {editingSadhana ? 'update' : 'add to'} your services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-red-600">Sadhana Name *</label>
                    <Input 
                      placeholder="e.g., Gayatri Mantra Sadhana" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-red-600">English Name *</label>
                    <Input 
                      placeholder="e.g., Gayatri Mantra Practice" 
                      value={formData.englishName}
                      onChange={(e) => handleInputChange('englishName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-red-600">Category *</label>
                    <Input 
                      placeholder="e.g., Mantra Sadhana" 
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-red-600">Deity *</label>
                    <Input 
                      placeholder="e.g., Gayatri Devi" 
                      value={formData.deity}
                      onChange={(e) => handleInputChange('deity', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-red-600">Duration *</label>
                    <Input 
                      placeholder="e.g., 40 days" 
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Icon</label>
                    <Input 
                      placeholder="e.g., 🕉️" 
                      value={formData.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-red-600">Level *</label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="text-sm font-medium text-red-600">Original Price (₹) *</label>
                    <Input 
                      placeholder="0" 
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
                      required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <Input 
                      placeholder="4.5" 
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', Number(e.target.value))}
                    />
                </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Reviews Count</label>
                    <Input 
                      placeholder="0" 
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={(e) => handleInputChange('reviews', Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Image</label>
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingSadhana}
                    />
                    {!editingSadhana && (
                      <p className="text-xs text-gray-500 mt-1">Image is required for new sadhanas</p>
                    )}
                </div>
              </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div>
                    <label className="text-sm font-medium">Image Preview</label>
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded border"
                      />
                </div>
              </div>
                )}

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-red-600">Description *</label>
                  <Textarea 
                    placeholder="Detailed description of the sadhana..." 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                {/* Process */}
              <div>
                  <label className="text-sm font-medium">Process Steps</label>
                  <Textarea 
                    placeholder="Enter process steps separated by commas (e.g., Step 1, Step 2, Step 3)" 
                    rows={2}
                    value={formData.process}
                    onChange={(e) => handleProcessChange(e.target.value)}
                  />
              </div>

                {/* Benefits */}
              <div>
                <label className="text-sm font-medium">Benefits</label>
                  <Textarea 
                    placeholder="Enter benefits separated by commas (e.g., Spiritual growth, Mental peace, Energy activation)" 
                    rows={2}
                    value={formData.benefits}
                    onChange={(e) => handleBenefitsChange(e.target.value)}
                  />
                </div>

                {/* Status Switches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setShowAddForm(false);
                    }}
                  >
                  Cancel
                </Button>
                  <Button type="submit">
                    {editingSadhana ? 'Update Sadhana' : 'Add Sadhana'}
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

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
  Flame, 
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
  Loader2
} from 'lucide-react';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
interface Puja {
  _id: string;
  name: string;
  englishName: string;
  category: string;
  deity: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  requirements: string[];
  benefits: string[];
  process: string[];
  maxParticipants: number;
  isOnline: boolean;
  isHomeVisit: boolean;
  priestName: string;
  priestContact: string;
  location: string;
  isActive: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PujaFormData {
  name: string;
  englishName: string;
  category: string;
  deity: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  requirements: string;
  benefits: string;
  process: string;
  maxParticipants: number;
  isOnline: boolean;
  isHomeVisit: boolean;
  priestName: string;
  priestContact: string;
  location: string;
  isActive: boolean;
  inStock: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  pujas?: Puja[];
}

// Helper function to get image URL
const getImageUrl = (puja: Puja): string => {
  if (!puja || !puja.image) return '';
  
  // If it's already a full URL, return as is
  if (puja.image.startsWith('http://') || puja.image.startsWith('https://')) {
    return puja.image;
  }
  
  // If it starts with /, it's a relative path
  if (puja.image.startsWith('/')) {
    return `${API_BASE_URL}${puja.image}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `${API_BASE_URL}/uploads/${puja.image}`;
};

// API functions
const pujaAPI = {
  getAll: async (): Promise<Puja[]> => {
    // Try admin endpoint first, then fallback to public endpoint
    const endpoints = [
      `${API_BASE_URL}/api/puja/admin/all`,
      `${API_BASE_URL}/api/puja/public`,
      `${API_BASE_URL}/api/puja/all`
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
          } else if (data.pujas) {
            return Array.isArray(data.pujas) ? data.pujas : [];
          } else if (data.puja) {
            return Array.isArray(data.puja) ? data.puja : [];
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
    
    throw new Error('All API endpoints failed to fetch pujas');
  },

  create: async (formData: FormData): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/puja/create`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create puja');
    return response.json();
  },

  update: async (id: string, formData: FormData): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/puja/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update puja');
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/puja/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete puja');
    return response.json();
  }
};

export default function PujasManagement() {
  // State
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPuja, setEditingPuja] = useState<Puja | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [formData, setFormData] = useState<PujaFormData>({
    name: '',
    englishName: '',
    category: '',
    deity: '',
    duration: '',
    price: 0,
    originalPrice: 0,
    rating: 4.5,
    reviews: 0,
    description: '',
    requirements: '',
    benefits: '',
    process: '',
    maxParticipants: 10,
    isOnline: true,
    isHomeVisit: true,
    priestName: '',
    priestContact: '',
    location: '',
    isActive: true,
    inStock: true
  });

  // Fetch pujas on component mount
  useEffect(() => {
    console.log('Component mounted, API_BASE_URL:', API_BASE_URL);
    fetchPujas();
  }, []);

  const fetchPujas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching pujas from:', `${API_BASE_URL}/api/puja/admin/all`);
      const data = await pujaAPI.getAll();
      console.log('Fetched pujas:', data);
      console.log('Number of pujas:', data.length);
      setPujas(data);
    } catch (err: any) {
      console.error('Error fetching pujas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPujas = pujas.filter(puja => {
    const matchesSearch = puja.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.priestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.deity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || puja.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dynamic categories from API data
  const categories = Array.from(new Set(pujas.map(p => p.category)));

  // Form handlers
  const handleInputChange = (field: keyof PujaFormData, value: any) => {
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

  const handleRequirementsChange = (value: string) => {
    setFormData(prev => ({ ...prev, requirements: value }));
  };

  const handleBenefitsChange = (value: string) => {
    setFormData(prev => ({ ...prev, benefits: value }));
  };

  const handleProcessChange = (value: string) => {
    setFormData(prev => ({ ...prev, process: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      englishName: '',
      category: '',
      deity: '',
      duration: '',
      price: 0,
      originalPrice: 0,
      rating: 4.5,
      reviews: 0,
      description: '',
      requirements: '',
      benefits: '',
      process: '',
      maxParticipants: 10,
      isOnline: true,
      isHomeVisit: true,
      priestName: '',
      priestContact: '',
      location: '',
      isActive: true,
      inStock: true
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingPuja(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      // Validate required fields
      if (!formData.name || !formData.englishName || !formData.category || !formData.deity || !formData.duration) {
        setError('Please fill in all required fields');
        return;
      }

      if (!editingPuja && !selectedImage) {
        setError('Please select an image for the puja');
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
      submitData.append('category', formData.category);
      submitData.append('deity', formData.deity);
      submitData.append('duration', formData.duration);
      submitData.append('price', formData.price.toString());
      submitData.append('originalPrice', formData.originalPrice.toString());
      submitData.append('rating', formData.rating.toString());
      submitData.append('reviews', formData.reviews.toString());
      submitData.append('description', formData.description);
      submitData.append('requirements', JSON.stringify(formData.requirements.split(',').map(r => r.trim()).filter(r => r)));
      submitData.append('benefits', JSON.stringify(formData.benefits.split(',').map(b => b.trim()).filter(b => b)));
      submitData.append('process', JSON.stringify(formData.process.split(',').map(p => p.trim()).filter(p => p)));
      submitData.append('maxParticipants', formData.maxParticipants.toString());
      submitData.append('isOnline', formData.isOnline.toString());
      submitData.append('isHomeVisit', formData.isHomeVisit.toString());
      submitData.append('priestName', formData.priestName);
      submitData.append('priestContact', formData.priestContact);
      submitData.append('location', formData.location);
      submitData.append('isActive', formData.isActive.toString());
      submitData.append('inStock', formData.inStock.toString());

      let response;
      if (editingPuja) {
        response = await pujaAPI.update(editingPuja._id, submitData);
        setSuccess('Puja updated successfully!');
      } else {
        response = await pujaAPI.create(submitData);
        setSuccess('Puja created successfully!');
      }

      resetForm();
      setShowAddForm(false);
      fetchPujas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (puja: Puja) => {
    // Helper function to parse array fields that might be JSON strings
    const parseArrayField = (field: any): string => {
      if (Array.isArray(field)) {
        return field.map(item => {
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
      name: puja.name || '',
      englishName: puja.englishName || '',
      category: puja.category || '',
      deity: puja.deity || '',
      duration: puja.duration || '',
      price: puja.price || 0,
      originalPrice: puja.originalPrice || 0,
      rating: puja.rating || 4.5,
      reviews: puja.reviews || 0,
      description: puja.description || '',
      requirements: parseArrayField(puja.requirements),
      benefits: parseArrayField(puja.benefits),
      process: parseArrayField(puja.process),
      maxParticipants: puja.maxParticipants || 10,
      isOnline: puja.isOnline !== false,
      isHomeVisit: puja.isHomeVisit !== false,
      priestName: puja.priestName || '',
      priestContact: puja.priestContact || '',
      location: puja.location || '',
      isActive: puja.isActive !== false,
      inStock: puja.inStock !== false
    });
    setImagePreview(puja.image || '');
    setEditingPuja(puja);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this puja?')) {
      try {
        await pujaAPI.delete(id);
        setSuccess('Puja deleted successfully!');
        fetchPujas();
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
          <h1 className="text-3xl font-bold text-gray-900">Pujas Management</h1>
          <p className="text-gray-600 mt-2">Manage puja services and rituals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPujas}>
            <Search className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Puja
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
            <CardTitle className="text-sm font-medium">Total Pujas</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pujas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pujas</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pujas.filter(p => p.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Available</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pujas.filter(p => p.isOnline).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(pujas.reduce((sum, p) => sum + p.price, 0) / pujas.length)}</div>
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
                  placeholder="Search pujas by name or priest..."
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

      {/* Pujas List */}
      <Card>
        <CardHeader>
          <CardTitle>Pujas ({filteredPujas.length})</CardTitle>
          <CardDescription>Manage your puja services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading pujas...</p>
            </div>
          ) : (
          <div className="space-y-4">
            {filteredPujas.map((puja) => (
                <div key={puja._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center overflow-hidden">
                      {puja.image ? (
                        <img 
                          src={getImageUrl(puja)} 
                          alt={puja.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{puja.name}</h3>
                      <p className="text-gray-600">{puja.englishName}</p>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{puja.description}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={puja.isActive ? 'default' : 'secondary'}>
                          {puja.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{puja.category}</Badge>
                        <Badge variant="outline">{puja.deity}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {puja.duration}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-3 h-3" />
                        Max: {puja.maxParticipants}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                      <p className="font-semibold">₹{puja.price.toLocaleString()}</p>
                      {puja.originalPrice > puja.price && (
                        <p className="text-sm text-gray-500 line-through">₹{puja.originalPrice.toLocaleString()}</p>
                      )}
                    <div className="flex items-center gap-2 mt-1">
                      {puja.isOnline && <Badge variant="outline" className="text-xs">Online</Badge>}
                      {puja.isHomeVisit && <Badge variant="outline" className="text-xs">Home Visit</Badge>}
                        <Badge variant="outline" className="text-xs">⭐ {puja.rating || 4.5}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(puja)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(puja._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
              {filteredPujas.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pujas found</p>
                </div>
              )}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Puja Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingPuja ? 'Edit Puja' : 'Add New Puja'}</CardTitle>
              <CardDescription>Enter puja details to {editingPuja ? 'update' : 'add to'} your services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-red-600">Puja Name *</label>
                    <Input 
                      placeholder="e.g., Ganesh Puja" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-red-600">English Name *</label>
                    <Input 
                      placeholder="e.g., Ganesh Worship" 
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
                      placeholder="e.g., Deity Puja" 
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-red-600">Deity *</label>
                    <Input 
                      placeholder="e.g., Lord Ganesh" 
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
                      placeholder="e.g., 2 hours" 
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      placeholder="e.g., Delhi" 
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                </div>
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
                  <label className="text-sm font-medium">Max Participants</label>
                    <Input 
                      placeholder="10" 
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Priest Name</label>
                    <Input 
                      placeholder="Priest name" 
                      value={formData.priestName}
                      onChange={(e) => handleInputChange('priestName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priest Contact</label>
                    <Input 
                      placeholder="Contact number" 
                      value={formData.priestContact}
                      onChange={(e) => handleInputChange('priestContact', e.target.value)}
                    />
                </div>
              </div>

                <div>
                  <label className="text-sm font-medium">Image</label>
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingPuja}
                  />
                  {!editingPuja && (
                    <p className="text-xs text-gray-500 mt-1">Image is required for new pujas</p>
                  )}
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
                    placeholder="Detailed description of the puja..." 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                {/* Requirements */}
              <div>
                <label className="text-sm font-medium">Requirements</label>
                  <Textarea 
                    placeholder="Enter requirements separated by commas (e.g., Ganesh idol, flowers, fruits, sweets)" 
                    rows={2}
                    value={formData.requirements}
                    onChange={(e) => handleRequirementsChange(e.target.value)}
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
                    placeholder="Enter benefits separated by commas (e.g., Success, Prosperity, Good luck)" 
                    rows={2}
                    value={formData.benefits}
                    onChange={(e) => handleBenefitsChange(e.target.value)}
                  />
                </div>

                {/* Status Switches */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isOnline" 
                      checked={formData.isOnline}
                      onCheckedChange={(checked) => handleInputChange('isOnline', checked)}
                    />
                    <label htmlFor="isOnline" className="text-sm font-medium">Available Online</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isHomeVisit" 
                      checked={formData.isHomeVisit}
                      onCheckedChange={(checked) => handleInputChange('isHomeVisit', checked)}
                    />
                    <label htmlFor="isHomeVisit" className="text-sm font-medium">Home Visit Available</label>
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
                    {editingPuja ? 'Update Puja' : 'Add Puja'}
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

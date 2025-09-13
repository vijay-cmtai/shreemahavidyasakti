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
  Gem, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Scale,
  Zap,
  Heart
} from 'lucide-react';

// TypeScript interfaces based on MongoDB schema
interface Gemstone {
  _id: string;
  name: string;
  englishName: string;
  hindiName: string;
  category: string;
  planet: string;
  planetEmoji: string;
  planetHindi: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  benefits: string[];
  jaap: string;
  brahmins: string;
  weight: string;
  origin: string;
  certified: boolean;
  inStock: boolean;
  premium: boolean;
  luxury: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  englishName: string;
  hindiName: string;
  category: string;
  planet: string;
  planetEmoji: string;
  planetHindi: string;
  price: string;
  originalPrice: string;
  image: File | null;
  description: string;
  benefits: string[];
  jaap: string;
  brahmins: string;
  weight: string;
  origin: string;
  certified: boolean;
  inStock: boolean;
  premium: boolean;
  luxury: boolean;
}

// API functions for gemstone management
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get image URL
const getImageUrl = (ratna: Gemstone): string => {
  if (!ratna || !ratna.image) return '';
  
  // If it's already a full URL, return as is
  if (ratna.image.startsWith('http://') || ratna.image.startsWith('https://')) {
    return ratna.image;
  }
  
  // If it starts with /, it's a relative path
  if (ratna.image.startsWith('/')) {
    return `${API_BASE_URL}${ratna.image}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `${API_BASE_URL}/uploads/${ratna.image}`;
};

const createGemstone = async (data: FormData) => {
  const formData = new FormData();
  
  // Add all text fields
  formData.append('name', data.name);
  formData.append('englishName', data.englishName);
  formData.append('hindiName', data.hindiName);
  formData.append('category', data.category);
  formData.append('planet', data.planet);
  formData.append('planetEmoji', data.planetEmoji);
  formData.append('planetHindi', data.planetHindi);
  formData.append('price', data.price);
  formData.append('originalPrice', data.originalPrice);
  formData.append('description', data.description);
  formData.append('benefits', JSON.stringify(data.benefits));
  formData.append('jaap', data.jaap);
  formData.append('brahmins', data.brahmins);
  formData.append('weight', data.weight);
  formData.append('origin', data.origin);
  formData.append('certified', data.certified.toString());
  formData.append('inStock', data.inStock.toString());
  formData.append('premium', data.premium.toString());
  formData.append('luxury', data.luxury.toString());
  
  // Add image file if exists
  if (data.image) {
    formData.append('image', data.image);
  }
  
  console.log('Sending form data to:', `${API_BASE_URL}/api/gemstones/create`);
  console.log('Form data entries:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
  const response = await fetch(`${API_BASE_URL}/api/gemstones/create`, {
    method: 'POST',
    body: formData
  });
  
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  
  const responseData = await response.json();
  console.log('Response data:', responseData);
  
  return responseData;
};

const getAllGemstones = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/api/gemstones/admin/all?${params}`);
  return response.json();
};

const updateGemstone = async (id: string, data: Partial<FormData>) => {
  const formData = new FormData();
  
  // Add all text fields
  if (data.name) formData.append('name', data.name);
  if (data.englishName) formData.append('englishName', data.englishName);
  if (data.hindiName) formData.append('hindiName', data.hindiName);
  if (data.category) formData.append('category', data.category);
  if (data.planet) formData.append('planet', data.planet);
  if (data.planetEmoji) formData.append('planetEmoji', data.planetEmoji);
  if (data.planetHindi) formData.append('planetHindi', data.planetHindi);
  if (data.price) formData.append('price', data.price);
  if (data.originalPrice) formData.append('originalPrice', data.originalPrice);
  if (data.description) formData.append('description', data.description);
  if (data.benefits) formData.append('benefits', JSON.stringify(data.benefits));
  if (data.jaap) formData.append('jaap', data.jaap);
  if (data.brahmins) formData.append('brahmins', data.brahmins);
  if (data.weight) formData.append('weight', data.weight);
  if (data.origin) formData.append('origin', data.origin);
  if (data.certified !== undefined) formData.append('certified', data.certified.toString());
  if (data.inStock !== undefined) formData.append('inStock', data.inStock.toString());
  if (data.premium !== undefined) formData.append('premium', data.premium.toString());
  if (data.luxury !== undefined) formData.append('luxury', data.luxury.toString());
  
  // Add image file if exists
  if (data.image) {
    formData.append('image', data.image);
  }
  
  console.log('Updating gemstone:', id);
  console.log('Update form data entries:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
  const response = await fetch(`${API_BASE_URL}/api/gemstones/${id}`, {
    method: 'PUT',
    body: formData
  });
  
  console.log('Update response status:', response.status);
  const responseData = await response.json();
  console.log('Update response data:', responseData);
  
  return responseData;
};

const deleteGemstone = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/gemstones/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export default function RatnaManagement() {
  const [ratnas, setRatnas] = useState<Gemstone[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRatna, setSelectedRatna] = useState<Gemstone | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    englishName: '',
    hindiName: '',
    category: '',
    planet: '',
    planetEmoji: '',
    planetHindi: '',
    price: '',
    originalPrice: '',
    image: null,
    description: '',
    benefits: [],
    jaap: '',
    brahmins: '',
    weight: '',
    origin: '',
    certified: false,
    inStock: true,
    premium: false,
    luxury: false
  });

  // Fetch gemstones on component mount
  useEffect(() => {
    fetchGemstones();
  }, []);

  const fetchGemstones = async () => {
    try {
      setLoading(true);
      console.log('Fetching gemstones from:', `${API_BASE_URL}/api/gemstones/admin/all`);
      
      const response = await fetch(`${API_BASE_URL}/api/gemstones/admin/all`);
      console.log('Raw Response:', response);
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response Data:', data);
      
      // Handle different response formats
      if (data.success) {
        setRatnas(data.gemstones || data.data || []);
      } else if (data.gemstones) {
        setRatnas(data.gemstones);
      } else if (data.data) {
        setRatnas(data.data);
      } else if (Array.isArray(data)) {
        setRatnas(data);
      } else {
        setError(data.message || 'Failed to fetch gemstones');
      }
    } catch (err: any) {
      console.error('Error:', err);
      // If it's a network error (API not available), show a helpful message
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError(`Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend is running.`);
      } else {
        setError(`Error fetching gemstones: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => {
    setShowAddForm(false);
    setError(null);
    setSuccessMessage(null);
    // Reset form data when closing
    setFormData({
      name: '',
      englishName: '',
      hindiName: '',
      category: '',
      planet: '',
      planetEmoji: '',
      planetHindi: '',
      price: '',
      originalPrice: '',
      image: null,
      description: '',
      benefits: [],
      jaap: '',
      brahmins: '',
      weight: '',
      origin: '',
      certified: false,
      inStock: true,
      premium: false,
      luxury: false
    });
  };

  const handleView = (ratna: Gemstone) => {
    setSelectedRatna(ratna);
    setShowViewModal(true);
  };

  const handleEdit = (ratna: Gemstone) => {
    setSelectedRatna(ratna);
    // Populate form with existing data
    setFormData({
      name: ratna.name,
      englishName: ratna.englishName,
      hindiName: ratna.hindiName,
      category: ratna.category,
      planet: ratna.planet,
      planetEmoji: ratna.planetEmoji,
      planetHindi: ratna.planetHindi,
      price: ratna.price.toString(),
      originalPrice: ratna.originalPrice.toString(),
      image: null, // We'll handle image separately
      description: ratna.description,
      benefits: ratna.benefits,
      jaap: ratna.jaap,
      brahmins: ratna.brahmins,
      weight: ratna.weight,
      origin: ratna.origin,
      certified: ratna.certified,
      inStock: ratna.inStock,
      premium: ratna.premium,
      luxury: ratna.luxury
    });
    setShowEditModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedRatna(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedRatna(null);
    closeForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading state
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    
    try {
      let response;
      
      if (showEditModal && selectedRatna) {
        // Update existing ratna
        response = await updateGemstone(selectedRatna._id, formData);
        console.log('Update response:', response);
      } else {
        // Create new ratna
        response = await createGemstone(formData);
        console.log('Create response:', response);
      }
      
      // Check if response indicates success (handle different response formats)
      const isSuccess = response.success || response.status === 'success' || response.message === 'success' || 
                       (response.gemstone && response.gemstone._id) || 
                       (response.data && response.data._id) ||
                       response._id;
      
      if (isSuccess) {
        // Close form and show success message
        const action = showEditModal ? 'updated' : 'created';
        setShowAddForm(false);
        setShowEditModal(false);
        setSelectedRatna(null);
        setSuccessMessage(`Ratna ${action} successfully!`);
        
        // Reset form data
        setFormData({
          name: '',
          englishName: '',
          hindiName: '',
          category: '',
          planet: '',
          planetEmoji: '',
          planetHindi: '',
          price: '',
          originalPrice: '',
          image: null,
          description: '',
          benefits: [],
          jaap: '',
          brahmins: '',
          weight: '',
          origin: '',
          certified: false,
          inStock: true,
          premium: false,
          luxury: false
        });
        
        // Refresh the list
        fetchGemstones();
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.message || response.error || `Failed to ${showEditModal ? 'update' : 'create'} gemstone`);
      }
    } catch (err) {
      console.error(`Error ${showEditModal ? 'updating' : 'creating'} gemstone:`, err);
      setError(`Error ${showEditModal ? 'updating' : 'creating'} gemstone. Please try again.`);
      
      // Force close form after error (optional - remove if you want form to stay open on error)
      setTimeout(() => {
        setShowAddForm(false);
        setShowEditModal(false);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gemstone?')) {
      try {
        const response = await deleteGemstone(id);
        if (response.success) {
          fetchGemstones(); // Refresh the list
        } else {
          setError(response.message || 'Failed to delete gemstone');
        }
      } catch (err) {
        setError('Error deleting gemstone');
        console.error('Error:', err);
      }
    }
  };

  const filteredRatnas = ratnas.filter(ratna => { 
    const matchesSearch = ratna.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ratna.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ratna.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["precious", "semi-precious", "organic", "other"];

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ratna Management</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage gemstone and crystal services</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={fetchGemstones} className="w-full sm:w-auto">
            🔄 Refresh
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Ratna
          </Button>
        </div>
      </div>

    

      {/* Success Message Display */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 text-lg mr-2">✅</div>
            <div>
              <h3 className="text-green-800 font-medium">Success!</h3>
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 text-lg mr-2">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Ratnas</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-xl sm:text-2xl font-bold">{ratnas.length}</div>
          </CardContent>
        </Card>
        <Card className="p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Ratnas</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-xl sm:text-2xl font-bold">{ratnas.filter(r => r.isActive).length}</div>
          </CardContent>
        </Card>
        <Card className="p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-xs sm:text-sm font-medium">In Stock</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-xl sm:text-2xl font-bold">{ratnas.filter(r => r.inStock).length}</div>
          </CardContent>
        </Card>
        <Card className="p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Premium</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-xl sm:text-2xl font-bold">{ratnas.filter(r => r.premium).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ratnas by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratnas List */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Ratnas ({filteredRatnas.length})</CardTitle>
          <CardDescription className="text-sm">Manage your gemstone and crystal services</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-8 px-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">Loading gemstones...</p>
            </div>
          ) : filteredRatnas.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-gray-400 text-3xl sm:text-4xl mb-2">💎</div>
              <p className="text-gray-600 text-sm sm:text-base">No gemstones found</p>
              <p className="text-gray-500 text-xs sm:text-sm">Add your first gemstone to get started</p>
            </div>
          ) : (
                        <div className="space-y-4">
              {filteredRatnas.map((ratna) => (
                <div key={ratna._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {ratna.image ? (
                        <img 
                          src={getImageUrl(ratna)} 
                          alt={ratna.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.nextElementSibling?.classList.add('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center ${ratna.image ? 'hidden' : ''}`}>
                        <Gem className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{ratna.name}</h3>
                      <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{ratna.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant={ratna.isActive ? 'default' : 'secondary'} className="text-xs">
                          {ratna.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{ratna.category}</Badge>
                        <Badge variant="outline" className="text-xs">{ratna.planet}</Badge>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <Scale className="w-3 h-3" />
                          {ratna.weight}
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <Zap className="w-3 h-3" />
                          {ratna.origin}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-lg">₹{ratna.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Stock: {ratna.inStock ? 'Available' : 'Out of Stock'}</p>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {ratna.certified && <Badge variant="outline" className="text-xs">Certified</Badge>}
                        {ratna.premium && <Badge variant="outline" className="text-xs">Premium</Badge>}
                        {ratna.luxury && <Badge variant="outline" className="text-xs">Luxury</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(ratna)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(ratna)}
                        title="Edit Ratna"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(ratna._id)} 
                        className="h-8 w-8 p-0"
                        title="Delete Ratna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Ratna Form Modal */}
      {showAddForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeForm}
        >
          <Card 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Add New Ratna</CardTitle>
                  <CardDescription className="text-sm">Enter ratna details to add to your services</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-700 self-end"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
                             <form onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Name</label>
                     <Input 
                       placeholder="e.g., Ruby (Manik)" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       required
                     />
                   </div>
                   <div>
                     <label className="text-sm font-medium">English Name</label>
                     <Input 
                       placeholder="e.g., Ruby" 
                       value={formData.englishName}
                       onChange={(e) => setFormData({...formData, englishName: e.target.value})}
                       required
                     />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Hindi Name</label>
                     <Input 
                       placeholder="e.g., माणिक" 
                       value={formData.hindiName}
                       onChange={(e) => setFormData({...formData, hindiName: e.target.value})}
                       required
                     />
                   </div>
                   <div>
                     <label className="text-sm font-medium">Category</label>
                     <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Planet</label>
                     <Input 
                       placeholder="e.g., Sun" 
                       value={formData.planet}
                       onChange={(e) => setFormData({...formData, planet: e.target.value})}
                       required
                     />
                   </div>
                                        <div>
                       <label className="text-sm font-medium">Planet Emoji</label>
                       <Input 
                         placeholder="e.g., ☀️" 
                         value={formData.planetEmoji}
                         onChange={(e) => setFormData({...formData, planetEmoji: e.target.value})}
                         required
                       />
                     </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Planet Hindi</label>
                     <Input 
                       placeholder="e.g., सूर्य" 
                       value={formData.planetHindi}
                       onChange={(e) => setFormData({...formData, planetHindi: e.target.value})}
                       required
                     />
                   </div>
                   <div>
                     <label className="text-sm font-medium">Price (₹)</label>
                     <Input 
                       placeholder="0" 
                       type="number" 
                       value={formData.price}
                       onChange={(e) => setFormData({...formData, price: e.target.value})}
                       required
                     />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Original Price (₹)</label>
                     <Input 
                       placeholder="0" 
                       type="number" 
                       value={formData.originalPrice}
                       onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                       required
                     />
                   </div>
                   <div>
                     <label className="text-sm font-medium">Image Upload</label>
                     <Input 
                       type="file"
                       accept="image/*"
                       onChange={(e) => {
                         const file = e.target.files?.[0] || null;
                         setFormData({...formData, image: file});
                       }}
                       required
                     />
                     {formData.image && (
                       <p className="text-xs text-gray-500 mt-1">
                         Selected: {formData.image.name}
                       </p>
                     )}
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Weight</label>
                     <Input 
                       placeholder="e.g., 2.5 carats" 
                       value={formData.weight}
                       onChange={(e) => setFormData({...formData, weight: e.target.value})}
                       required
                     />
                   </div>
                   <div>
                     <label className="text-sm font-medium">Origin</label>
                     <Input 
                       placeholder="e.g., Burma, Kashmir" 
                       value={formData.origin}
                       onChange={(e) => setFormData({...formData, origin: e.target.value})}
                       required
                     />
                   </div>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Description</label>
                   <Textarea 
                     placeholder="Detailed description of the ratna..." 
                     rows={3} 
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     required
                   />
                 </div>
                 <div>
                   <label className="text-sm font-medium">Benefits (comma separated)</label>
                   <Input 
                     placeholder="Career growth, leadership, father's health" 
                     value={formData.benefits.join(', ')}
                     onChange={(e) => setFormData({...formData, benefits: e.target.value.split(',').map(b => b.trim())})}
                     required
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Jaap Details</label>
                     <Input 
                       placeholder="Jaap instructions..." 
                       value={formData.jaap}
                       onChange={(e) => setFormData({...formData, jaap: e.target.value})}
                       required
                     />
                   </div>
                   <div>
                     <label className="text-sm font-medium">Brahmins Details</label>
                     <Input 
                       placeholder="Brahmins information..." 
                       value={formData.brahmins}
                       onChange={(e) => setFormData({...formData, brahmins: e.target.value})}
                       required
                     />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center space-x-2">
                     <Switch 
                       id="certified" 
                       checked={formData.certified}
                       onCheckedChange={(checked) => setFormData({...formData, certified: checked})}
                     />
                     <label htmlFor="certified" className="text-sm font-medium">Certified</label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Switch 
                       id="inStock" 
                       checked={formData.inStock}
                       onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
                     />
                     <label htmlFor="inStock" className="text-sm font-medium">In Stock</label>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center space-x-2">
                     <Switch 
                       id="premium" 
                       checked={formData.premium}
                       onCheckedChange={(checked) => setFormData({...formData, premium: checked})}
                     />
                     <label htmlFor="premium" className="text-sm font-medium">Premium</label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Switch 
                       id="luxury" 
                       checked={formData.luxury}
                       onCheckedChange={(checked) => setFormData({...formData, luxury: checked})}
                     />
                     <label htmlFor="luxury" className="text-sm font-medium">Luxury</label>
                   </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                   <Button type="button" variant="outline" onClick={closeForm} disabled={submitting}>
                     Cancel
                   </Button>
                   <Button type="submit" disabled={submitting}>
                     {submitting ? (
                       <>
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                         Adding...
                       </>
                     ) : (
                       'Add Ratna'
                     )}
                   </Button>
                 </div>
               </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Ratna Modal */}
      {showViewModal && selectedRatna && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeViewModal}
        >
          <Card 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">View Ratna Details</CardTitle>
                  <CardDescription className="text-sm">{selectedRatna.name}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeViewModal}
                  className="text-gray-500 hover:text-gray-700 self-end"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 space-y-6">
              {/* Image Display */}
              {selectedRatna.image && (
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg overflow-hidden">
                    <img 
                      src={getImageUrl(selectedRatna)} 
                      alt={selectedRatna.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('opacity-0', 'pointer-events-none');
                        target.nextElementSibling?.classList.add('opacity-100');
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center opacity-0 pointer-events-none">
                      <Gem className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-base font-medium">{selectedRatna.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">English Name</label>
                  <p className="text-base">{selectedRatna.englishName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Hindi Name</label>
                  <p className="text-base">{selectedRatna.hindiName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-base">{selectedRatna.category}</p>
                </div>
              </div>

              {/* Planet Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Planet</label>
                  <p className="text-base">{selectedRatna.planet}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Planet Emoji</label>
                  <p className="text-base">{selectedRatna.planetEmoji}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Planet Hindi</label>
                  <p className="text-base">{selectedRatna.planetHindi}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Weight</label>
                  <p className="text-base">{selectedRatna.weight}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-lg font-bold text-green-600">₹{selectedRatna.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Original Price</label>
                  <p className="text-base text-gray-600">₹{selectedRatna.originalPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-base">{selectedRatna.description}</p>
              </div>

              {/* Benefits */}
              <div>
                <label className="text-sm font-medium text-gray-500">Benefits</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRatna.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Origin</label>
                  <p className="text-base">{selectedRatna.origin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Jaap Details</label>
                  <p className="text-base">{selectedRatna.jaap}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Brahmins Details</label>
                  <p className="text-base">{selectedRatna.brahmins}</p>
                </div>
              </div>

              {/* Status Badges */}
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant={selectedRatna.isActive ? 'default' : 'secondary'}>
                    {selectedRatna.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant={selectedRatna.inStock ? 'default' : 'secondary'}>
                    {selectedRatna.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  {selectedRatna.certified && <Badge variant="outline">Certified</Badge>}
                  {selectedRatna.premium && <Badge variant="outline">Premium</Badge>}
                  {selectedRatna.luxury && <Badge variant="outline">Luxury</Badge>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={closeViewModal}>
                  Close
                </Button>
                <Button onClick={() => {
                  closeViewModal();
                  handleEdit(selectedRatna);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Ratna
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Ratna Modal */}
      {showEditModal && selectedRatna && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeEditModal}
        >
          <Card 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Edit Ratna</CardTitle>
                  <CardDescription className="text-sm">Update details for {selectedRatna.name}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 self-end"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                      placeholder="e.g., Ruby (Manik)" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">English Name</label>
                    <Input 
                      placeholder="e.g., Ruby" 
                      value={formData.englishName}
                      onChange={(e) => setFormData({...formData, englishName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Hindi Name</label>
                    <Input 
                      placeholder="e.g., माणिक" 
                      value={formData.hindiName}
                      onChange={(e) => setFormData({...formData, hindiName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Planet</label>
                    <Input 
                      placeholder="e.g., Sun" 
                      value={formData.planet}
                      onChange={(e) => setFormData({...formData, planet: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Planet Emoji</label>
                    <Input 
                      placeholder="e.g., ☀️" 
                      value={formData.planetEmoji}
                      onChange={(e) => setFormData({...formData, planetEmoji: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Planet Hindi</label>
                    <Input 
                      placeholder="e.g., सूर्य" 
                      value={formData.planetHindi}
                      onChange={(e) => setFormData({...formData, planetHindi: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price (₹)</label>
                    <Input 
                      placeholder="0" 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Original Price (₹)</label>
                    <Input 
                      placeholder="0" 
                      type="number" 
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Image Upload</label>
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({...formData, image: file});
                      }}
                    />
                    {formData.image && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {formData.image.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Weight</label>
                    <Input 
                      placeholder="e.g., 2.5 carats" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Origin</label>
                    <Input 
                      placeholder="e.g., Burma, Kashmir" 
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Detailed description of the ratna..." 
                    rows={3} 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Benefits (comma separated)</label>
                  <Input 
                    placeholder="Career growth, leadership, father's health" 
                    value={formData.benefits.join(', ')}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value.split(',').map(b => b.trim())})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Jaap Details</label>
                    <Input 
                      placeholder="Jaap instructions..." 
                      value={formData.jaap}
                      onChange={(e) => setFormData({...formData, jaap: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Brahmins Details</label>
                    <Input 
                      placeholder="Brahmins information..." 
                      value={formData.brahmins}
                      onChange={(e) => setFormData({...formData, brahmins: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="certified" 
                      checked={formData.certified}
                      onCheckedChange={(checked) => setFormData({...formData, certified: checked})}
                    />
                    <label htmlFor="certified" className="text-sm font-medium">Certified</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="inStock" 
                      checked={formData.inStock}
                      onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
                    />
                    <label htmlFor="inStock" className="text-sm font-medium">In Stock</label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="premium" 
                      checked={formData.premium}
                      onCheckedChange={(checked) => setFormData({...formData, premium: checked})}
                    />
                    <label htmlFor="premium" className="text-sm font-medium">Premium</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="luxury" 
                      checked={formData.luxury}
                      onCheckedChange={(checked) => setFormData({...formData, luxury: checked})}
                    />
                    <label htmlFor="luxury" className="text-sm font-medium">Luxury</label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={closeEditModal} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Ratna
                      </>
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

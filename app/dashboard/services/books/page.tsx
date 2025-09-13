"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal
} from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BOOKS_API_URL = `${API_BASE_URL}`;
console.log(BOOKS_API_URL);

// Book interface
interface Book {
  id: string;
  name: string;
  englishName: string;
  category: string;
  language: string;
  author: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image?: string;
  imageUrl?: string;
  coverImage?: string;
  description: string;
  pages: number;
  format: "pdf";
  bestseller: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Form data interface
interface BookFormData {
  name: string;
  englishName: string;
  category: string;
  language: string;
  author: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: File | null;
  description: string;
  pages: number;
  format: "pdf";
  bestseller: boolean;
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    englishName: '',
    category: '',
    language: '',
    author: '',
    price: 0,
    originalPrice: 0,
    rating: 0,
    reviews: 0,
    image: null,
    description: '',
    pages: 0,
    format: 'pdf',
    bestseller: false
  });

  const categories = ["predictive", "remedial", "classical", "modern", "healing", "gemstone", "yoga", "meditation", "other"];
  const languages = ["hindi", "english", "sanskrit", "urdu", "other"];
  const formats = ["pdf"];

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/books/public`);
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        // Ensure data is an array, handle different response formats
        if (Array.isArray(data)) {
          setBooks(data);
        } else if (data && Array.isArray(data.books)) {
          setBooks(data.books);
        } else if (data && Array.isArray(data.data)) {
          setBooks(data.data);
        } else {
          console.warn('Unexpected data format:', data);
          setBooks([]);
        }
      } else {
        console.error('Failed to fetch books');
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new book
  const createBook = async (bookData: BookFormData) => {
    try {
      const formData = new FormData();
      
      // Add all text fields
      formData.append('name', bookData.name);
      formData.append('englishName', bookData.englishName);
      formData.append('category', bookData.category);
      formData.append('language', bookData.language);
      formData.append('author', bookData.author);
      formData.append('price', bookData.price.toString());
      formData.append('originalPrice', bookData.originalPrice.toString());
      formData.append('rating', bookData.rating.toString());
      formData.append('reviews', bookData.reviews.toString());
      formData.append('description', bookData.description);
      formData.append('pages', bookData.pages.toString());
      formData.append('format', bookData.format);
      formData.append('bestseller', bookData.bestseller.toString());
      
      // Add image file if exists
      if (bookData.image) {
        formData.append('image', bookData.image);
      }
      
      const response = await fetch(`${BOOKS_API_URL}/api/books/create`, {
        method: 'POST',
        body: formData, // Don't set Content-Type header for FormData
      });
      
      if (response.ok) {
        const newBook = await response.json();
        setBooks(prev => [...prev, newBook]);
        setShowAddForm(false);
        resetForm();
        return true;
      } else {
        console.error('Failed to create book');
        return false;
      }
    } catch (error) {
      console.error('Error creating book:', error);
      return false;
    }
  };

  // Update book
  const updateBook = async (bookId: string, bookData: BookFormData) => {
    try {
      const formData = new FormData();
      
      // Add all text fields
      formData.append('name', bookData.name);
      formData.append('englishName', bookData.englishName);
      formData.append('category', bookData.category);
      formData.append('language', bookData.language);
      formData.append('author', bookData.author);
      formData.append('price', bookData.price.toString());
      formData.append('originalPrice', bookData.originalPrice.toString());
      formData.append('rating', bookData.rating.toString());
      formData.append('reviews', bookData.reviews.toString());
      formData.append('description', bookData.description);
      formData.append('pages', bookData.pages.toString());
      formData.append('format', bookData.format);
      formData.append('bestseller', bookData.bestseller.toString());
      
      // Add image file if exists
      if (bookData.image) {
        formData.append('image', bookData.image);
      }
      
      const response = await fetch(`${BOOKS_API_URL}/api/${bookId}`, {
        method: 'PUT',
        body: formData, // Don't set Content-Type header for FormData
      });
      
      if (response.ok) {
        const updatedBook = await response.json();
        setBooks(prev => prev.map(book => 
          book.id === bookId ? updatedBook : book
        ));
        setIsEditing(false);
        setEditingBookId(null);
        resetForm();
        return true;
      } else {
        console.error('Failed to update book');
        return false;
      }
    } catch (error) {
      console.error('Error updating book:', error);
      return false;
    }
  };

  // Delete book
  const deleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const response = await fetch(`${BOOKS_API_URL}/api/${bookId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setBooks(prev => prev.filter(book => book.id !== bookId));
      } else {
        console.error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Toggle book status
  const toggleBookStatus = async (bookId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'true' ? false : true;
      const response = await fetch(`${BOOKS_API_URL}/api/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus }),
      });
      
      if (response.ok) {
        setBooks(prev => prev.map(book => 
          book.id === bookId ? { ...book, isActive: newStatus } : book
        ));
      } else {
        console.error('Failed to update book status');
      }
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      englishName: '',
      category: '',
      language: '',
      author: '',
      price: 0,
      originalPrice: 0,
      rating: 0,
      reviews: 0,
      image: null,
      description: '',
      pages: 0,
      format: 'pdf',
      bestseller: false
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingBookId) {
      await updateBook(editingBookId, formData);
    } else {
      await createBook(formData);
    }
  };

  // Handle edit book
  const handleEdit = (book: Book) => {
    setFormData({
      name: book.name,
      englishName: book.englishName,
      category: book.category,
      language: book.language,
      author: book.author,
      price: book.price,
      originalPrice: book.originalPrice,
      rating: book.rating,
      reviews: book.reviews,
      image: null, // Reset image when editing
      description: book.description,
      pages: book.pages,
      format: book.format,
      bestseller: book.bestseller
    });
    setIsEditing(true);
    setEditingBookId(book.id);
    setShowAddForm(true);
  };

  // Handle form input changes
  const handleInputChange = (field: keyof BookFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image file change
  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = (Array.isArray(books) ? books : []).filter(book => {
    // Safety check: ensure book has required properties
    if (!book || typeof book !== 'object') return false;
    
    const name = book.name || '';
    const author = book.author || '';
    const category = book.category || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-600 mt-2">Manage astrology and spiritual books</p>
        </div>
        <Button 
          onClick={() => {
            setIsEditing(false);
            setEditingBookId(null);
            resetForm();
            setShowAddForm(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
                  <CardContent>
          <div className="text-2xl font-bold">{Array.isArray(books) ? books.length : 0}</div>
        </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
                  <CardContent>
          <div className="text-2xl font-bold">{Array.isArray(books) ? books.filter(b => b.isActive).length : 0}</div>
        </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bestsellers</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
                  <CardContent>
          <div className="text-2xl font-bold">{Array.isArray(books) ? books.filter(b => b.bestseller).length : 0}</div>
        </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
                  <CardContent>
          <div className="text-2xl font-bold">{Array.isArray(books) ? (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1) : '0'}</div>
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
                  placeholder="Search books by title or author..."
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

      {/* Books List */}
      <Card>
        <CardHeader>
          <CardTitle>Books ({filteredBooks.length})</CardTitle>
          <CardDescription>Manage your book inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No books found</div>
          ) : (
                         <div className="space-y-4">
               {filteredBooks.map((book) => {
                 // Safety check: ensure book has required properties
                 if (!book || typeof book !== 'object') return null;
                 
                 const name = book.name || 'Untitled';
                 const author = book.author || 'Unknown Author';
                 const category = book.category || 'Uncategorized';
                 const isActive = book.isActive !== undefined ? book.isActive : true;
                 const price = book.price || 0;
                 const originalPrice = book.originalPrice || 0;
                 const rating = book.rating || 0;
                 const reviews = book.reviews || 0;
                 const format = book.format || 'Unknown';
                 const bookId = book.id || 'unknown';
                 const image = book.image || book.imageUrl || book.coverImage || '';
                 
                 // Debug log to see what's in the book object
                //  console.log('Book data:', book);
                //  console.log('Image URL:', image);
                 
                 return (
                                       <div key={bookId} className="border rounded-lg hover:bg-gray-50 overflow-hidden">
                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                                                     <div className="w-12 h-16 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                             {image ? (
                               <img 
                                 src={image} 
                                 alt={name}
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
                             <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${image ? 'hidden' : ''}`}>
                               <BookOpen className="w-6 h-6 text-white" />
                             </div>
                           </div>
                                                     <div className="min-w-0 flex-1">
                             <h3 className="font-semibold text-lg truncate">{name}</h3>
                             <p className="text-gray-600 truncate">by {author}</p>
                             <div className="flex items-center gap-2 mt-1 flex-wrap">
                               <Badge 
                                 variant={isActive ? 'default' : 'secondary'}
                                 className="cursor-pointer flex-shrink-0"
                                 onClick={() => toggleBookStatus(bookId, isActive.toString())}
                               >
                                 {isActive ? 'Active' : 'Inactive'}
                               </Badge>
                               <Badge variant="outline" className="flex-shrink-0">{category}</Badge>
                               <span className="text-sm text-gray-500 truncate">Format: {format}</span>
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center gap-4 flex-shrink-0">
                           <div className="text-right">
                             <p className="font-semibold">₹{price}</p>
                             <p className="text-sm text-gray-500">Original: ₹{originalPrice}</p>
                             <p className="text-sm text-gray-500">Rating: {rating}/5 ({reviews} reviews)</p>
                           </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(book)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteBook(bookId)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden p-4">
                        <div className="flex items-start gap-3">
                                                     <div className="w-10 h-12 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                             {image ? (
                               <img 
                                 src={image} 
                                 alt={name}
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
                             <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${image ? 'hidden' : ''}`}>
                               <BookOpen className="w-5 h-5 text-white" />
                             </div>
                           </div>
                                                     <div className="min-w-0 flex-1">
                             <h3 className="font-semibold text-base truncate">{name}</h3>
                             <p className="text-gray-600 text-sm truncate">by {author}</p>
                             <div className="flex items-center gap-2 mt-2 flex-wrap">
                               <Badge 
                                 variant={isActive ? 'default' : 'secondary'}
                                 className="cursor-pointer text-xs"
                                 onClick={() => toggleBookStatus(bookId, isActive.toString())}
                               >
                                 {isActive ? 'Active' : 'Inactive'}
                               </Badge>
                               <Badge variant="outline" className="text-xs">{category}</Badge>
                             </div>
                             <div className="flex items-center justify-between mt-3">
                               <div className="text-sm">
                                 <p className="font-semibold">₹{price}</p>
                                 <p className="text-gray-500">Original: ₹{originalPrice}</p>
                                 <p className="text-gray-500 text-xs">Rating: {rating}/5</p>
                               </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(book)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => deleteBook(bookId)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                 );
               })}
             </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Book Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Update book details' : 'Enter book details to add to your inventory'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Book Name</label>
                    <Input 
                      placeholder="Book name" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">English Name</label>
                    <Input 
                      placeholder="English name" 
                      value={formData.englishName}
                      onChange={(e) => handleInputChange('englishName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Author</label>
                    <Input 
                      placeholder="Author name" 
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Language</label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(language => (
                          <SelectItem key={language} value={language}>{language}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Format</label>
                    <Input 
                      value="PDF" 
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">All books are in PDF format</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price (₹)</label>
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
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Rating</label>
                    <Input 
                      placeholder="0" 
                      type="number" 
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', Number(e.target.value))}
                    />
                  </div>
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Pages</label>
                    <Input 
                      placeholder="0" 
                      type="number" 
                      min="1"
                      value={formData.pages}
                      onChange={(e) => handleInputChange('pages', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium">Book Image</Label>
                    <Input 
                      id="image"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                      required={!isEditing}
                    />
                    {formData.image && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {formData.image.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="bestseller"
                    checked={formData.bestseller}
                    onChange={(e) => handleInputChange('bestseller', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="bestseller" className="text-sm font-medium">
                    Mark as Bestseller
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Book description..." 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setIsEditing(false);
                      setEditingBookId(null);
                      resetForm();
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {isEditing ? 'Update Book' : 'Add Book'}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Award, 
  TrendingUp,
  BarChart3,
  Activity,
  Globe,
  Mail,
  BookOpen,
  Flame,
  Gem,
  CircleDot,
  Brain,
  Star,
  Calendar,
  MessageSquare,
  Settings,
  Crown,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { fetchGallery } from '@/lib/redux/features/gallerySlice';
import { fetchLeads } from '@/lib/redux/features/leadSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: galleryItems, loading: galleryLoading } = useSelector((state: RootState) => state.gallery);
  const { leads, loading: leadsLoading } = useSelector((state: RootState) => state.leads);
  
  const [blogCount, setBlogCount] = useState(0);
  const [kundliLeadsCount, setKundliLeadsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch gallery and leads from Redux
        dispatch(fetchGallery() as any);
        dispatch(fetchLeads() as any);
        
        // Fetch blog count
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const blogResponse = await fetch(`${apiUrl}/api/blogs`);
          if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            const blogs = blogData.blogs || blogData || [];
            setBlogCount(Array.isArray(blogs) ? blogs.length : 0);
          }
        } catch (error) {
          console.error('Error fetching blog count:', error);
        }
        
        // Fetch kundli leads count
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const kundliResponse = await fetch(`${apiUrl}/api/kundli-lead`);
          if (kundliResponse.ok) {
            const kundliData = await kundliResponse.json();
            const kundliLeads = kundliData.data || kundliData || [];
            setKundliLeadsCount(Array.isArray(kundliLeads) ? kundliLeads.length : 0);
          }
        } catch (error) {
          console.error('Error fetching kundli leads count:', error);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Calculate statistics
  const totalGalleryItems = Array.isArray(galleryItems) ? galleryItems.length : 0;
  const totalLeads = Array.isArray(leads) ? leads.length : 0;
  const totalServices = 60; // Static count for services

  // Get recent activity data
  const recentLeads = Array.isArray(leads) ? leads.slice(0, 3) : [];
  const recentGalleryItems = Array.isArray(galleryItems) ? galleryItems.slice(0, 2) : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Lok Dashboard
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-lg p-6 text-white mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
        <p className="text-lg opacity-90">
          Welcome! Have a blessed day
        </p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link href="/dashboard/services" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Services</h3>
                <p className="text-3xl font-bold text-blue-600">{totalServices}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/dashboard/gallery" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gallery Items</h3>
                <p className="text-3xl font-bold text-green-600">{totalGalleryItems}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/dashboard/leads" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Leads</h3>
                <p className="text-3xl font-bold text-orange-600">{totalLeads}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/dashboard/blog" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Posts</h3>
                <p className="text-3xl font-bold text-purple-600">{blogCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link href="/dashboard/kundli-lead" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Kundli Leads</h3>
                <p className="text-3xl font-bold text-indigo-600">{kundliLeadsCount}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Views</h3>
              <p className="text-3xl font-bold text-cyan-600">
                {Array.isArray(galleryItems) ? galleryItems.reduce((sum, item) => sum + (item.views || 0), 0) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Likes</h3>
              <p className="text-3xl font-bold text-pink-600">
                {Array.isArray(galleryItems) ? galleryItems.reduce((sum, item) => sum + (item.likes || 0), 0) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Leads</h3>
              <p className="text-3xl font-bold text-emerald-600">
                {Array.isArray(leads) ? leads.filter(lead => lead.status === 'new' || lead.status === 'contacted').length : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/services/books" className="block">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Books</p>
                <p className="text-sm text-gray-600">Manage Books</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/services/pujas" className="block">
            <div className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Pujas</p>
                <p className="text-sm text-gray-600">Manage Pujas</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/services/ratna" className="block">
            <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ratna</p>
                <p className="text-sm text-gray-600">Manage Gemstones</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/services/rudraksha" className="block">
            <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <CircleDot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Rudraksha</p>
                <p className="text-sm text-gray-600">Manage Rudraksha</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/services/sadhana" className="block">
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Sadhana</p>
                <p className="text-sm text-gray-600">Manage Sadhana</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/services/yantra" className="block">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Yantra</p>
                <p className="text-sm text-gray-600">Manage Yantras</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/services" className="block">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Manage Services</div>
            </button>
          </Link>
          
          <Link href="/dashboard/gallery" className="block">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Gallery</div>
            </button>
          </Link>
          
          <Link href="/dashboard/leads" className="block">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Contact Leads</div>
            </button>
          </Link>
          
          <Link href="/dashboard/blog" className="block">
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Blog Posts</div>
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentLeads.length > 0 && recentLeads.map((lead, index) => (
            <div key={lead._id || index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <MessageSquare className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New contact lead received</p>
                <p className="text-xs text-gray-600">
                  {lead.subject} from {lead.name} - {new Date(lead.createdOn).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          
          {recentGalleryItems.length > 0 && recentGalleryItems.map((item, index) => (
            <div key={item._id || index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <ImageIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Gallery item added</p>
                <p className="text-xs text-gray-600">
                  {item.title} in {item.category} category - {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          ))}
          
          {recentLeads.length === 0 && recentGalleryItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No recent activity to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  
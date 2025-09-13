"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Crown,
  FileText,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface KundliLead {
  _id: string;
  name: string;
  date: string;
  time: string;
  place: string;
  gender: string;
  vipKundli: string;
  email?: string;
  mobile?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority?: string;
  isProcessed?: boolean;
  notes?: any[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export default function KundliLeadPage() {
  const { toast } = useToast();

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const [kundliLeads, setKundliLeads] = useState<KundliLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<KundliLead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    place: '',
    gender: '',
    vipKundli: 'VIP Kundli',
    email: '',
    mobile: '',
    status: 'pending' as KundliLead['status'],
    priority: 'medium',
    isProcessed: false,
    notes: '',
    assignedTo: ''
  });

  // API functions
  const fetchKundliLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/kundli-lead`);
      if (!response.ok) {
        throw new Error('Failed to fetch kundli leads');
      }
      const responseData = await response.json();
      // Extract data from the response structure
      const leadsArray = responseData.data && Array.isArray(responseData.data) ? responseData.data : [];
      setKundliLeads(leadsArray);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch kundli leads');
      // Set empty array on error to prevent filter errors
      setKundliLeads([]);
      toast({
        title: "Error",
        description: "Failed to fetch kundli leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKundliLeads();
  }, []);

  const handleAddLead = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/kundli-lead/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add kundli lead');
      }

      const newLead = await response.json();
      setKundliLeads(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [newLead, ...prevArray];
      });
      toast({
        title: "Success",
        description: "Kundli lead added successfully",
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add kundli lead",
        variant: "destructive",
      });
    }
  };

  const handleEditLead = async () => {
    if (!selectedLead) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/kundli-lead/${selectedLead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update kundli lead');
      }

      const updatedLead = await response.json();
      const updatedLeads = (Array.isArray(kundliLeads) ? kundliLeads : []).map(lead => 
        lead._id === selectedLead._id ? updatedLead : lead
      );
      
      setKundliLeads(updatedLeads);
      toast({
        title: "Success",
        description: "Kundli lead updated successfully",
      });
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update kundli lead",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/kundli-lead/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete kundli lead');
      }

      setKundliLeads(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter(lead => lead._id !== id);
      });
      toast({
        title: "Success",
        description: "Kundli lead deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete kundli lead",
        variant: "destructive",
      });
    }
  };

  const toggleProcessedStatus = async (lead: KundliLead) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/kundli-lead/${lead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...lead, isProcessed: !lead.isProcessed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update processed status');
      }

      const updatedLeads = (Array.isArray(kundliLeads) ? kundliLeads : []).map(l => 
        l._id === lead._id ? { ...l, isProcessed: !l.isProcessed } : l
      );
      setKundliLeads(updatedLeads);
      
      toast({
        title: "Success",
        description: `Lead marked as ${!lead.isProcessed ? 'processed' : 'unprocessed'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update processed status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      place: '',
      gender: '',
      vipKundli: 'VIP Kundli',
      email: '',
      mobile: '',
      status: 'pending',
      priority: 'medium',
      isProcessed: false,
      notes: '',
      assignedTo: ''
    });
    setSelectedLead(null);
  };

  const openEditDialog = (lead: KundliLead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      date: lead.date,
      time: lead.time,
      place: lead.place,
      gender: lead.gender,
      vipKundli: lead.vipKundli,
      email: lead.email || '',
      mobile: lead.mobile || '',
      status: lead.status,
      priority: lead.priority || 'medium',
      isProcessed: lead.isProcessed || false,
      notes: Array.isArray(lead.notes) ? lead.notes.join(', ') : (lead.notes || ''),
      assignedTo: lead.assignedTo || ''
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (lead: KundliLead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };

  const getStatusIcon = (status: KundliLead['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredLeads = (Array.isArray(kundliLeads) ? kundliLeads : []).filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading kundli leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kundli Leads Management</h1>
          <p className="text-gray-600 mt-1">Manage and track kundli generation requests</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchKundliLeads}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Kundli Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Kundli Lead</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date of Birth *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time of Birth *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="place">Place of Birth *</Label>
                  <Input
                    id="place"
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    placeholder="City, State, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vipKundli">Kundli Type</Label>
                  <Input
                    id="vipKundli"
                    value={formData.vipKundli}
                    onChange={(e) => setFormData({ ...formData, vipKundli: e.target.value })}
                    placeholder="VIP Kundli"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: KundliLead['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                                 <div>
                   <Label htmlFor="priority">Priority</Label>
                   <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                     <SelectTrigger>
                       <SelectValue placeholder="Select priority" />
                     </SelectTrigger>
                     <SelectContent>
                       {priorityOptions.map((priority) => (
                         <SelectItem key={priority.value} value={priority.value}>
                           {priority.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <Label htmlFor="assignedTo">Assigned To</Label>
                   <Input
                     id="assignedTo"
                     value={formData.assignedTo}
                     onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                     placeholder="Astrologer name"
                   />
                 </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLead}>Add Lead</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                                 <p className="text-2xl font-bold text-gray-900">
                   {Array.isArray(kundliLeads) ? kundliLeads.filter(l => l.status === 'pending').length : 0}
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                 <p className="text-2xl font-bold text-gray-900">
                   {Array.isArray(kundliLeads) ? kundliLeads.filter(l => l.status === 'in-progress').length : 0}
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                                 <p className="text-2xl font-bold text-gray-900">
                   {Array.isArray(kundliLeads) ? kundliLeads.filter(l => l.status === 'completed').length : 0}
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                                 <p className="text-2xl font-bold text-gray-900">
                   {Array.isArray(kundliLeads) ? kundliLeads.filter(l => l.status === 'cancelled').length : 0}
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                                 <p className="text-2xl font-bold text-gray-900">
                   {Array.isArray(kundliLeads) ? kundliLeads.length : 0}
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads by name, place, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Kundli Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                                 <TableRow>
                   <TableHead>Lead</TableHead>
                   <TableHead>Birth Details</TableHead>
                   <TableHead>Contact</TableHead>
                   <TableHead>Mobile</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Priority</TableHead>
                   <TableHead>Assigned To</TableHead>
                   <TableHead>Created</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.gender}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(lead.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {lead.time}
                        </div>
                        <div className="text-sm text-gray-600">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {lead.place}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {lead.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </div>
                        )}
                        {lead.mobile && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {lead.mobile}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {lead.mobile || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(lead.status)}
                        <Badge variant="secondary" className="capitalize">
                          {lead.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                                         <TableCell>
                       <Badge 
                         variant={lead.priority === 'high' ? 'destructive' : lead.priority === 'medium' ? 'default' : 'secondary'}
                         className="capitalize"
                       >
                         {lead.priority || 'Medium'}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <div className="text-sm text-gray-600">
                         {lead.assignedTo || 'Unassigned'}
                       </div>
                     </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(lead)}
                          className="h-8 px-2"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                                                 <Button
                           variant={lead.isProcessed ? "secondary" : "default"}
                           size="sm"
                           onClick={() => toggleProcessedStatus(lead)}
                           className="h-8 px-2"
                         >
                           {lead.isProcessed ? '✓ Processed' : '○ Unprocessed'}
                         </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewDialog(lead)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(lead)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Lead
                            </DropdownMenuItem>
                                                         <DropdownMenuItem onClick={() => toggleProcessedStatus(lead)}>
                               {lead.isProcessed ? 'Mark as Unprocessed' : 'Mark as Processed'}
                             </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteLead(lead._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Kundli Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="edit-date">Date of Birth *</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-time">Time of Birth *</Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-place">Place of Birth *</Label>
              <Input
                id="edit-place"
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                placeholder="City, State, Country"
              />
            </div>
            <div>
              <Label htmlFor="edit-gender">Gender *</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-vipKundli">Kundli Type</Label>
              <Input
                id="edit-vipKundli"
                value={formData.vipKundli}
                onChange={(e) => setFormData({ ...formData, vipKundli: e.target.value })}
                placeholder="VIP Kundli"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-mobile">Mobile Number *</Label>
              <Input
                id="edit-mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="Enter mobile number"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: KundliLead['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
                         <div>
               <Label htmlFor="edit-priority">Priority</Label>
               <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                 <SelectTrigger>
                   <SelectValue placeholder="Select priority" />
                 </SelectTrigger>
                 <SelectContent>
                   {priorityOptions.map((priority) => (
                     <SelectItem key={priority.value} value={priority.value}>
                       {priority.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             <div>
               <Label htmlFor="edit-assignedTo">Assigned To</Label>
               <Input
                 id="edit-assignedTo"
                 value={formData.assignedTo}
                 onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                 placeholder="Astrologer name"
               />
             </div>
            <div className="md:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any additional notes"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLead}>Update Lead</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Lead Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kundli Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedLead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedLead.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      {getStatusIcon(selectedLead.status)}
                      <Badge variant="secondary" className="ml-2 capitalize">
                        {selectedLead.status.replace('-', ' ')}
                      </Badge>
                    </div>
                                         <Badge variant={selectedLead.isProcessed ? "secondary" : "default"}>
                       {selectedLead.isProcessed ? 'Processed' : 'Unprocessed'}
                     </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{new Date(selectedLead.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Time of Birth</Label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{selectedLead.time}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Place of Birth</Label>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{selectedLead.place}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Gender</Label>
                  <p className="mt-1 text-gray-900 capitalize">{selectedLead.gender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Kundli Type</Label>
                  <p className="mt-1 text-gray-900">{selectedLead.vipKundli}</p>
                </div>
                                 <div>
                   <Label className="text-sm font-medium text-gray-500">Priority</Label>
                   <p className="mt-1 text-gray-900 capitalize">{selectedLead.priority || 'Medium'}</p>
                 </div>
                 <div>
                   <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                   <p className="mt-1 text-gray-900">{selectedLead.assignedTo || 'Unassigned'}</p>
                 </div>
                {selectedLead.email && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-white">{selectedLead.email}</span>
                    </div>
                  </div>
                )}
                                 <div>
                   <Label className="text-sm font-medium text-gray-500">Mobile Number</Label>
                   <div className="flex items-center mt-1">
                     <Phone className="h-4 w-4 text-gray-400 mr-2" />
                     <span className="text-gray-900">{selectedLead.mobile || 'Not provided'}</span>
                   </div>
                 </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created On</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date(selectedLead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date(selectedLead.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

                             {selectedLead.notes && selectedLead.notes.length > 0 && (
                 <div>
                   <Label className="text-sm font-medium text-gray-500">Notes</Label>
                   <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                     <p className="text-gray-900">
                       {Array.isArray(selectedLead.notes) ? selectedLead.notes.join(', ') : selectedLead.notes}
                     </p>
                   </div>
                 </div>
               )}

              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
  Star
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

// Update the Lead interface to match your MongoDB schema
interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  isRead: boolean;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  responseNotes?: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function LeadsPage() {
  const { toast } = useToast();

  const inquiryTypes = [
    "general",
    "service", 
    "product",
    "support",
    "feedback",
    "partnership",
    "media"
  ];

  const inquiryTypeLabels = {
    "general": "General Inquiry",
    "service": "Service Booking",
    "product": "Product Purchase", 
    "support": "Technical Support",
    "feedback": "Complaint/Feedback",
    "partnership": "Collaboration/Partnership",
    "media": "Media Inquiry"
  };

  // Status options matching your schema
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];



  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: '',
    message: '',
    preferredContact: 'email',
    isRead: false,
    status: 'pending' as Lead['status'],
    assignedTo: '',
    responseNotes: [] as Array<{
      note: string;
      addedBy: string;
      addedAt: string;
    }>
  });

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/find?limit=10000`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setLeads(data.data);
      } else {
        setLeads([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async () => {
    try {
      const newLead = {
        ...formData,
        // Remove fields that shouldn't be sent to API
        assignedTo: formData.assignedTo || undefined,
        responseNotes: formData.responseNotes || undefined
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLead),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lead added successfully",
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchLeads(); // Refresh the list
      } else {
        throw new Error('Failed to add lead');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive",
      });
    }
  };

  const handleEditLead = async () => {
    if (!selectedLead) return;
    try {
      const updates = {
        ...formData,
        assignedTo: formData.assignedTo || undefined,
        responseNotes: formData.responseNotes || undefined
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/update/${selectedLead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lead updated successfully",
        });
        setIsEditDialogOpen(false);
        resetForm();
        fetchLeads(); // Refresh the list
      } else {
        throw new Error('Failed to update lead');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lead deleted successfully",
        });
        fetchLeads(); // Refresh the list
      } else {
        throw new Error('Failed to delete lead');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const toggleReadStatus = async (lead: Lead) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/update/${lead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isRead: !lead.isRead
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Lead marked as ${!lead.isRead ? 'read' : 'unread'}`,
        });
        fetchLeads(); // Refresh the list
      } else {
        throw new Error('Failed to update read status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update read status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      inquiryType: '',
      message: '',
      preferredContact: 'email',
      isRead: false,
      status: 'pending',
      assignedTo: '',
      responseNotes: [] as Array<{
        note: string;
        addedBy: string;
        addedAt: string;
      }>
    });
    setSelectedLead(null);
  };

  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      subject: lead.subject,
      inquiryType: lead.inquiryType,
      message: lead.message,
      preferredContact: lead.preferredContact,
      isRead: lead.isRead,
      status: lead.status,
      assignedTo: lead.assignedTo || '',
      responseNotes: lead.responseNotes || []
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = async (lead: Lead) => {
    console.log('Opening view dialog for lead:', lead);
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
    console.log('View dialog state set to true');
    
    // Automatically mark as read when viewed
    if (!lead.isRead) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/update/${lead._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isRead: true
          }),
        });

        if (response.ok) {
          // Update the local state immediately for better UX
          setLeads(prevLeads => 
            prevLeads.map(l => 
              l._id === lead._id ? { ...l, isRead: true } : l
            )
          );
          console.log('Lead automatically marked as read');
        } else {
          console.error('Failed to mark lead as read');
        }
      } catch (error) {
        console.error('Error marking lead as read:', error);
      }
    }
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };



  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesInquiryType = inquiryTypeFilter === 'all' || lead.inquiryType === inquiryTypeFilter;
    
    return matchesSearch && matchesStatus && matchesInquiryType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600 mt-1">Manage and track your leads effectively</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <Label htmlFor="inquiryType">Inquiry Type *</Label>
                <Select 
                  value={formData.inquiryType} 
                  onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {inquiryTypeLabels[type as keyof typeof inquiryTypeLabels]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                <Select 
                  value={formData.preferredContact} 
                  onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How would you like us to respond?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter message"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: Lead['status']) => setFormData({ ...formData, status: value })}>
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
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="User ID (optional)"
                />
              </div>
              <div>
                <Label htmlFor="isRead">Mark as Read</Label>
                <Select 
                  value={formData.isRead ? 'true' : 'false'} 
                  onValueChange={(value) => setFormData({ ...formData, isRead: value === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Unread</SelectItem>
                    <SelectItem value="true">Read</SelectItem>
                  </SelectContent>
                </Select>
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
                  {leads.filter(l => l.status === 'pending').length}
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
                  {leads.filter(l => l.status === 'in-progress').length}
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
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leads.filter(l => l.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leads.filter(l => l.status === 'closed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leads.filter(l => !l.isRead).length}
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
                  placeholder="Search leads by name, email, or subject..."
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
              <Select value={inquiryTypeFilter} onValueChange={setInquiryTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Inquiry Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {inquiryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {inquiryTypeLabels[type as keyof typeof inquiryTypeLabels]}
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
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Inquiry Type</TableHead>
                  <TableHead>Status</TableHead>
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
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900">{lead.subject}</p>
                        <p className="text-sm text-gray-500 truncate">{lead.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {inquiryTypeLabels[lead.inquiryType as keyof typeof inquiryTypeLabels] || lead.inquiryType}
                      </Badge>
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
                           variant={lead.isRead ? "secondary" : "default"}
                           size="sm"
                           onClick={() => toggleReadStatus(lead)}
                           className="h-8 px-2"
                         >
                           {lead.isRead ? '✓ Read' : '○ Unread'}
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
                             <DropdownMenuItem onClick={() => toggleReadStatus(lead)}>
                               {lead.isRead ? 'Mark as Unread' : 'Mark as Read'}
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
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-subject">Subject *</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter subject"
              />
            </div>
            <div>
              <Label htmlFor="edit-inquiryType">Inquiry Type *</Label>
              <Select 
                value={formData.inquiryType} 
                onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {inquiryTypeLabels[type as keyof typeof inquiryTypeLabels]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-preferredContact">Preferred Contact Method</Label>
              <Select 
                value={formData.preferredContact} 
                onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How would you like us to respond?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="edit-message">Message *</Label>
              <Textarea
                id="edit-message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter message"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Lead['status']) => setFormData({ ...formData, status: value })}>
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
              <Label htmlFor="edit-assignedTo">Assigned To</Label>
              <Input
                id="edit-assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="User ID (optional)"
              />
            </div>
            <div>
              <Label htmlFor="edit-isRead">Mark as Read</Label>
              <Select 
                value={formData.isRead ? 'true' : 'false'} 
                onValueChange={(value) => setFormData({ ...formData, isRead: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Unread</SelectItem>
                  <SelectItem value="true">Read</SelectItem>
                </SelectContent>
              </Select>
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
            <DialogTitle>Lead Details</DialogTitle>
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
                    
                    <Badge variant={selectedLead.isRead ? "secondary" : "default"}>
                      {selectedLead.isRead ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{selectedLead.email}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{selectedLead.phone || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Subject</Label>
                  <p className="mt-1 text-gray-900">{selectedLead.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Inquiry Type</Label>
                  <p className="mt-1 text-gray-900">
                    {inquiryTypeLabels[selectedLead.inquiryType as keyof typeof inquiryTypeLabels] || selectedLead.inquiryType}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Preferred Contact</Label>
                  <p className="mt-1 text-gray-900 capitalize">{selectedLead.preferredContact}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                  <p className="mt-1 text-gray-900">{selectedLead.assignedTo || 'Unassigned'}</p>
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

              <div>
                <Label className="text-sm font-medium text-gray-500">Message</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedLead.message}</p>
                </div>
              </div>

              {selectedLead.responseNotes && selectedLead.responseNotes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Response Notes</Label>
                  <div className="mt-1 space-y-2">
                    {selectedLead.responseNotes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">{note.note}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Added on: {new Date(note.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
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
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Lead type definition
export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high';
  createdOn: string;
  updatedOn: string;
  notes?: string;
}

interface LeadState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [
    {
      _id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      subject: 'Kundli Analysis Request',
      inquiryType: 'Service Booking',
      message: 'I would like to get my kundli analyzed for career guidance. Please let me know the process and fees.',
      preferredContact: 'email',
      status: 'new',
      priority: 'high',
      createdOn: '2024-01-15',
      updatedOn: '2024-01-15',
      notes: 'Interested in career guidance through kundli analysis',
    },
    {
      _id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      subject: 'Marriage Compatibility Check',
      inquiryType: 'Service Booking',
      message: 'Need to check marriage compatibility between me and my partner. Please provide details about the service.',
      preferredContact: 'whatsapp',
      status: 'contacted',
      priority: 'medium',
      createdOn: '2024-01-14',
      updatedOn: '2024-01-15',
      notes: 'Called on 15th Jan, interested in detailed consultation',
    },
    {
      _id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 76543 21098',
      subject: 'Gemstone Recommendation',
      inquiryType: 'Product Purchase',
      message: 'Looking for gemstone recommendations based on my birth chart. Which stones would be beneficial for me?',
      preferredContact: 'phone',
      status: 'qualified',
      priority: 'medium',
      createdOn: '2024-01-13',
      updatedOn: '2024-01-14',
      notes: 'Qualified lead, interested in gemstone consultation',
    },
    {
      _id: '4',
      name: 'Sunita Devi',
      email: 'sunita.devi@email.com',
      phone: '+91 65432 10987',
      subject: 'Puja Booking Inquiry',
      inquiryType: 'Service Booking',
      message: 'I want to book a puja for my son\'s success in exams. Please let me know available dates and procedures.',
      preferredContact: 'phone',
      status: 'converted',
      priority: 'high',
      createdOn: '2024-01-12',
      updatedOn: '2024-01-13',
      notes: 'Successfully converted, puja booked for 25th Jan',
    },
    {
      _id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 54321 09876',
      subject: 'General Astrology Consultation',
      inquiryType: 'General Inquiry',
      message: 'Interested in general astrology consultation. What services do you offer and what are the charges?',
      preferredContact: 'email',
      status: 'lost',
      priority: 'low',
      createdOn: '2024-01-11',
      updatedOn: '2024-01-12',
      notes: 'Lead lost - found cheaper alternative elsewhere',
    },
  ],
  loading: false,
  error: null,
};

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async () => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return initialState.leads;
  }
);

export const addLead = createAsyncThunk(
  'leads/addLead',
  async (newLead: Omit<Lead, '_id'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const leadWithId = {
      ...newLead,
      _id: Date.now().toString(),
    };
    return leadWithId;
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, updates };
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leads';
      })
      // Add lead
      .addCase(addLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads.push(action.payload);
      })
      .addCase(addLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add lead';
      })
      // Update lead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const index = state.leads.findIndex(lead => lead._id === id);
        if (index !== -1) {
          state.leads[index] = { ...state.leads[index], ...updates };
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update lead';
      })
      // Delete lead
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.filter(lead => lead._id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete lead';
      });
  },
});

// Selectors
export const selectLeads = (state: { leads: LeadState }) => state.leads.leads;
export const selectLoading = (state: { leads: LeadState }) => state.leads.loading;
export const selectError = (state: { leads: LeadState }) => state.leads.error;

export const { clearError } = leadSlice.actions;
export default leadSlice.reducer;

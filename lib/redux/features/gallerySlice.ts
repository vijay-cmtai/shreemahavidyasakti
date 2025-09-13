import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// GalleryItem type definition
export interface GalleryItem {
  _id?: string;
  title: string;
  description?: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  status: 'public' | 'private' | 'draft';
  location?: string;
  event?: string;
  photographer?: string;
  views?: number;
  likes?: number;
  size?: number;
  uploadDate?: string;
}

interface GalleryState {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: GalleryState = {
  items: [
    {
      _id: '1',
      title: 'Temple Morning Prayer',
      description: 'Beautiful morning prayer ceremony at the main temple',
      type: 'photo',
      url: '/images/temple-prayer.jpg',
      thumbnail: '/images/temple-prayer-thumb.jpg',
      category: 'Religious Ceremonies',
      tags: ['temple', 'prayer', 'morning', 'ceremony'],
      status: 'public',
      location: 'Main Temple',
      event: 'Daily Morning Prayer',
      photographer: 'Temple Photography Team',
      views: 1250,
      likes: 89,
      size: 2.4,
      uploadDate: '2024-01-15T06:00:00Z',
    },
    {
      _id: '2',
      title: 'Festival Celebration',
      description: 'Grand festival celebration with devotees',
      type: 'video',
      url: '/videos/festival-celebration.mp4',
      thumbnail: '/images/festival-thumb.jpg',
      category: 'Festivals',
      tags: ['festival', 'celebration', 'devotees', 'community'],
      status: 'public',
      location: 'Temple Courtyard',
      event: 'Annual Festival',
      photographer: 'Media Team',
      views: 3420,
      likes: 156,
      size: 15.7,
      uploadDate: '2024-01-10T14:30:00Z',
    },
    {
      _id: '3',
      title: 'Meditation Session',
      description: 'Peaceful meditation session for spiritual seekers',
      type: 'photo',
      url: '/images/meditation.jpg',
      thumbnail: '/images/meditation-thumb.jpg',
      category: 'Spiritual Activities',
      tags: ['meditation', 'spiritual', 'peace', 'mindfulness'],
      status: 'public',
      location: 'Meditation Hall',
      event: 'Daily Meditation',
      photographer: 'Spiritual Team',
      views: 890,
      likes: 67,
      size: 1.8,
      uploadDate: '2024-01-12T18:00:00Z',
    },
    {
      _id: '4',
      title: 'Yoga Workshop',
      description: 'Community yoga workshop for health and wellness',
      type: 'video',
      url: '/videos/yoga-workshop.mp4',
      thumbnail: '/images/yoga-thumb.jpg',
      category: 'Health & Wellness',
      tags: ['yoga', 'health', 'wellness', 'workshop'],
      status: 'public',
      location: 'Community Center',
      event: 'Weekly Yoga Workshop',
      photographer: 'Health Team',
      views: 2150,
      likes: 98,
      size: 8.3,
      uploadDate: '2024-01-08T09:00:00Z',
    },
    {
      _id: '5',
      title: 'Cultural Performance',
      description: 'Traditional cultural performance by local artists',
      type: 'photo',
      url: '/images/cultural-performance.jpg',
      thumbnail: '/images/cultural-thumb.jpg',
      category: 'Cultural Events',
      tags: ['culture', 'performance', 'traditional', 'artists'],
      status: 'draft',
      location: 'Cultural Hall',
      event: 'Cultural Evening',
      photographer: 'Cultural Team',
      views: 0,
      likes: 0,
      size: 3.2,
      uploadDate: '2024-01-14T19:30:00Z',
    },
  ],
  loading: false,
  error: null,
};

// Async thunks
export const fetchGallery = createAsyncThunk(
  'gallery/fetchGallery',
  async () => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return initialState.items;
  }
);

export const addGalleryItem = createAsyncThunk(
  'gallery/addGalleryItem',
  async (newItem: Omit<GalleryItem, '_id'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const itemWithId = {
      ...newItem,
      _id: Date.now().toString(),
      uploadDate: new Date().toISOString(),
      views: 0,
      likes: 0,
      size: Math.random() * 5 + 0.5, // Random size between 0.5 and 5.5 MB
    };
    return itemWithId;
  }
);

export const updateGalleryItem = createAsyncThunk(
  'gallery/updateGalleryItem',
  async ({ id, updates }: { id: string; updates: Partial<GalleryItem> }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, updates };
  }
);

export const deleteGalleryItem = createAsyncThunk(
  'gallery/deleteGalleryItem',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch gallery
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gallery';
      })
      // Add gallery item
      .addCase(addGalleryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGalleryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addGalleryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add gallery item';
      })
      // Update gallery item
      .addCase(updateGalleryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGalleryItem.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const index = state.items.findIndex(item => item._id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updates };
        }
      })
      .addCase(updateGalleryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update gallery item';
      })
      // Delete gallery item
      .addCase(deleteGalleryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete gallery item';
      });
  },
});

// Selectors
export const selectGallery = (state: { gallery: GalleryState }) => state.gallery.items;
export const selectGalleryLoading = (state: { gallery: GalleryState }) => state.gallery.loading;
export const selectGalleryError = (state: { gallery: GalleryState }) => state.gallery.error;

export const { clearError } = gallerySlice.actions;
export default gallerySlice.reducer;

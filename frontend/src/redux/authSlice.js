import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInterceptor'; 

const getUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null; 
    try {
      return JSON.parse(userData); 
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      return null; 
    }
  };
  
  const initialState = {
    user: getUserFromLocalStorage(), 
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null,
  };
  

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('Response from register API:', response.data); 
      return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
        return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', userData);
      console.log("Réponse de l'API de connexion:", response.data);
      return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
        return rejectWithValue(errorMessage);
    }
  }
);


export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken; 
      const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
        return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axiosInstance.post('/auth/logout');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('User registered:', action.payload.user); 
        state.loading = false;
        state.user = action.payload.user; 
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })      
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload);  
        state.loading = false;
    
        
        if (action.payload.user) {
            state.user = action.payload.user; 
        } else {
            console.warn('Aucun utilisateur trouvé dans la réponse.');
            state.user = null; 
        }
    
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken; 
    
        
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
        localStorage.setItem('refreshToken', state.refreshToken);
    })
    
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken; 
        localStorage.setItem('token', action.payload.accessToken); 
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null; 

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken'); 
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;

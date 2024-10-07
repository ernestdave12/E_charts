import axios from 'axios';
import { store } from './store'; 
import { logoutUser, refreshToken} from './authSlice'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3010', 
});


axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;

    
    if (status === 401) {
      
      try {
        const { data } = await axiosInstance.post('/refresh-token'); 
        store.dispatch(refreshToken(data.token)); 
        error.config.headers['Authorization'] = `Bearer ${data.token}`; 
        return axiosInstance(error.config); 
      } catch (e) {
        store.dispatch(logoutUser()); 
        window.location.href = '/login'; 
      }
    }

    
    if (status === 403) {
      store.dispatch(logoutUser()); 
      window.location.href = '/login'; 
    }

    return Promise.reject(error); 
  }
);

export default axiosInstance; 

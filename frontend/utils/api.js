import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';

const API_BASE_URL = process.env.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const storeUserToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Error storing user token:', error);
  }
};

export const storeCookToken = async (token) => {
  try {
    await AsyncStorage.setItem('cookToken', token);
  } catch (error) {
    console.error('Error storing cook token:', error);
  }
};

export const getUserToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
};

export const getCookToken = async () => {
  try {
    return await AsyncStorage.getItem('cookToken');
  } catch (error) {
    console.error('Error getting cook token:', error);
    return null;
  }
};

export const removeUserToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Error removing user token:', error);
  }
};

export const removeCookToken = async () => {
  try {
    await AsyncStorage.removeItem('cookToken');
  } catch (error) {
    console.error('Error removing cook token:', error);
  }
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const registerCook = async (cookData) => {
  const formData = new FormData();
  Object.keys(cookData).forEach((key) => {
    if (key === 'profileImage' && cookData[key]) {
      formData.append('profileImage', {
        uri: cookData[key],
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    } else if (key === 'pricing' && cookData[key]) {
      formData.append('pricing[perDish]', cookData[key].perDish);
      formData.append('pricing[perHour]', cookData[key].perHour);
    } else if (Array.isArray(cookData[key])) {
      cookData[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, cookData[key]);
    }
  });

  const response = await api.post('/api/cook/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const loginCook = async (credentials) => {
  const response = await api.post('/api/cook/login', credentials);
  return response.data;
};

export const getCooks = async () => {
  try {
    const token = await getUserToken();
    const response = await api.get('/api/cook/getcooks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching cooks data:', error);
  }
};

export const getCookById = async (id) => {
  try {
    const token = await getUserToken();
    const response = await api.get(`/api/cook/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cook data by ID:', error);
  }
};

export const getUser = async () => {
  try {
    const token = await getUserToken();
    const response = await api.get('/api/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

export const updateUserProfile = async (data) => {
  try {
    const token = await getUserToken();
    const response = await api.put('/api/auth/user', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

export const getCooksByCuisine = async (cuisine) => {
  try {
    const token = await getUserToken();
    const response = await api.get(`/api/cook/cuisine/${encodeURIComponent(cuisine)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cooks by cuisine:', error);
  }
};
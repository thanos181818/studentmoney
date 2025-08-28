const API_BASE_URL = 'http://localhost:5000/api';

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send reset email');
    }

    return data;
  },
};

// Onboarding API calls
export const onboardingAPI = {
  saveOnboardingData: async (goals: string[], upiApp: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/onboarding/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ goals, upiApp }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save onboarding data');
    }

    return data;
  },

  getOnboardingData: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/onboarding/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get onboarding data');
    }

    return data;
  },
};

// Utility functions
export const getAuthToken = () => {
  return localStorage.getItem('budgetbuddy_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('budgetbuddy_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('budgetbuddy_token');
};

export const getUserData = () => {
  const userData = localStorage.getItem('budgetbuddy_user');
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (user: any) => {
  localStorage.setItem('budgetbuddy_user', JSON.stringify(user));
};

export const removeUserData = () => {
  localStorage.removeItem('budgetbuddy_user');
};
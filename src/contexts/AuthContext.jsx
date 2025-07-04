import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const savedAuth = localStorage.getItem('userAuth');
      if (savedAuth) {
        const userData = JSON.parse(savedAuth);
        const now = Date.now();
        
        // Check if session is still valid (7 days)
        if (userData.expiresAt && now < userData.expiresAt) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: userData.user });
        } else {
          // Session expired, clean up
          localStorage.removeItem('userAuth');
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('userAuth');
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in a real app, this would call your API
      if (email && password.length >= 6) {
        const userData = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: email,
          firstName: email.split('@')[0], // Simple extraction for demo
          lastName: 'User',
          createdAt: new Date().toISOString()
        };

        // Store auth data with expiration (7 days)
        const authData = {
          user: userData,
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        
        localStorage.setItem('userAuth', JSON.stringify(authData));
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        
        return userData;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in a real app, this would call your API
      const newUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString()
      };

      // Store auth data with expiration (7 days)
      const authData = {
        user: newUser,
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };
      
      localStorage.setItem('userAuth', JSON.stringify(authData));
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      
      return newUser;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('userAuth');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface SupabaseContextType {
  supabase: SupabaseClient;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Supabase client configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      async getItem(key: string) {
        try {
          // Try SecureStore first
          const value = await SecureStore.getItemAsync(key);
          if (value !== null) return value;
          
          // Fallback to AsyncStorage
          return await AsyncStorage.getItem(key);
        } catch (error) {
          console.warn('Storage getItem error:', error);
          return null;
        }
      },
      async setItem(key: string, value: string) {
        try {
          // Check if value is too large for SecureStore
          if (value.length > 2000) {
            console.warn('Value too large for SecureStore, using AsyncStorage');
            await AsyncStorage.setItem(key, value);
            return;
          }
          
          // Try SecureStore first
          await SecureStore.setItemAsync(key, value);
        } catch (error) {
          console.warn('SecureStore failed, using AsyncStorage fallback');
          await AsyncStorage.setItem(key, value);
        }
      },
      async removeItem(key: string) {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch (error) {
          console.warn('SecureStore removeItem error:', error);
        }
        // Also try to remove from AsyncStorage
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.warn('AsyncStorage removeItem error:', error);
        }
      },
    },
  },
});

// Provider component
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    supabase,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}; 
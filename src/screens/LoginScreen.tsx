import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { styles } from '@/styles/screens/LoginScreen';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Title,
  Paragraph,
} from 'react-native-paper';
import CustomPasswordInput from '@/components/CustomPasswordInput';
import { useSupabase } from '@/services/SupabaseContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useSupabase();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigation.replace('Main');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.surface}>
          <Title style={styles.title}>Task Scheduler</Title>
          <Paragraph style={styles.subtitle}>
            Stay on top of your goals and build better habits
          </Paragraph>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <CustomPasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>

          <View style={styles.footer}>
            <Text>Don't have an account? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              compact
            >
              Sign Up
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



export default LoginScreen; 
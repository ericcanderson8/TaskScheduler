import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
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
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  surface: {
    flex: 1,
    margin: 0,
    padding: 20,
    borderRadius: 0,
    elevation: 4,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  input: {
    marginBottom: 15,
    width: '100%',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default LoginScreen; 
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Surface,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import { useSupabase } from '@/services/SupabaseContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TaskForm } from '@/types';

type CreateTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateTask'>;

interface Props {
  navigation: CreateTaskScreenNavigationProp;
}

const CreateTaskScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const { supabase, user } = useSupabase();

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: form.title.trim(),
          description: form.description?.trim() || null,
          priority: form.priority,
          category: form.category?.trim() || null,
          status: 'pending',
        });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Task created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create task');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.surface}>
          <Title style={styles.title}>Create New Task</Title>

          <TextInput
            label="Task Title *"
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            mode="outlined"
            style={styles.input}
            placeholder="Enter task title"
          />

          <TextInput
            label="Description"
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Enter task description (optional)"
          />

          <Text style={styles.label}>Priority</Text>
          <SegmentedButtons
            value={form.priority}
            onValueChange={(value) => setForm({ ...form, priority: value as any })}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            style={styles.segmentedButton}
          />

          <TextInput
            label="Category"
            value={form.category}
            onChangeText={(text) => setForm({ ...form, category: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Work, Personal, Health"
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={[styles.button, styles.cancelButton]}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Create Task
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 5,
  },
  segmentedButton: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    borderColor: '#757575',
  },
});

export default CreateTaskScreen; 
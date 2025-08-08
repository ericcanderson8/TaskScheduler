import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { styles } from '@/styles/screens/AddTaskScreen';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Card,
  Chip,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import { useSupabase } from '@/services/SupabaseContext';
import { Task, TaskForm } from '@/types';

const AddTaskScreen: React.FC = () => {
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    duration_minutes: 60,
  });
  const [suggestedTime, setSuggestedTime] = useState<string | null>(null);
  const [suggestedDate, setSuggestedDate] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingTasks, setExistingTasks] = useState<Task[]>([]);
  const { supabase, user } = useSupabase();
  const theme = useTheme();

  useEffect(() => {
    loadExistingTasks();
  }, []);

  const loadExistingTasks = async () => {
    if (!user) return;

    try {
      const today = new Date();
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('due_date', today.toISOString().split('T')[0])
        .order('due_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setExistingTasks(data || []);
    } catch {
      // Error loading tasks
    }
  };

  const findNextAvailableSlot = (durationMinutes: number): { date: string; startTime: string } | null => {
    const today = new Date();
    const workStartHour = 9; // 9 AM
    const workEndHour = 17; // 5 PM
    
    // Check next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + dayOffset);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Get tasks for this date
      const dayTasks = existingTasks.filter(task => task.due_date === dateStr);
      
      // Check each hour from work start to work end
      for (let hour = workStartHour; hour <= workEndHour - Math.ceil(durationMinutes / 60); hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = new Date();
        endTime.setHours(hour + Math.ceil(durationMinutes / 60), 0, 0, 0);
        const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:00`;
        
        // Check if this slot conflicts with existing tasks
        const hasConflict = dayTasks.some(task => {
          if (!task.start_time || !task.end_time) return false;
          
          const taskStart = new Date(`2000-01-01T${task.start_time}`);
          const taskEnd = new Date(`2000-01-01T${task.end_time}`);
          const slotStart = new Date(`2000-01-01T${startTime}`);
          const slotEnd = new Date(`2000-01-01T${endTimeStr}`);
          
          return (slotStart < taskEnd && slotEnd > taskStart);
        });
        
        if (!hasConflict) {
          return { date: dateStr, startTime };
        }
      }
    }
    
    return null;
  };

  const handleDurationChange = (duration: number) => {
    setForm(prev => ({ ...prev, duration_minutes: duration }));
    const slot = findNextAvailableSlot(duration);
    if (slot) {
      setSuggestedDate(slot.date);
      setSuggestedTime(slot.startTime);
      setShowSuggestion(true);
    }
  };

  const handleCreateTask = async () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create tasks');
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        user_id: user.id,
        title: form.title.trim(),
        description: form.description?.trim() || null,
        duration_minutes: form.duration_minutes || 60,
        status: 'pending',
        due_date: suggestedDate || new Date().toISOString().split('T')[0],
        start_time: suggestedTime || null,
                  end_time: suggestedTime ? (() => {
            const endTime = new Date();
            endTime.setHours(
              parseInt(suggestedTime.split(':')[0]) + Math.ceil((form.duration_minutes || 60) / 60),
              0, 0, 0
            );
            return `${endTime.getHours().toString().padStart(2, '0')}:00`;
          })() : null,
      };

      const { error } = await supabase
        .from('tasks')
        .insert(taskData);

      if (error) throw error;

      Alert.alert(
        'Success!',
        `Task "${form.title}" has been scheduled for ${suggestedDate} at ${suggestedTime || 'no specific time'}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setForm({
                title: '',
                description: '',
                duration_minutes: 60,
              });
              setSuggestedTime(null);
              setSuggestedDate(null);
              setShowSuggestion(false);
              loadExistingTasks();
            }
          }
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Add task</Text>
        <Text style={styles.headerSubtitle}>time it today</Text>
      </Surface>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Task Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Task Details</Text>
            
            <TextInput
              label="Task Name"
              value={form.title}
              onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="What do you need to do?"
            />
            
            <TextInput
              label="Description (optional)"
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Add more details..."
            />
            

          </Card.Content>
        </Card>

        {/* Duration */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>How long will it take?</Text>
            
            <View style={styles.durationButtons}>
              {[30, 60, 90, 120, 180].map((duration) => (
                <Chip
                  key={duration}
                  selected={(form.duration_minutes || 60) === duration}
                  onPress={() => handleDurationChange(duration)}
                  style={styles.durationChip}
                  textStyle={styles.durationChipText}
                >
                  {duration < 60 ? `${duration}m` : `${Math.floor(duration / 60)}h${duration % 60 ? ` ${duration % 60}m` : ''}`}
                </Chip>
              ))}
            </View>
            
            <TextInput
              label="Custom Duration (minutes)"
              value={(form.duration_minutes || 60).toString()}
              onChangeText={(text) => {
                const duration = parseInt(text) || 60;
                handleDurationChange(duration);
              }}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter custom duration"
            />
          </Card.Content>
        </Card>

        {/* Suggestion */}
        {showSuggestion && suggestedTime && suggestedDate && (
          <Card style={styles.suggestionCard}>
            <Card.Content>
              <Text style={styles.suggestionTitle}>📅 Suggested Schedule</Text>
              <Text style={styles.suggestionText}>
                I found a free slot for your task:
              </Text>
              <View style={styles.suggestionDetails}>
                <Text style={styles.suggestionDate}>
                  {formatDate(suggestedDate)}
                </Text>
                <Text style={styles.suggestionTime}>
                  {formatTime(suggestedTime)} - {formatTime((() => {
                    const endTime = new Date();
                    endTime.setHours(
                      parseInt(suggestedTime.split(':')[0]) + Math.ceil((form.duration_minutes || 60) / 60),
                      0, 0, 0
                    );
                    return `${endTime.getHours().toString().padStart(2, '0')}:00`;
                  })())}
                </Text>
                <Text style={styles.suggestionDuration}>
                  Duration: {(form.duration_minutes || 60) < 60 ? `${form.duration_minutes || 60}m` : `${Math.floor((form.duration_minutes || 60) / 60)}h${(form.duration_minutes || 60) % 60 ? ` ${(form.duration_minutes || 60) % 60}m` : ''}`}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Create Button */}
        <Button
          mode="contained"
          onPress={handleCreateTask}
          loading={isLoading}
          disabled={!form.title.trim() || isLoading}
          style={styles.createButton}
          contentStyle={styles.createButtonContent}
        >
          {suggestedTime ? 'Schedule Task' : 'Create Task'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



export default AddTaskScreen; 
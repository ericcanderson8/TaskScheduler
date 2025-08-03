import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  Surface,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { useSupabase } from '@/services/SupabaseContext';
import { OpenAIService, ChatMessage, TaskCreationRequest } from '@/services/OpenAIService';
import { Task } from '@/types';

interface ChatbotProps {
  visible: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your task assistant. I can help you check your tasks or create new ones. What would you like to do?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskCreationRequest | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    if (visible) {
      loadTasks();
    }
  }, [visible]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      // Check if it's a task creation request
      if (userMessage.toLowerCase().includes('create') || 
          userMessage.toLowerCase().includes('schedule') || 
          userMessage.toLowerCase().includes('add') ||
          userMessage.toLowerCase().includes('new task')) {
        
        const result = await OpenAIService.createTaskFromMessage(userMessage, tasks);
        
        if (result.task && !result.needsMoreInfo) {
          // Create the task
          await createTask(result.task);
          setMessages([...newMessages, { role: 'assistant', content: result.response }]);
        } else {
          // Need more information
          setMessages([...newMessages, { role: 'assistant', content: result.response }]);
          if (result.task) {
            setCurrentTask(result.task);
          }
        }
      } else if (userMessage.toLowerCase().includes('task') || 
                 userMessage.toLowerCase().includes('what') ||
                 userMessage.toLowerCase().includes('show')) {
        // Query tasks
        const response = await OpenAIService.queryTasks(userMessage, tasks);
        setMessages([...newMessages, { role: 'assistant', content: response }]);
      } else {
        // General chat
        const response = await OpenAIService.chat(newMessages);
        setMessages([...newMessages, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble right now. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: TaskCreationRequest) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description || null,
          priority: taskData.priority || 'medium',
          due_date: taskData.due_date || null,
          category: taskData.category || null,
          status: 'pending',
        });

      if (error) throw error;
      
      // Reload tasks
      await loadTasks();
      setCurrentTask(null);
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleQuickResponse = (response: string) => {
    setInputText(response);
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Surface style={styles.chatContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Task Assistant</Text>
          <IconButton icon="close" onPress={onClose} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              ]}
            >
              <Card style={styles.messageCard}>
                <Card.Content>
                  <Text style={styles.messageText}>{message.content}</Text>
                </Card.Content>
              </Card>
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.messageContainer}>
              <Card style={styles.messageCard}>
                <Card.Content>
                  <ActivityIndicator size="small" />
                  <Text style={styles.messageText}>Thinking...</Text>
                </Card.Content>
              </Card>
            </View>
          )}
        </ScrollView>

        {currentTask && (
          <View style={styles.taskPreview}>
            <Text style={styles.taskPreviewTitle}>Creating task: {currentTask.title}</Text>
            <Text style={styles.taskPreviewText}>
              Priority: {currentTask.priority || 'Not set'}
            </Text>
          </View>
        )}

        <View style={styles.quickResponses}>
          <Button
            mode="outlined"
            compact
            onPress={() => handleQuickResponse('What are my tasks for today?')}
            style={styles.quickButton}
          >
            Today's Tasks
          </Button>
          <Button
            mode="outlined"
            compact
            onPress={() => handleQuickResponse('Create a new task')}
            style={styles.quickButton}
          >
            New Task
          </Button>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your tasks or create a new one..."
            mode="outlined"
            style={styles.input}
            multiline
            maxLength={500}
          />
          <IconButton
            icon="send"
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={styles.sendButton}
          />
        </View>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  chatContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  taskPreview: {
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  taskPreviewTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskPreviewText: {
    fontSize: 14,
    color: '#666',
  },
  quickResponses: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  quickButton: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    margin: 0,
  },
});

export default Chatbot; 
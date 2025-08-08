import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { styles } from '@/styles/screens/ChatScreen';
import {
  TextInput,
  Card,
  Text,
  Surface,
  IconButton,
  ActivityIndicator,
  Avatar,
  useTheme,
} from 'react-native-paper';
import { useSupabase } from '@/services/SupabaseContext';
import { OpenAIService, ChatMessage, TaskCreationRequest } from '@/services/OpenAIService';
import { Task } from '@/types';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello Eric! 👋\n\nI\'m your personal task assistant. I can help you:\n\n• Check your tasks for today\n• Create new tasks\n• Schedule meetings\n• Organize your day\n\nWhat would you like to do?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setCurrentTask] = useState<TaskCreationRequest | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const { supabase, user } = useSupabase();
  const theme = useTheme();

  useEffect(() => {
    loadTasks();
  }, []);

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
    } catch {
      // Error loading tasks
    }
  };

  const scrollToBottom = () => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Add user message
    const newMessages: ChatMessage[] = [...messages, { role: 'user' as const, content: userMessage }];
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
          setMessages([...newMessages, { role: 'assistant' as const, content: result.response }]);
        } else {
          // Need more information
          setMessages([...newMessages, { role: 'assistant' as const, content: result.response }]);
          if (result.task) {
            setCurrentTask(result.task);
          }
        }
      } else if (userMessage.toLowerCase().includes('task') || 
                 userMessage.toLowerCase().includes('what') ||
                 userMessage.toLowerCase().includes('show')) {
        // Query tasks
        const response = await OpenAIService.queryTasks(userMessage, tasks);
        setMessages([...newMessages, { role: 'assistant' as const, content: response }]);
      } else {
        // General chat
        const response = await OpenAIService.chat(newMessages);
        setMessages([...newMessages, { role: 'assistant' as const, content: response }]);
      }
    } catch {
      setMessages([...newMessages, { 
        role: 'assistant' as const, 
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
    } catch {
      // Error creating task
    }
  };



  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text size={40} label="E" style={styles.avatar} />
            <View style={styles.userText}>
              <Text style={styles.greeting}>Hello Eric</Text>
              <Text style={styles.subtitle}>today you have a few tasks</Text>
            </View>
          </View>
          <Text style={styles.time}>{formatTime()}</Text>
        </View>
      </Surface>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
          >
            {message.role === 'assistant' && (
              <Avatar.Icon size={32} icon="robot" style={styles.botAvatar} />
            )}
            <Card 
              style={[
                styles.messageCard,
                message.role === 'user' ? styles.userCard : styles.assistantCard
              ]}
            >
              <Card.Content style={styles.messageContent}>
                <Text style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                ]}>
                  {message.content}
                </Text>
              </Card.Content>
            </Card>
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.messageContainer}>
            <Avatar.Icon size={32} icon="robot" style={styles.botAvatar} />
            <Card style={styles.assistantCard}>
              <Card.Content style={styles.messageContent}>
                <ActivityIndicator size="small" style={styles.loadingIndicator} />
                <Text style={[styles.messageText, styles.assistantMessageText]}>Thinking...</Text>
              </Card.Content>
            </Card>
          </View>
        )}
      </ScrollView>



      {/* Input */}
      <Surface style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me anything about your tasks..."
          mode="outlined"
          style={styles.input}
          multiline
          maxLength={500}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            />
          }
        />
      </Surface>
    </KeyboardAvoidingView>
  );
};



export default ChatScreen; 
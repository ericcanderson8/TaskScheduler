import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Chip,
  Text,
  IconButton,
} from 'react-native-paper';
import { useSupabase } from '@/services/SupabaseContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Task } from '@/types';

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

interface Props {
  navigation: TaskListScreenNavigationProp;
}

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    loadTasks();
  }, []);

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
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in_progress':
        return '#2196f3';
      case 'pending':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card style={styles.taskCard}>
      <Card.Content>
        <View style={styles.taskHeader}>
          <Title style={styles.taskTitle}>{item.title}</Title>
          <View style={styles.taskActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('EditTask', { taskId: item.id })}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteTask(item.id)}
            />
          </View>
        </View>
        
        {item.description && (
          <Paragraph style={styles.taskDescription}>{item.description}</Paragraph>
        )}
        
        <View style={styles.taskMeta}>
          <Chip
            mode="outlined"
            textStyle={{ color: getPriorityColor(item.priority) }}
            style={[styles.chip, { borderColor: getPriorityColor(item.priority) }]}
          >
            {item.priority}
          </Chip>
          
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(item.status) }}
            style={[styles.chip, { borderColor: getStatusColor(item.status) }]}
          >
            {item.status.replace('_', ' ')}
          </Chip>
          
          {item.category && (
            <Chip mode="outlined" style={styles.chip}>
              {item.category}
            </Chip>
          )}
        </View>
        
        {item.due_date && (
          <Text style={styles.dueDate}>
            Due: {new Date(item.due_date).toLocaleDateString()}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

              if (error) throw error;
              await loadTasks();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete task');
              console.error('Error deleting task:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Paragraph style={styles.emptySubtext}>
            Create your first task to get started!
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateTask')}
            style={styles.createButton}
          >
            Create Task
          </Button>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateTask')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  createButton: {
    marginTop: 10,
  },
  listContainer: {
    padding: 10,
  },
  taskCard: {
    marginBottom: 10,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitle: {
    flex: 1,
    marginRight: 10,
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskDescription: {
    marginTop: 5,
    opacity: 0.8,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 5,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
  dueDate: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TaskListScreen; 
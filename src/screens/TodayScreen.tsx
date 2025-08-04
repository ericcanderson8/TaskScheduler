import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Card,
  Chip,
  useTheme,
  Portal,
  Modal,
} from 'react-native-paper';
import { useSupabase } from '@/services/SupabaseContext';
import { Task, TimeSlot } from '@/types';

const TodayScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showMonthView, setShowMonthView] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const { supabase, user } = useSupabase();
  const theme = useTheme();

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  useEffect(() => {
    generateTimeSlots();
  }, [tasks]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('due_date', dateStr)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch {
      // Error loading tasks
    }
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const startHour = 0; // 12 AM
    const endHour = 24; // 12 AM next day

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Find if there's a task in this time slot
      const taskInSlot = tasks.find(task => {
        if (!task.start_time) return false;
        const taskHour = parseInt(task.start_time.split(':')[0]);
        return taskHour === hour;
      });

      slots.push({
        start_time: startTime,
        end_time: endTime,
        isAvailable: !taskInSlot,
        task: taskInSlot,
      });
    }

    setTimeSlots(slots);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in_progress': return '#2196f3';
      case 'pending': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const renderTimeSlot = (slot: TimeSlot, index: number) => {
    const isCurrentHour = new Date().getHours() === index;
    
    return (
      <View key={index} style={styles.timeSlot}>
        <View style={styles.timeLabel}>
          <Text style={[
            styles.timeText,
            isCurrentHour && styles.currentTimeText
          ]}>
            {formatTime(slot.start_time)}
          </Text>
        </View>
        
        <View style={[
          styles.slotContent,
          isCurrentHour && styles.currentSlot,
          slot.task && styles.taskSlot
        ]}>
          {slot.task ? (
            <Card style={[styles.taskCard, { borderLeftColor: getPriorityColor(slot.task.priority) }]}>
              <Card.Content style={styles.taskContent}>
                <Text style={styles.taskTitle}>{slot.task.title}</Text>
                {slot.task.description && (
                  <Text style={styles.taskDescription}>{slot.task.description}</Text>
                )}
                <View style={styles.taskMeta}>
                  <Chip 
                    mode="outlined" 
                    style={[styles.priorityChip, { borderColor: getPriorityColor(slot.task.priority) }]}
                  >
                    {slot.task.priority}
                  </Chip>
                  <Chip 
                    mode="outlined" 
                    style={[styles.statusChip, { borderColor: getStatusColor(slot.task.status) }]}
                  >
                    {slot.task.status}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.emptySlotText}>Available</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderMonthView = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return (
      <Portal>
        <Modal
          visible={showMonthView}
          onDismiss={() => setShowMonthView(false)}
          contentContainerStyle={styles.monthModal}
        >
          <Surface style={styles.monthContainer}>
            <View style={styles.monthHeader}>
              <IconButton
                icon="chevron-left"
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
              />
              <Text style={styles.monthTitle}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <IconButton
                icon="chevron-right"
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
              />
            </View>
            
            <View style={styles.calendarGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.weekdayHeader}>{day}</Text>
              ))}
              
              {days.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      isSelected && styles.selectedDay,
                      isToday && styles.todayDay,
                    ]}
                    onPress={() => {
                      setSelectedDate(date);
                      setShowMonthView(false);
                    }}
                  >
                    <Text style={[
                      styles.dayText,
                      !isCurrentMonth && styles.otherMonthDay,
                      isSelected && styles.selectedDayText,
                      isToday && styles.todayDayText,
                    ]}>
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Surface>
        </Modal>
      </Portal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="chevron-left"
            onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
          />
          
          <TouchableOpacity onPress={() => setShowMonthView(true)}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>
          
          <IconButton
            icon="chevron-right"
            onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              setSelectedDate(newDate);
            }}
          />
        </View>
      </Surface>

      {/* Schedule */}
      <ScrollView 
        style={styles.scheduleContainer}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scheduleContent}
      >
        {timeSlots.map((slot, index) => renderTimeSlot(slot, index))}
      </ScrollView>

      {renderMonthView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scheduleContent: {
    paddingBottom: 20,
  },
  timeSlot: {
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 60,
  },
  timeLabel: {
    width: 80,
    paddingTop: 8,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  currentTimeText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  slotContent: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 12,
  },
  currentSlot: {
    borderLeftColor: '#6200ee',
    backgroundColor: '#f3e5f5',
  },
  taskSlot: {
    borderLeftColor: '#6200ee',
  },
  emptySlot: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  emptySlotText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  taskCard: {
    marginVertical: 4,
    borderLeftWidth: 4,
    elevation: 2,
  },
  taskContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  monthModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    elevation: 5,
  },
  monthContainer: {
    padding: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekdayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingVertical: 8,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDay: {
    backgroundColor: '#6200ee',
  },
  todayDay: {
    backgroundColor: '#f3e5f5',
    borderColor: '#6200ee',
  },
  dayText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  otherMonthDay: {
    color: '#ccc',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todayDayText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default TodayScreen; 
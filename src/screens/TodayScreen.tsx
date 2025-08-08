import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const { supabase, user } = useSupabase();
  const theme = useTheme();

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  useEffect(() => {
    generateTimeSlots();
  }, [tasks]);

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

    // Generate 5-minute slots for precise positioning
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute + 5;
        const endTime = `${hour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

        slots.push({
          start_time: startTime,
          end_time: endTime,
          isAvailable: true,
          task: undefined,
        });
      }
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
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute || '00'} ${ampm}`;
  };

  const formatTimeLabel = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in_progress': return '#2196f3';
      case 'pending': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getTaskPosition = (task: Task) => {
    if (!task.start_time || !task.end_time) return null;
    
    const [startHour, startMinute] = task.start_time.split(':').map(Number);
    const [endHour, endMinute] = task.end_time.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    const hourHeight = 80; // Height of each hour slot
    const minuteHeight = hourHeight / 60; // Height per minute
    
    return {
      top: startTotalMinutes * minuteHeight,
      height: Math.max(durationMinutes * minuteHeight, 30), // Minimum height of 30
    };
  };

  const getCurrentTimePosition = () => {
    const totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const hourHeight = 80;
    const minuteHeight = hourHeight / 60;
    
    return totalMinutes * minuteHeight;
  };

  const renderCalendarView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const currentTimePosition = getCurrentTimePosition();
    
    return (
      <View style={styles.calendarContainer}>
        {/* Time labels and grid lines */}
        {hours.map((hour) => (
          <View key={hour} style={styles.hourContainer}>
            <View style={styles.timeLabel}>
              <Text style={styles.timeText}>
                {formatTimeLabel(hour)}
              </Text>
            </View>
            <View style={styles.hourLine} />
          </View>
        ))}
        
        {/* Tasks positioned absolutely */}
        <View style={styles.tasksContainer}>
          {tasks.map((task) => {
            const position = getTaskPosition(task);
            if (!position) return null;
            
            return (
              <View
                key={task.id}
                style={[
                  styles.taskBlock,
                  {
                    top: position.top,
                    height: position.height,
                    backgroundColor: getStatusColor(task.status) + '20',
                    borderLeftColor: getStatusColor(task.status),
                  }
                ]}
              >
                <Text style={styles.taskBlockTitle} numberOfLines={1}>
                  {task.title}
                </Text>
                <Text style={styles.taskBlockTime}>
                  {formatTime(task.start_time || '')} - {formatTime(task.end_time || '')}
                </Text>
                {task.description && (
                  <Text style={styles.taskBlockDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
        
        {/* Current time indicator */}
        <View style={[styles.currentTimeLine, { top: currentTimePosition }]}>
          <View style={styles.currentTimeCircle} />
          <View style={styles.currentTimeLineBar} />
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
          
          <TouchableOpacity 
            style={styles.dateContainer} 
            onPress={() => setShowMonthView(true)}
          >
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <Text style={styles.dayText}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </Text>
            <IconButton
              icon="chevron-down"
              size={16}
              style={styles.dropdownIcon}
            />
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
        {renderCalendarView()}
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
    paddingTop: Platform.OS === 'web' ? 30 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: Platform.OS === 'web' ? 0 : 2,
    shadowColor: Platform.OS === 'web' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'web' ? { width: 0, height: 2 } : undefined,
    shadowOpacity: Platform.OS === 'web' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'web' ? 4 : undefined,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  dropdownIcon: {
    margin: 0,
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scheduleContent: {
    paddingBottom: 20,
    minHeight: 24 * 80, // 24 hours * 80px per hour
  },
  calendarContainer: {
    position: 'relative',
    minHeight: 24 * 80, // 24 hours * 80px per hour
    paddingLeft: 80, // Space for time labels
  },
  hourContainer: {
    position: 'relative',
    height: 80,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeLabel: {
    position: 'absolute',
    left: -80,
    width: 70,
    alignItems: 'flex-end',
    paddingRight: 10,
    top: -8,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  hourLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  tasksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  taskBlock: {
    position: 'absolute',
    left: 5, // Start tasks right after time labels
    right: 10,
    borderLeftWidth: 4,
    borderRadius: 6,
    padding: 8,
    elevation: Platform.OS === 'web' ? 0 : 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskBlockTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  taskBlockTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  taskBlockDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  currentTimeLine: {
    position: 'absolute',
    left: -10,
    right: 10,
    height: 2,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  currentTimeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff5722',
    marginLeft: -6,
  },
  currentTimeLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#ff5722',
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
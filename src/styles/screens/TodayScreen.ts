import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
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
    paddingLeft: 100, // Increased space for time labels
  },
  hourContainer: {
    position: 'relative',
    height: 80,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeLabel: {
    position: 'absolute',
    left: -100,
    width: 90,
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
    left: 25, // Increased space to avoid time label overlap
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
    left: 0,
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
    marginLeft: 0,
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
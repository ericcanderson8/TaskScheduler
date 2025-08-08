import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: Platform.OS === 'web' ? 0 : 2,
    shadowColor: Platform.OS === 'web' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'web' ? { width: 0, height: 2 } : undefined,
    shadowOpacity: Platform.OS === 'web' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'web' ? 4 : undefined,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
    elevation: Platform.OS === 'web' ? 0 : 2,
    shadowColor: Platform.OS === 'web' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'web' ? { width: 0, height: 1 } : undefined,
    shadowOpacity: Platform.OS === 'web' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'web' ? 2 : undefined,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  durationChip: {
    marginBottom: 8,
  },
  durationChipText: {
    fontSize: 14,
  },
  suggestionCard: {
    marginBottom: 20,
    backgroundColor: '#f3e5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#6200ee',
  },
  suggestionText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  suggestionDetails: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
  },
  suggestionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  suggestionTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  suggestionDuration: {
    fontSize: 14,
    color: '#666',
  },
  createButton: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#6200ee',
  },
  createButtonContent: {
    paddingVertical: 8,
  },
}); 
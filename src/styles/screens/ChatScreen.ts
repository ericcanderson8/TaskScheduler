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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  userText: {
    marginLeft: 15,
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6200ee',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    backgroundColor: '#6200ee',
    marginRight: 8,
  },
  messageCard: {
    maxWidth: '80%',
    elevation: Platform.OS === 'web' ? 0 : 1,
    shadowColor: Platform.OS === 'web' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'web' ? { width: 0, height: 1 } : undefined,
    shadowOpacity: Platform.OS === 'web' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'web' ? 2 : undefined,
  },
  userCard: {
    backgroundColor: '#6200ee',
  },
  assistantCard: {
    backgroundColor: '#ffffff',
  },
  messageContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  assistantMessageText: {
    color: '#1a1a1a',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#f5f5f5',
  },
}); 
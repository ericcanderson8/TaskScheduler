import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
  Avatar,
  Divider,
  FAB,
} from 'react-native-paper';
import { useSupabase } from '@/services/SupabaseContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import Chatbot from '@/components/Chatbot';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useSupabase();
  const [chatbotVisible, setChatbotVisible] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <Surface style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Text size={50} label={user?.email?.charAt(0).toUpperCase() || 'U'} />
          <View style={styles.userText}>
            <Title>Welcome back!</Title>
            <Paragraph>{user?.email}</Paragraph>
          </View>
        </View>
        <Button mode="outlined" onPress={handleSignOut}>
          Sign Out
        </Button>
      </Surface>

      <View style={styles.content}>
        <Title style={styles.sectionTitle}>Quick Actions</Title>
        
        <View style={styles.cardGrid}>
          <Card style={styles.card} onPress={() => navigation.navigate('TaskList')}>
            <Card.Content>
              <Title>Tasks</Title>
              <Paragraph>Manage your daily tasks and to-dos</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained">View Tasks</Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card} onPress={() => navigation.navigate('CreateTask')}>
            <Card.Content>
              <Title>New Task</Title>
              <Paragraph>Create a new task or goal</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained">Create</Button>
            </Card.Actions>
          </Card>
        </View>

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>Today's Overview</Title>
        
        <Card style={styles.overviewCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Pending Tasks</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Habits</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>Recent Activity</Title>
        
        <Card style={styles.activityCard}>
          <Card.Content>
            <Paragraph style={styles.noActivity}>
              No recent activity. Start by creating your first task!
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="chat"
        onPress={() => setChatbotVisible(true)}
        label="Task Assistant"
      />
      
      <Chatbot
        visible={chatbotVisible}
        onClose={() => setChatbotVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userText: {
    marginLeft: 15,
    flex: 1,
  },
  content: {
    padding: 10,
  },
  sectionTitle: {
    marginBottom: 15,
    marginLeft: 5,
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  divider: {
    marginVertical: 20,
  },
  overviewCard: {
    elevation: 2,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },
  activityCard: {
    elevation: 2,
  },
  noActivity: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen; 
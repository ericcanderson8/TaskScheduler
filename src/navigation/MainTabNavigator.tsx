import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ChatScreen from '@/screens/ChatScreen';
import TodayScreen from '@/screens/TodayScreen';
import AddTaskScreen from '@/screens/AddTaskScreen';
import { MainTabParamList } from '@/types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Chat') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'Today') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'AddTask') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          } else {
            iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ tabBarLabel: 'chat' }}
      />
      <Tab.Screen 
        name="Today" 
        component={TodayScreen}
        options={{ tabBarLabel: 'Calendar' }}
      />
      <Tab.Screen 
        name="AddTask" 
        component={AddTaskScreen}
        options={{ tabBarLabel: 'Add item' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 
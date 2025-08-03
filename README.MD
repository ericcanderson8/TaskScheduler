# Task Scheduler

A comprehensive habit and goal tracking application built with React Native/Expo and Supabase. Help users build better habits and achieve their goals through intelligent task management and progress tracking.

## 🎯 Overview

Task Scheduler is designed to help people become more disciplined with their habits by providing a structured approach to goal setting and task management. The app combines traditional task management with habit tracking and AI-powered insights to create a comprehensive productivity solution.

### Key Features
- **Task Management**: Create, organize, and track tasks with priorities and categories
- **Habit Tracking**: Build and maintain positive habits with streak tracking
- **Goal Setting**: Set long-term goals and track progress over time
- **AI Integration**: Smart suggestions and insights powered by OpenAI
- **Cross-Platform**: Works on iOS, Android, and Web
- **Real-time Sync**: Data synchronization across all devices

## 🚀 Tech Stack

### Frontend
- **React Native** with **Expo SDK 50**
- **TypeScript** for type safety
- **React Navigation v6** for navigation
- **React Native Paper** for UI components
- **React Context API** for state management

### Backend
- **Supabase** for backend services
- **PostgreSQL** database
- **Supabase Auth** for authentication
- **Supabase Edge Functions** for serverless functions

### AI & Integrations
- **OpenAI API** for intelligent features
- **Supabase Real-time** for live updates

### Development Tools
- **Expo CLI** for development and building
- **Metro** bundler with module resolution
- **ESLint** and **Prettier** for code quality

## 📱 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ericcanderson8/TaskScheduler.git
   cd TaskScheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - Configure authentication settings in Supabase dashboard

5. **Start the development server**
   ```bash
   npm start
   ```

### Running on Devices

- **iOS Simulator**: Press `i` in the terminal or scan QR code with Expo Go
- **Android Emulator**: Press `a` in the terminal or scan QR code with Expo Go
- **Physical Device**: Install Expo Go app and scan the QR code

## 🗄️ Database Schema

The application uses the following main tables:

- **`profiles`**: User profile information
- **`tasks`**: Task management with priority and status
- **`habits`**: Habit tracking with streaks and frequency
- **`habit_logs`**: Daily habit completion records
- **`goals`**: Long-term goal tracking with progress

All tables include Row Level Security (RLS) for data protection.

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data protection
- **User Isolation**: Users can only access their own data

## 📁 Project Structure

```
TaskScheduler/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── services/       # API and service layer
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── supabase/           # Database schema and migrations
├── assets/             # Images, fonts, and static files
├── App.tsx             # Main application component
├── package.json        # Dependencies and scripts
├── app.json           # Expo configuration
├── tsconfig.json      # TypeScript configuration
└── metro.config.js    # Metro bundler configuration
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run build` - Build for production

### Code Style

The project uses TypeScript with strict mode enabled. All components should be properly typed and follow React Native best practices.

## 🚀 Deployment

### Mobile Apps
- **Expo Go**: For development and testing
- **EAS Build**: For production builds and app store deployment

### Web Version
- **Vercel**: Recommended for web deployment
- **Netlify**: Alternative hosting option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic task management
- [x] User authentication
- [x] Database setup
- [ ] Habit tracking screens
- [ ] Goal management

### Phase 2
- [ ] AI-powered task suggestions
- [ ] Push notifications
- [ ] Data analytics
- [ ] Social features

### Phase 3
- [ ] Web application
- [ ] Advanced analytics
- [ ] Integration with calendar apps
- [ ] Team collaboration features

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the changelog for recent updates

---

**Built with ❤️ using React Native, Expo, and Supabase**


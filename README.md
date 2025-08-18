# ICAN App

A comprehensive mobile application to help students, parents, and counselors plan their academic and career journey. Built with React Native, Expo, and Supabase.

## 🎯 Features

- **Personalized Checklists**: Grade-specific monthly planning checklists tailored to post-high school plans
- **Role-Based Experience**: Customized interfaces for Students, Parents/Guardians, and Counselors
- **Career Planning**: Comprehensive career exploration tools and assessments
- **College Planning**: Step-by-step guidance through the college application process
- **Financial Aid**: Complete financial planning resources and scholarship information
- **Progress Tracking**: Visual progress indicators and achievement celebrations
- **ICAN Integration**: Direct access to ICAN resources and free advisor consultations

## 🚀 Tech Stack

- **Frontend**: React Native 0.79.3
- **Framework**: Expo SDK 53
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Authentication**: Supabase Auth
- **Language**: TypeScript
- **Navigation**: Expo Router v5
- **State Management**: React Hooks
- **UI Components**: Custom themed components with dark/light mode support

## 📱 App Store Ready

- ✅ **iOS**: Configured with bundle ID `com.ican.collegeplanning`
- ✅ **Android**: Configured with package `com.ican.collegeplanning`
- ✅ **Privacy Policy**: Complete privacy policy for app store compliance
- ✅ **App Store Assets**: Descriptions, keywords, and submission materials ready
- ✅ **Code Quality**: All critical issues resolved, production-ready code

## 🛠️ Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Supabase account

## 🚀 Setup

1. **Clone the repository:**
```bash
git clone https://github.com/bellaillingworth/icannapp.git
cd icannapp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Supabase Setup:**
   - Create a Supabase project at https://supabase.com/
   - Set up your database tables (see database schema below)
   - Update `supabaseClient.js` with your project URL and anon key

4. **Start the development server:**
```bash
npm start
```

5. **Run on iOS:**
```bash
npm run ios
```

6. **Run on Android:**
```bash
npm run android
```

## 🏗️ Project Structure

```
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── explore.tsx    # Main checklist interface
│   │   ├── profile.tsx    # User profile management
│   │   └── notification.tsx # Notifications
│   ├── career-planning.tsx # Career planning resources
│   ├── college-planning.tsx # College planning guide
│   ├── financial-aid.tsx  # Financial aid information
│   ├── preferences.tsx    # User preferences setup
│   ├── signin.tsx         # Authentication
│   └── signup.tsx         # User registration
├── components/            # Reusable components
│   ├── ThemedText.tsx    # Typography component
│   ├── ThemedView.tsx    # Container component
│   └── AnnouncementSlider.tsx # News ticker
├── constants/            # App constants and data
│   ├── Colors.ts         # Color scheme
│   └── Checklists.ts     # Checklist definitions
├── hooks/               # Custom React hooks
├── assets/              # Static assets (images, fonts)
└── supabaseClient.js    # Supabase configuration
```

## 🗄️ Database Schema

The app uses Supabase with the following key tables:
- `profiles`: User profile information
- `checklist_master_tasks`: Task definitions by grade and plan
- `checklist_items`: User task completion status
- `announcements`: App announcements and updates

## 📱 App Store Submission

The app is ready for submission to both iOS App Store and Google Play Store:

- **App Name**: ICAN
- **Category**: Education
- **Age Rating**: 4+
- **Platforms**: iOS 13.0+, Android 5.0+
- **Features**: Universal app (iPhone + iPad + Android)

See `APP_STORE_DESCRIPTION.md` for complete submission details.

## 🧪 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- React Hooks best practices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **ICAN (Iowa College Access Network)** for providing the content, resources, and guidance
- **React Native community** for excellent documentation and tools
- **Expo team** for the amazing development platform
- **Supabase** for the powerful backend-as-a-service

## 📞 Support

For support or questions about the ICAN app:
- **Website**: [www.icansucceed.org](https://www.icansucceed.org)
- **Email**: support@icansucceed.org
- **GitHub Issues**: [Report bugs or request features](https://github.com/bellaillingworth/icannapp/issues)

---

**Built with ❤️ for students, parents, and counselors navigating the college planning journey.**

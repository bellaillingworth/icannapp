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


---

**Built with ❤️ for students, parents, and counselors navigating the college planning journey.**

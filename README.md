# ICAN Student Success App

A mobile application to help students plan their academic and career journey, built with React Native and Firebase.

## Features

- Career Planning Guide
- College Planning Resources
- Financial Aid Information
- Interactive Checklists
- User Profile Management

## Tech Stack

- React Native
- Expo
- Firebase (Firestore)
- TypeScript

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Firebase Setup:
   - Create a Firebase project at https://console.firebase.google.com/
   - Add an iOS app to your Firebase project
   - Download `GoogleService-Info.plist`
   - Place `GoogleService-Info.plist` in the `ios/` directory
   - Update Firebase configuration in `config/firebase.ts`

4. Start the development server:
   ```bash
npm start
   ```

5. Run on iOS:
```bash
npm run ios
```

6. Run on Android:
```bash
npm run android
```

## Project Structure

```
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── career-planning.tsx
│   ├── college-planning.tsx
│   └── financial-aid.tsx
├── components/            # Reusable components
├── config/               # Configuration files
│   └── firebase.ts      # Firebase configuration
├── services/            # Service layer
│   └── firestore.ts     # Firestore operations
└── assets/             # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ICAN (Iowa College Access Network) for providing the content and resources
- React Native community for the excellent documentation and tools

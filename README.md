# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```
## start backend server

   ```bash
   npm run dev
   ```
## start database
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
## start the Expo app
   ```bash
   npx expo start
   ```
In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflowa/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Focus Fish 🐟

Focus Fish is a mobile productivity application designed to help users improve their concentration through a focus timer and a virtual fish companion.

Users can start a focus session, complete daily and weekly quests, and view their focus statistics. The application uses a gamification concept to make studying and working more enjoyable.

## Features

* Focus timer
* Start, pause, resume, and end focus sessions
* Virtual fish companion
* Daily and weekly quests
* Focus statistics
* User profile
* Application settings
* Mobile-friendly interface
* Android and iOS support

## Tech Stack

### Frontend

* React Native
* Expo SDK 57
* TypeScript
* Expo Router
* NativeWind
* Tailwind CSS
* React Native Reanimated
* React Native Gesture Handler
* React Native Safe Area Context

### Backend
- Node.js
- Express.js
- JWT

### Database
- PostgreSQL

### Development Tools

* Visual Studio Code
* Android Studio
* Android Emulator
* Git
* GitHub

## Project Structure

```text
fish_focus/
│
├── app/
│   ├── index.tsx
│   ├── focus.tsx
│   ├── statistics.tsx
│   ├── profile.tsx
│   ├── settings.tsx
│   │
│   └── focus/
│       ├── timer.tsx
│       ├── pause.tsx
│       └── success.tsx
│
├── assets/
├── package.json
├── app.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/SHOTA51/fish_focus.git
```

Move into the project directory:

```bash
cd fish_focus
```

Install dependencies:

```bash
npm install
```

## Running the Application

Start the Expo development server:

```bash
npx expo start
```

### Run on Android Emulator

Make sure that an Android Emulator is running, then press:

```text
a
```

Alternatively, run:

```bash
npx expo start --android
```

### Run on iOS Simulator

On macOS with Xcode installed, run:

```bash
npx expo start --ios
```

### Run on a Physical Device

Install the Expo Go application on your Android or iOS device, then scan the QR code shown in the terminal or browser.

## Development

The application uses Expo Router for file-based navigation. Each file inside the `app` directory represents a screen or route.

For example:

```text
app/index.tsx
```

represents the Home screen, while:

```text
app/focus/timer.tsx
```

represents the Focus Timer screen.

NativeWind is used to style React Native components with Tailwind CSS utility classes.

Example:

```tsx
<View className="flex-1 items-center justify-center bg-[#EAF8FF]">
  <Text className="text-2xl font-bold text-[#163B56]">
    Focus Fish
  </Text>
</View>
```

## Main Screens

* **Home** — Displays the virtual fish, focus time, and start button.
* **Focus** — Provides access to the focus session.
* **Timer** — Runs the focus countdown.
* **Pause** — Allows users to pause and resume a focus session.
* **Success** — Displays the result after completing a focus session.
* **Statistics** — Displays focus time and productivity statistics.
* **Profile** — Displays user information.
* **Settings** — Allows users to configure application preferences.

## Future Improvements

* User authentication
* Cloud database integration
* Saving focus session history
* Fish growth and customization
* Quest rewards and experience points
* Push notifications
* More detailed statistics
* Dark mode
* Cloud synchronization

## Team

Developed by the Focus Fish development team.

## License

This project is developed for educational purposes.
 
 
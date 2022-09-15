# Budgeting-React-Native-app

https://user-images.githubusercontent.com/57244943/190319857-8498233b-e660-4ad9-94ef-88bdaea047b9.mp4

RUNNING INSTRUCTIONS

1. Follow React Native setup instructions for React Native CLI QuickStart (NOT Expo CLI QuickStart). Stop at "Creating a new application".
https://reactnative.dev/docs/environment-setup
** skip this step if you already have react native CLI installed

2. Install the following libraries into the Budgie project folder (Repo/Budgie)
- https://reactnative.dev/docs/navigation
- https://github.com/realm/realm-js/tree/master/packages/realm-react#readme
- https://github.com/henninghall/react-native-date-picker#example-1-modal

Follow instructions on above websites or enter the following commands:
npm install react-native-screens react-native-safe-area-context
npm install react-native-unimodules
npm install realm
npm install realm @realm/react
npm install react-native-date-picker


3. Skip to "Running your React Native application" and follow instructions
https://reactnative.dev/docs/environment-setup

- Start Metro, keep it running in a terminal window
npx react-native start

- Start Application
npx react-native run-android


iOS INSTRUCTIONS
(in the application folder)
- npm install
- npx react-native start

- cd ios
- pod install 
    - (installs dependencies in XCode)
- cd ../

- npx react-native run-ios


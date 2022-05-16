/**
 * Main
 */

import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
} from 'react-native';

import { LogInScreen } from './screens/logInScreen'
import { BudgetListScreen } from '../Budgie/screens/budgetListScreen';
import { BudgetScreen } from './screens/budgetScreen'
import { TransactionListScreen } from './screens/transactionListScreen'


import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


//REALM
import BudgetContext from "./models/Budget";
const { useRealm, useQuery, RealmProvider } = BudgetContext;

const App = () => {  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen 
          name="Welcome to Budgie" 
          component={LogInScreen} /> 
        <Stack.Screen
          name="Home"
          component={BudgetListScreen}
        />
        <Stack.Screen 
          name=" " 
          component={BudgetScreen} 
          options={({ route }) => ({ title: route.params.startDate })}/>
      <Stack.Screen 
          name="Transactions" 
          component={TransactionListScreen} 
          options={({ route }) => ({ title: route.params.categoryID})}/>
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};


function AppWrapper() {
  if (!RealmProvider) {
    return null;
  }
  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  );
}

export default AppWrapper;
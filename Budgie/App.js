/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { buttonGrey, negativeSavings } from './budgieColors';


const Budget = ({startDate, spending, saving}) => {
  return (

    <TouchableOpacity onPress={onPress} style={styles.roundedButton}>
      <Text style={styles.importantText}> {startDate} </Text>
      <View style = {{alignContent: 'flex-end', maxWidth: '50%'}}>
        <Text> {spending} </Text>
        <Text> {saving} </Text>
      </View>
    </TouchableOpacity>
  );
}

// const SetBudget = ({startDate, spending, saving}) => {
//   const [startingDate, onChangeText] = React.useState("Useless Text");
//   const [number, onChangeNumber] = React.useState(null);

//   return (
//     <SafeAreaView>
//       <TextInput
//         style={styles.budgetInput}
//         onChangeText={onChangeText}
//         value={text}
//       />
//       <TextInput
//         style={styles.budgetInput}
//         onChangeText={onChangeNumber}
//         value={number}
//         placeholder="useless placeholder"
//         keyboardType="numeric"
//       />
//     </SafeAreaView>
//   );
// }

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [budgetItems, setBudgetItems] = useState([]);

  function handleSetBudgetItems() {
    setBudgetItems([...budgetItems, <Budget/>])
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,

          }}>
          
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.titleText}> Budgets </Text>
            <Button title="ADD" onPress={handleSetBudgetItems} />
          </View>

          <View>
            {/* {budgets.map((budget)=> <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>)} */}
            {
              budgetItems.map((item) => {
                <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>
              })
            }
          </View>
          <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>
          <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>
          <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>
          <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>
          {/* <SetBudget/> */}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  roundedButton: {
    backgroundColor: buttonGrey,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
  },

  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  
  importantText: {
    fontWeight: 'bold',
    maxWidth: '50%',
  },

  budgetInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

function onPress() {
  console.log("Hello")
}

function addBudget() {
  console.log("adding")
}



//   SAMPLE REFERENCE

// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };
 
//   const App: () => Node = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.js</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };



// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;

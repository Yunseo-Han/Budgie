/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  useColorScheme,
  View,
  Modal,
  Pressable,
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

const Stack = createNativeStackNavigator();

   


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
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen 
          name="Budget" 
          component={BudgetScreen} 
          options={({ route }) => ({ title: route.params.startDate })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  //const isDarkMode = useColorScheme() === 'dark';

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
    const backgroundStyle = {
      backgroundColor: Colors.lighter,
    };

    const [budgetItems, setBudgetItems] = useState([]);

    function handleSetBudgetItems() {
      setBudgetItems([...budgetItems, <Budget/>])
    }

    function onPress() {
      navigation.navigate('Budget', {
        startDate : "12/24/2022",
        spending : "$1500",
        saving : "$30",
      })
    }

    function addBudget() {
      console.log("adding")
    }    
    
    return (
      <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle= 'dark-content' />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: Colors.white,

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

const BudgetScreen = ({ navigation, route }) => {

  const Category = ({ title, allocated }) => {
    return(
    <View flexDirection = 'row' justifyContent = 'flex-start' alignContent = 'center'>
        <View style = {styles.listItem}>
          <Text style={styles.importantText}> {title} </Text>
          <View style = {{maxWidth : "50%"}}>
            <Text> {allocated} </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.addButton}>
          <View style = {{flex : 1}}>
            <Text style = {{marginHorizontal : 10, marginVertical : 15}}>ADD</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ModalAddCategory = () => {
    return(
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <View flexDirection = 'row' justifyContent = 'flex-start' alignContent = 'center'>
          <View>
            <Text style={styles.sectionTitle}>New Category</Text>
          </View>
          <TouchableOpacity onPress={() =>setModalVisible(!modalVisible)}>
            <View style = {{alignSelf: 'flex-end'}}>
              <Text  style={styles.sectionTitle}>CLOSE</Text>
            </View>
          </TouchableOpacity>
        </View>
        
              <TouchableOpacity
              style={styles.rowButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    );
  };

  function onPress(){

  }

  function addCategory({title}){
    setModalVisible(!modalVisible)
  };

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };


  const Spending = ({ title, amount, date }) => {
    return( 
      <View style = {styles.roundedButton}>
        <View style = {{flex : 5}}>
        <Text style = {styles.importantText}> {title} </Text>
        <Text> {date} </Text>
        </View>
          <View style = {{flex: 1}}>
            <Text style = {styles.spendingAmount}> {amount} </Text>
          </View>
        </View>
      );
    };

    const [modalVisible, setModalVisible] = useState(false);



  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle='dark-content'/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style = {backgroundStyle}>
      <View style = {{alignContent : 'center'}}>
      <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
          }}
          style={{ 
            width: 200, 
            height: 200,
            alignSelf: 'center'}}
        />
      </View>

      <View style = {{borderTopColor : buttonGrey, borderTopWidth : 2}}>
        <Text style = {styles.sectionText}> Budget Categories </Text>     
        <Category title = "Rent" allocated = "$1500"/>
        <Category title = "Rent" allocated = "$1500"/>
        <Category title = "Rent" allocated = "$1500"/>
        <TouchableOpacity style = {styles.rowButton}>
          <Text onPress={() => {setModalVisible(true)
        }} 
          style = {styles.buttonText}
          >New Category</Text>
        </TouchableOpacity>
      </View>

      <View style = {{borderTopColor : buttonGrey, borderTopWidth : 2, marginHorizontal : 10}}>
        <Text style = {styles.sectionTitle}> New Spendings </Text>    
        <Spending title = "Nordstrom" amount = "$500.00" date = "4/6/2022"/>
        <Spending title = "Best Buy" amount = "$50.00" date = "4/6/2022"/>
        <Spending title = "Target" amount = "$54.00" date = "4/6/2022"/>
      </View>
      <ModalAddCategory/>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    //display: "flex",
   // flexDirection: "row",
   // justifyContent: 'center',
    // alignItems: "center",
    height: "100%",
    //textAlign: "center"
    paddingHorizontal : 10,
    paddingVertical : 20,
  },

  listItem: {
    backgroundColor: buttonGrey,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex : 3,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal : 10,
  },
  roundedButton: {
    backgroundColor: buttonGrey,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

   addButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: buttonGrey,
    marginBottom: 10,
    marginRight : 10,
    height : 60,
    width: 60,
    // marginRight: 10,
  },

  rowButton: {
    backgroundColor: buttonGrey,
    borderRadius: 10,
    marginTop: 20,
    marginBottom : 30,
    paddingHorizontal: 90,
    alignSelf : 'center',
    alignItems : 'stretch',
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

  spendingAmount: {
    fontWeight: 'bold',
    color:'red',
  },

  sectionTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  buttonText:{
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
  },

  sectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical : 10,
    marginHorizontal : 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 35,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  budgetInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});


export default App;


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

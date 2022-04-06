import React, {useState} from 'react';

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


import { buttonGrey } from '../budgieColors';



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

// Screen
export const HomeScreen = ({ navigation }) => {

  const BudgetPreviewButton = ({startDate, spending, saving}) => {
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
      <SafeAreaView>
        <StatusBar barStyle={'dark-content'}/>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
          
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.titleText}> Budgets </Text>
            <Button title="ADD" onPress={handleSetBudgetItems} />
          </View>

          <View>
            {/* {budgets.map((budget)=> <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>)}
            {
              budgetItems.map((item) => {
                <Budget startDate="12/24/2022" spending="$1500" saving="$30"/>
              })
            } */}
          </View>
          <BudgetPreviewButton startDate="12/24/2022" spending="$1500" saving="$30"/>
          {/* <SetBudget/> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



// Components


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
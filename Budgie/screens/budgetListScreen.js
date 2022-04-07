import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

import { buttonGrey, addButtonBlue } from '../budgieColors';
// import DateDatepicer from 'react-native-date-picker'



export const BudgetListScreen = ({ navigation }) => {

  // Use states
  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetContainer, startBudgetContainer] = useState(BudgetContainer)

  

  // Handle functions
  function pressedBudgetPreviewButton() {
    navigation.navigate('Budget', {
      startDate : "12/24/2022",
      spending : "$1500",
      saving : "$30",
    })
  }

  function pressedAddBudgetButton() {
    console.log("adding")
    // setBudgetItems([...budgetItems, <BudgetPreviewButton startDate="12/24/2022" spending="$1500" saving="$30"/>])
    startBudgetContainer(<BudgetContainer/>)
  } 

  

  function handleSetBudget() {
    
  }


  // Components
  const BudgetPreviewButton = ({startDate, spending, saving}) => {
    return (
      <TouchableOpacity onPress={pressedBudgetPreviewButton} style={styles.roundedButton}>
        <Text style={styles.importantText}> {startDate} </Text>
        <View style = {{alignContent: 'flex-end', maxWidth: '50%'}}>
          <Text> {spending} </Text>
          <Text> {saving} </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const BudgetContainer = () => {
    
    const [startingDate, setStartingDate] = React.useState("");
    const [endingDate, setEndingDate] = React.useState("")
    const [budgetLimit, setBudgetLimit] = React.useState(0);

    function pressedCancelBudgetButton() {
      console.log("canceling")
      startBudgetContainer(null)
    }

    return (
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 200, justifyContent: 'center', alignItems: 'center'}}>
      <KeyboardAvoidingView style={styles.setBudgetContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent:'space-between', marginTop: 5}}>
          <Text style={styles.titleText}>Add Budget</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={pressedCancelBudgetButton}>
            <Text>CANCEL</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.textInputTitle} >Budget Limit</Text>
          <TextInput
            style={styles.textInputBox}
            onChangeText={newLimit => setBudgetLimit(newLimit)}
          />
        </View>

        <View>
          <Text style={styles.textInputTitle} >Starting Date</Text>
          <TextInput
            style={styles.textInputBox}
            onChangeText={newDate => setStartingDate(newDate)}
          />
        </View>
        
        <View>
          <Text style={styles.textInputTitle} >Ending Date</Text>
          <TextInput
            style={styles.textInputBox}
            onChangeText={newDate => setEndingDate(newDate)}
          />
        </View>
        
        
        <TouchableOpacity style={styles.addBudgetButton}>
          <Text>Add Budget</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
      </View>
      
    );
  }

    

  return (
    <SafeAreaView>
      <View style={{width: deviceWidth, height: deviceHeight}}>
      <StatusBar barStyle={'dark-content'}/>

        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.titleText}> Budgets </Text>
            {/* <Button title="ADD" style={styles.addButton} onPress={handleSetBudgetItems} /> */}
            <TouchableOpacity style={styles.addButton} onPress={pressedAddBudgetButton}>
              <Text>ADD</Text>
            </TouchableOpacity>
          </View>

          <View>
            {/* list of budget preview buttons go here */}
            {budgetItems}
          </View>

          
        </ScrollView>
        {budgetContainer}
      </View>
      
      
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
  },

  addButton: {
    backgroundColor: addButtonBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 60,
    height: 40,
    marginTop: 10,
    marginRight: 10,
  },

  setBudgetContainer: {
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 350,
    height: 400,
    alignItems: 'center',
    borderRadius: 30,
    borderBottomColor: 'grey',
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    zIndex: 3,
    elevation: 3,
  },


  textInputTitle: {
    marginLeft: 10,
    color: 'grey',
    marginTop: 10,
    alignContent: 'flex-start',
  },

  textInputBox: {
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 1,
    marginTop: 5, 
    paddingHorizontal: 10,
    height: 40,
    width: 300,
  },

  addBudgetButton: {
    backgroundColor: addButtonBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 20,
  },


  cancelButton: {
    backgroundColor: buttonGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 70,
    height: 40,
    marginTop: 10,
    marginRight: 10,
  }

});
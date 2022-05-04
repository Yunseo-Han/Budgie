import React, {useState} from "react";

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

import { buttonGrey, addButtonBlue } from '../budgieColors';
import DatePicker from 'react-native-date-picker';

// REALM
import {useMemo} from 'react';
import BudgetContext, { Budget } from "../models/Budget";




const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

var isStartingDate = false;
var isEndingDate = false;


export const BudgetListScreen = ({ navigation }) => {

  const { useRealm, useQuery, RealmProvider } = BudgetContext;
  const realm = useRealm();
  const result = useQuery("Budget");
  const budgets = useMemo(() => result.sorted("startDate"), [result]);

  // Use states
  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetContainer, startBudgetContainer] = useState(BudgetContainer)
  const currentIdString = "";

  
  function constructor(props) {
    this.onPress = this.onPress.bind(this);
  }

  // REALM
  function handleAddBudget(startDate, endDate, targetSpending) {
    targetSpending = parseFloat(targetSpending);
    realm.write(() => {
      realm.create("Budget", new Budget({startDate, endDate, targetSpending}));
    });

    let i = 1;
    budgets.forEach(element => {
      console.log("Budget " + i);
      console.log(element._id.toString());
      console.log(element.startDate);
      console.log(element.endDate);
      console.log(element.targetSpending);
      console.log("\n");
      i++;
    });
  }



  

  // Handle functions
  function pressedBudgetPreviewButton(idString) {
    console.log(idString);
    navigation.navigate('Budget', {
      idString : ""
    })
  }

  function pressedAddButton() {
    console.log("opening add budget")
    startBudgetContainer(<BudgetContainer/>)
  }   


  // Components
  const BudgetPreviewButton = ({startDate, endDate, spending, saving, idString}) => {
    return (
      <TouchableOpacity onPress={() => pressedBudgetPreviewButton(idString)} style={styles.roundedButton}>
        <Text style={styles.importantText}> {startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString()} </Text>
        <View style = {{alignContent: 'flex-end', maxWidth: '50%'}}>
          <Text> {'$' + spending} </Text>
          <Text> {'$' + saving} </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const BudgetContainer = () => {
    
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [endingDate, setEndingDate] = React.useState(new Date())
    const [budgetLimit, setBudgetLimit] = React.useState(0);
    const [idString, setIdString] = React.useState("DEFAULT_ID_STRING");

    // Date picker data
    const [date, setDate] = useState(new Date())
    // Open date picker
    const [open, setOpen] = useState(false)
    // "Are we setting starting or ending?"" flag



    function pressedCancelBudgetButton() {
      console.log("cancelling")
      startBudgetContainer(null)
    }

    function addNewBudget() {
      console.log(startingDate, endingDate, budgetLimit);
      handleAddBudget(startingDate, endingDate, budgetLimit);
      setBudgetItems([...budgetItems, 
        <BudgetPreviewButton 
          startDate={startingDate} 
          spending={budgetLimit} 
          saving="$0"
          idString={idString}
        />]);
      setStartingDate("");
      setEndingDate("");
      setBudgetLimit("");
      startBudgetContainer(null);
    }

    function addStartingDate() {
      setOpen(true)
      isStartingDate = true
    }

    function addEndingDate() {
      setOpen(true)
      isEndingDate = true
    }

    return (
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 300, justifyContent: 'center', alignItems: 'center'}}>
        <KeyboardAvoidingView style={styles.setBudgetContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent:'space-between', marginTop: 5}}>
            <Text style={styles.titleText}>Add Budget</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={pressedCancelBudgetButton}>
              <Text>CANCEL</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.textInputTitle}>Budget Limit</Text>
            <TextInput
              style={styles.textInputBox}
              keyboardType={'decimal-pad'}
              onChangeText={newLimit => setBudgetLimit(newLimit)}
            />
          </View>

          <View>
            <Text style={styles.textInputTitle} >Starting Date</Text>
            <TouchableOpacity style={styles.textInputBox} onPress={addStartingDate}>
              <Text>{startingDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          
          <View>
            <Text style={styles.textInputTitle} >Ending Date</Text>
            <TouchableOpacity style={styles.textInputBox} onPress={addEndingDate}>
              <Text>{endingDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          
          
          <TouchableOpacity style={styles.addBudgetButton} onPress={addNewBudget} >
            <Text>Add Budget</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
        <DatePicker
          modal
          open={open}
          date={date}
          mode={"date"}
          textColor={addButtonBlue}
          onConfirm={(date) => {
            console.log("**"+date.toLocaleDateString())
            console.log("starting changed:" + isStartingDate)
            console.log("ending changed:" + isEndingDate)
            if (isStartingDate) {
              console.log("changing startingDate")
              setStartingDate(date)
              isStartingDate = false
            } else if (isEndingDate) {
              console.log("changing endingDate")
              setEndingDate(date)
              isEndingDate = false
            } 
            setOpen(false)
            
          }}
          onCancel={() => {
            setOpen(false)
            isStartingDate = false
            isEndingDate = false
          }}
        />
      </View>
      
      
    );
  }


  const SpendingContainer = () => {
    const [spendingName, setSpendingName] = React.useState("");
    const [spending, setSpending] = React.useState(0);
    const [spendingCategory, setSpendingCategory] = React.useState("");

    // outside in screen
    // const [spendingContainer, setSpendingContainer] = useState(SpendingContainer)
    // const [spendingItems, setSpendingItems] = useState([]);
    


    // function addNewSpending() {
    //   setSpendingItems(... spendingItmes, <Spending spendingName, spedflksjd/>)
    //   setSpendingName("")
    //   setSpending(0)
    //   setSpendingCatagory("")
    //   setSpendingContainer(null)
    // }

    

    function pressedCancelSpendingButton() {
      console.log("canceling add spending")
      setSpendingContainer(null)
    }

    

    

    return (
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 400, justifyContent: 'center', alignItems: 'center'}}>
        <KeyboardAvoidingView style={styles.setSpendingContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent:'space-between', marginTop: 5}}>
            <Text style={styles.titleText}>Add Spending</Text>
            <TouchableOpacity style={styles.cancelButton} >
              <Text>CANCEL</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.textInputTitle}>Spending Name</Text>
            <TextInput
              style={styles.textInputBox}
              onChangeText={spendingName => setSpendingName(spendingName)}
            />
          </View>

          <View>
            <Text style={styles.textInputTitle}>Spending Amount</Text>
            <TextInput
              style={styles.textInputBox}
              keyboardType={'decimal-pad'}
              onChangeText={newSpending => setSpending(newSpending)}
            />
          </View>

          <View>
            <Text style={styles.textInputTitle}>Spending Catagory</Text>
            <TextInput
              style={styles.textInputBox}
              onChangeText={spendingCatagory => setSpendingCatagory(spendingCatagory)}
            />
          </View>
          
          
          <TouchableOpacity style={styles.addBudgetButton}>
            <Text>Add Spending</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </View>
      
      
    );
  }


    
  // Screen
  return (
    <SafeAreaView>
      <View style={{width: deviceWidth, height: deviceHeight}}>
      <StatusBar barStyle={'dark-content'}/>

        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.titleText}> Budgets </Text>
            {/* <Button title="ADD" style={styles.addButton} onPress={handleSetBudgetItems} /> */}
            <TouchableOpacity style={styles.addButton} onPress={pressedAddButton}>
              <Text>ADD</Text>
            </TouchableOpacity>
          </View>

          <View>
            {/* list of budget preview buttons go here */}
            {/* remember to delete UI implementation of budgets */}
            {
              budgets.map((item) => (
                <BudgetPreviewButton
                  key={item._id}
                  startDate={item.startDate}
                  endDate={item.endDate}
                  spending={item.targetSpending}
                  saving={item.targetSpending-item.totalSpending}
                  idString={item._id.toString()}
                />
              ))
            }
          </View>

          
        </ScrollView>
        {budgetContainer}
        {/* <SpendingContainer/> */}

        
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
    borderColor: 'grey',
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
    justifyContent: 'center',
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
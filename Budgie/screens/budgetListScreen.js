import React, {useEffect, useState} from "react";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Modal, 
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';

import { buttonGrey, addButtonBlue } from '../budgieColors';
import DatePicker from 'react-native-date-picker';
import Swipeable from 'react-native-swipeable-row';

// REALM
import {useMemo} from 'react';
import BudgetContext, { Budget } from "../models/Budget";
import { ObjectId } from "bson";



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
  // const [budgetContainer, startBudgetContainer] = useState(BudgetContainer)
  const currentIdString = "";


  // Budget Modal
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  
  function constructor(props) {
    this.onPress = this.onPress.bind(this);
  }

  // REALM
  function handleAddBudget(startDate, endDate, targetSpending) {
    targetSpending = parseFloat(targetSpending);
    let newBudget;
    realm.write(() => {
      newBudget = realm.create("Budget", new Budget({startDate, endDate, targetSpending}));
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

  function handleDeleteBudget(idString) {
    let id = ObjectId(idString);
    let budToDel = realm.objects("Budget").filtered("_id == $0", id)[0];
    realm.write(() => {
      realm.delete(budToDel);
    });
  }

  function handleDeleteAll() {
    realm.write(() => {
      // Delete all objects from the realm.
      realm.deleteAll();
    });
  }


  
  // Components
  const BudgetPreviewButton = ({startDate, endDate, spending, saving, idString}) => {

    // Handle functions   ******* used to be outside the component
    function pressedBudgetPreviewButton(idString) {
      navigation.navigate('Budget Details', {
        idString : idString
      });
    }

    const deleteButton = <TouchableHighlight style={styles.deleteButton} onPress ={() => handleDeleteBudget(idString)}><Text style={{paddingLeft: 20}}>Delete</Text></TouchableHighlight>

    return (
      <Swipeable rightButtons={[deleteButton]}>
        <TouchableOpacity onPress={() => pressedBudgetPreviewButton(idString)} style={styles.roundedButton}>
          <Text style={styles.importantText}> {startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString()} </Text>
          <View style = {{alignContent: 'flex-end', maxWidth: '60%'}}>
            <Text> {'Limit: $' + spending.toFixed(2)} </Text>
            <Text> {'Remaining: $' + saving.toFixed(2)} </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }




  const AddNewBudgetModal = () => {
    
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [endingDate, setEndingDate] = React.useState(new Date())
    const [budgetLimit, setBudgetLimit] = React.useState(0);
    const [idString, setIdString] = React.useState("DEFAULT_ID_STRING");

    // Date picker data
    const [date, setDate] = useState(new Date())
    // Open date picker
    const [open, setOpen] = useState(false)
    // "Are we setting starting or ending?"" flag


    function addNewBudget() {
      console.log(startingDate, endingDate, budgetLimit);
      handleAddBudget(startingDate, endingDate, budgetLimit);
      setStartingDate("");
      setEndingDate("");
      setBudgetLimit("");
      setBudgetModalVisible(false);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={budgetModalVisible}> 
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent:'space-between', marginTop: 5}}>
              <Text style={styles.titleText}>Add Budget</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={()=>setBudgetModalVisible(false)}>
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
              if (isStartingDate) {
                setStartingDate(date)
                isStartingDate = false
              } else if (isEndingDate) {
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
        </View>
      </Modal>
    );
  }

    
  // Screen
  return (
    <SafeAreaView>
      <View style={{width: deviceWidth, height: deviceHeight}}>
      <StatusBar barStyle={'dark-content'}/>
        <ScrollView contentInsetAdjustmentBehavior="automatic">

          <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical: 10}}>
            <Text style={styles.titleText}> Budgets </Text>
            <TouchableOpacity style={styles.addButton} onPress={()=>setBudgetModalVisible(true)}>
              <Text>ADD</Text>
            </TouchableOpacity>
          </View>

          <AddNewBudgetModal/>

          <View>
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

        <TouchableOpacity style={styles.addButton} onPress={()=> handleDeleteAll()}>
            <Text>NUKE</Text>
        </TouchableOpacity>

          
        </ScrollView>
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
    maxWidth: '70%',
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
    marginHorizontal: 30,
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  deleteButton: {
    backgroundColor: '#FF6961',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10, 
    width: 200,
    marginRight: 10,
    height: 60,
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // marginBottom: 10,
    // marginHorizontal: 20,
  }
});
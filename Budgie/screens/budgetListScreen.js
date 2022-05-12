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
import ProgressCircle from 'react-native-progress-circle'

// REALM
import {useMemo} from 'react';
import BudgetContext, { Budget } from "../models/Budget";
import { ObjectId } from "bson";



const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

var isStartingDate = false;
var isEndingDate = false;

//var currentlySelectedBudgetId = "DEFAULT_ID_STRING";

export const BudgetListScreen = ({ navigation }) => {
  const { useRealm, useQuery, RealmProvider } = BudgetContext;
  const realm = useRealm();
  const result = useQuery("Budget");
  const budgets = useMemo(() => result.sorted("startDate"), [result]);

  // Use states
  const [budgetItems, setBudgetItems] = useState([]);
  const currentIdString = "";

  // Budget Modal
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  // Edit Budget Modal
  const [editBudgetModalVisible, setEditBudgetModalVisible] = useState(false);
  const [idStringModal, setIdStringModal] = useState("DEFAULT");

  // edit budget modal previous values
  const [prevBudgetLimit, setPrevBudgetLimit] = useState(0);
  const [prevBudgetStartDate, setPrevBudgetStartDate] = useState(new Date());
  const [prevBudgetEndDate, setPrevBudgetEndDate] = useState(new Date());

  
  function constructor(props) {
    this.onPress = this.onPress.bind(this);
  }

  // REALM
  function handleAddBudget(startDate, endDate, targetSpending) {
    targetSpending = parseFloat(targetSpending);
    let newBudget;
    if(targetSpending == "") {
      return;
    }
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

  function pressedEditBudgetButton(idString) {
    let id = ObjectId(idString);
    let budToEdit = realm.objects("Budget").filtered("_id == $0",id)[0];

    setPrevBudgetLimit(budToEdit.targetSpending)
    setPrevBudgetStartDate(budToEdit.startDate)
    setPrevBudgetEndDate(budToEdit.endDate)

    setIdStringModal(idString);
    console.log(idString);
    setEditBudgetModalVisible(true);
  }

  function handleEditBudget(startDate, endDate, targetSpending) {
    let id = ObjectId(idStringModal);
    let budToEdit = realm.objects("Budget").filtered("_id == $0",id)[0];

    realm.write(() => {
      budToEdit.startDate = startDate;
      budToEdit.endDate = endDate;
      let newLimit = parseFloat(targetSpending);
      if(newLimit >= 0 ) {
        budToEdit.targetSpending = newLimit;
      }
    });
    setIdStringModal("RESET");
    setEditBudgetModalVisible(false);
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
      navigation.navigate(' ', {
        idString : idString
      });
    }

    

    const deleteButton = <TouchableHighlight style={styles.deleteButton} onPress ={() => handleDeleteBudget(idString)}>
                          <Text style={{paddingLeft: 20, color: 'white'}}>Delete</Text>
                        </TouchableHighlight>
    const editButton = <TouchableHighlight style={styles.editButton} onPress={() => pressedEditBudgetButton(idString)}>
                          <Text style={{paddingLeft: 25, color: 'white'}}>Edit</Text>
                        </TouchableHighlight>

    function getRemainder(saving) {
      if(saving >= 0) return 'Remaining: $' + saving.toFixed(2);
      else return 'Deficit: $' + (saving).toFixed(2);
    }

    function ProgressCirclePercent() {
      if(saving >= 0) return (spending-saving)/spending*100;
      else return 0;
    }

    return (
      <Swipeable rightButtons={[editButton, deleteButton]}>
        <TouchableOpacity onPress={() => pressedBudgetPreviewButton(idString)} style={styles.roundedButton}>
          <View style={{flexDirection: 'row'}}>
            <ProgressCircle 
              percent={ProgressCirclePercent()}
              radius={15}
              borderWidth={8}
              color="tomato"
              shadowColor="gray"
              bgColor={buttonGrey}
            ></ProgressCircle>
            <Text style={[styles.importantText, {paddingLeft: 10, alignSelf: 'center'}]}> {startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString()} </Text>
          </View>

          <View style={{alignItems: 'flex-end'}}>
            <Text> {'$' + spending.toFixed(2)} </Text>
            {/* <Text> { '' + getRemainder(parseFloat(saving))} </Text> */}
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
    
    const [showWarning, setShowWarning] = React.useState(false);

    // Date picker data
    const [date, setDate] = useState(new Date())
    // Open date picker
    const [open, setOpen] = useState(false)
    // "Are we setting starting or ending?"" flag




    function addNewBudget() {
      
      handleAddBudget(startingDate, endingDate, budgetLimit);
      

      setStartingDate("");
      setEndingDate("");
      setBudgetLimit(0);
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
              <Text style={styles.sectionTitle}>New Budget</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={()=>setBudgetModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>

            {showWarning? <Text style={{color: 'tomato'}}>Wrong Input. Try again.</Text>: null}

            <View>
              <Text style={styles.textInputTitle}>Budget Limit</Text>
              <TextInput
                style={styles.textInputBox}
                keyboardType={'decimal-pad'}
                onChangeText={newLimit => setBudgetLimit(newLimit)}
              />
            </View>

            <View>
              <Text style={styles.textInputTitle } >Starting Date</Text>
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
              <Text>Submit</Text>
            </TouchableOpacity>

          </KeyboardAvoidingView>
          <DatePicker
            modal
            open={open}
            date={date}
            mode={"date"}
            textColor={'#6495ED'}
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

  

  const EditBudgetModal = () => {
    
    const [startDate, setStartingDate] = React.useState(prevBudgetStartDate);
    const [endDate, setEndingDate] = React.useState(prevBudgetEndDate)
    const [editBudgetLimit, setEditBudgetLimit] = React.useState(prevBudgetLimit);

    // const budId = ObjectId(idStringModal); // react has a problem with this code?? maybe it doesnt pass in string?
    // const budToEdit = realm.objects("Budget").filtered("_id == $0",budId)[0];

    // Date picker data
    const [date, setDate] = useState(new Date())
    // Open date picker
    const [open, setOpen] = useState(false)
    // "Are we setting starting or ending?"" flag


    function pressedSubmitEditBudget() {
      handleEditBudget(startDate, endDate, editBudgetLimit);
      setStartingDate("");
      setEndingDate("");
      setEditBudgetLimit(0);
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
        visible={editBudgetModalVisible}> 
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent:'space-between', marginTop: 5}}>
              <Text style={styles.sectionTitle}>Edit Budget</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={()=>setEditBudgetModalVisible(false)}>
                <Text>Cancl</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.textInputTitle}>Budget Limit</Text>
              <TextInput
                style={styles.textInputBox}
                keyboardType={'decimal-pad'}
                onChangeText={newLimit => setEditBudgetLimit(newLimit)}
                value={editBudgetLimit.toString()}
              />
            </View>

            <View>
              <Text style={styles.textInputTitle} >Starting Date</Text>
              <TouchableOpacity style={styles.textInputBox} onPress={addStartingDate}>
                <Text>{startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            
            <View>
              <Text style={styles.textInputTitle} >Ending Date</Text>
              <TouchableOpacity style={styles.textInputBox} onPress={addEndingDate}>
                <Text>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            
            
            <TouchableOpacity style={styles.addBudgetButton} onPress={pressedSubmitEditBudget} >
              <Text>Submit</Text>
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
    <SafeAreaView style={[styles.container, {backgroundColor: 'white'}]}>
      <StatusBar barStyle={'dark-content'}/>
        <ScrollView contentInsetAdjustmentBehavior="automatic">

          <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical: 10}}>
            <Text style={styles.titleText}> Budgets </Text>
            
          </View>

          <AddNewBudgetModal/>
          <EditBudgetModal/>
          

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

        <TouchableOpacity style={{backgroundColor: 'gray', opacity: 0.4, paddingVertical: 10, marginTop: 100}} onPress={()=> handleDeleteAll()}>
            <Text>NUKE</Text>
        </TouchableOpacity>

          
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={()=>setBudgetModalVisible(true)}>
          <Text style={{fontSize: 30, color: 'white'}}>+</Text>
        </TouchableOpacity>
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
    // maxWidth: '70%',
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
      alignSelf: 'flex-end',
      bottom: 30,
      right: 30,
      borderRadius: 30,
      width: 60,
      height: 60,
      position: 'absolute',
      opacity: 0.92,
      shadowColor: 'rgba(0,0,0, .8)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 0.5, // IOS
      shadowRadius: 4, //IOS
      elevation: 2, // Android
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

  container: {
    height: "100%",
    paddingHorizontal : 10,
    paddingVertical : 20,
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
    backgroundColor: 'tomato',
    width: 200,
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 0.5, // IOS
        shadowRadius: 4, //IOS
        elevation: 2, // Android
  }, 

  editButton: {
    backgroundColor: 'orange',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10, 
    width: 200,
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',

    shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 0.5, // IOS
        shadowRadius: 4, //IOS
        elevation: 2, // Android
  }, 

  sectionTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
import React, {Component, useState} from 'react';
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
    KeyboardAvoidingView,
    TextInput,
  } from 'react-native';

  import { buttonGrey, addButtonBlue } from '../budgieColors';
  import { Dimensions } from "react-native";

  //REALM
import {useMemo} from 'react';
import BudgetContext, { Budget, Category } from "../models/Budget";
import { ObjectId } from "bson";

const screenWidth = Dimensions.get("window").width;




export const TransactionListScreen = ({ navigation, route }) => {

    // const [spendingContainer, setSpendingContainer] = useState(SpendingContainer)
    const [spendingItems, setSpendingItems] = useState([]);

    
    
    const {catIdString} = route.params;

    
    // add spending modal 
    const [spendingModalVisible, setSpendingModalVisible] = useState(false);
   
    const screenWidth = Dimensions.get("window").width;


    //REALM
    const { useRealm, useQuery, RealmProvider } = BudgetContext;
    const realm = useRealm();

    const catID = ObjectId(catIdString);
    const currentCat = realm.objects("Category").filtered("_id == $0", catID)[0];


    function transactionsExist() {
      if(currentCat.transactions.length > 0) {
        return true;
      }
      return false;
    }

    const Spending = ({ title, amount, date }) => {
      return( 
          <View style = {styles.roundedButton}>
            <View style = {{alignContent: 'flex-start', maxWidth: '70%'}}>
              <Text style = {{fontWeight: 'bold'}}> {title} </Text>
              <Text> {date.toLocaleDateString()} </Text>
            </View>

            <View style = {{alignContent: 'flex-end', maxWidth: '30%'}}>
              <Text style = {styles.spendingAmount}> ${amount} </Text>
            </View>
          </View>
        );
      };
      const ModalAddSpending = () => {
        const [spendingName, setSpendingName] = React.useState("");
        const [spending, setSpending] = React.useState(0);
        const [date, setDate] = React.useState(new Date());
        const [amount, setAmount] = React.useState(0);
        
        //TODO: Add Transaction to currentCat.transactions list (based on budgetListScreen)
        function handleAddTransaction(spendingName, date, amount) {
          let newTrans;
          realm.write(() => {
            newTrans = realm.create("Transaction", new Transaction({spendingName, date, amount}));
          });
        }

        //TODO: Add Transaction to currentCat.transactions list (based on BudgetListScreen)
        function addTransaction(){
          handleAddTransaction(spendingName, date, amount);
          setSpendingName("");
          setDate("");
          setAmount("");
          setSpendingModalVisible(false);
        }

        return (
          <Modal
          animationType="slide"
          transparent={true}
          visible={spendingModalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent:'space-between', marginTop: 5}}>
                    <Text style={styles.sectionTitle}>New Spending</Text>
                    <TouchableOpacity style={styles.cancelButton} onPress={() =>setSpendingModalVisible(false)}>
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
        
                  {/* TODO: ONPRESS TO ADD TO DATABASE HERE, go to problem at addTransaction */}
                  <TouchableOpacity style={styles.addBudgetButton} onPress={addTransaction}>
                    <Text>Add Spending</Text>
                  </TouchableOpacity>
        
              </View>
            </View>
          </Modal>

        );
      }


    return(
      <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle='dark-content'/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">

      
      <View style = {{paddingVertical : 20}}>
        <View styles = {{flexDirection : 'row', justifyContent:'space-between'}}>
          <Text style = {styles.sectionText}> {currentCat.name} Transactions</Text>  
            <TouchableOpacity onPress={() =>setSpendingModalVisible(true)} style={styles.addButton}>
              <View style={styles.centerAddSymbol}>
                <Text style={styles.plusSymbol}>+</Text>
              </View>
            </TouchableOpacity>
        </View>
        <View>
          {
              currentCat.transactions.map((item) => (
                <Spending
                  key = {item._id}
                  title = {item.name}
                  date = {item.date}   
                  amount = {item.amount}
                />
              ))
          }
        </View>
        
      </View>

      
      
      <ModalAddSpending/>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal : 10,
    paddingVertical : 20,
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

  spendingAmount: {
    fontWeight: 'bold',
    color:'red',
  },

  addCategoryButton: {
    backgroundColor: addButtonBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 20,
    marginHorizontal: 50,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    maxWidth: '70%',
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

  sectionTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
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

sectionText: {
  fontSize: 20,
  fontWeight: 'bold',
  marginVertical : 10,
  marginHorizontal : 10,
},

addButton: {
  borderRadius: 20,
  borderWidth: 2,
  borderColor: buttonGrey,
  marginBottom: 10,
  marginRight : 10,
  height : 50,
  width: 50,
  // marginRight: 10,
},

centerAddSymbol: {
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1
},

plusSymbol:{
  fontSize: 30,
  color: 'grey',
  // fontWeight: 'bold',
  // paddingVertical: 10,
},

});
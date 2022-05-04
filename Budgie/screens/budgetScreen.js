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

export const BudgetScreen = ({ navigation, route }) => {

    const [spendingContainer, setSpendingContainer] = useState(SpendingContainer)
    const [spendingItems, setSpendingItems] = useState([]);
    

    const [categoryName, setCategoryName] = React.useState("");

    const {idString} = route.params;
    

    function pressedAddSpending() {
        setSpendingContainer(<SpendingContainer/>)
    }

    // function addNewSpending() {
    //   setSpendingItems(... spendingItmes, <Spending spendingName, spedflksjd/>)
    //   setSpendingName("")
    //   setSpending(0)
    //   setSpendingCatagory("")
    //   setSpendingContainer(null)
    // }

    function handleAddCategory() {
      setModalVisible(!modalVisible);
      let name = categoryName;
      console.log(name);
      // CHECK THIS
      let currentBudget = budgets.filtered('_id == ${idString}');
      let newCat;
      realm.write(() => {
        newCat = realm.create("Category", new Category({name}));
        currentBudget.categories.push(newCat);
      });
      console.log(newCat);
      console.log(currentBudget.categories);

      let i = 1;
      budgets.forEach(element => {
        console.log("Budget " + i);
        console.log(element._id.toString());
        console.log(element.startDate);
        console.log(element.endDate);
        console.log(element.targetSpending);
        console.log(element.categories);
        console.log("\n");
        i++;
      });
    }

    function addCategory({title}){
      setModalVisible(!modalVisible);
    };


    // Components
    const Category = ({ title, allocated }) => {
        return(
        <View flexDirection = 'row' justifyContent = 'flex-start' alignContent = 'center'>
            <View style = {styles.listItem}>
              <Text style={styles.importantText}> {title} </Text>
              <View style = {{maxWidth : "50%"}}>
                <Text> {allocated} </Text>
              </View>
            </View>
            <TouchableOpacity onPress={pressedAddSpending} style={styles.addButton}>
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
              <View>
                <Text  style={styles.cancelButton}>CLOSE</Text>
              </View>
            </TouchableOpacity>
            
          </View>
            <TextInput 
              style={styles.textInputBox}
              onChangeText={newName => setCategoryName(newName)}
            />
              <TouchableOpacity
                style={styles.rowButton}
                onPress={handleAddCategory}
                >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      );
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
  
  
    const SpendingContainer = () => {
        const [spendingName, setSpendingName] = React.useState("");
        const [spending, setSpending] = React.useState(0);
        const [spendingCatatory, setSpendingCatagory] = React.useState("");
        
    
        function pressedCancelSpendingButton() {
          console.log("canceling add spending")
          setSpendingContainer(null)
        }
    
        return (
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 200, justifyContent: 'center', alignItems: 'center'}}>
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
                <Text style={styles.textInputTitle}>Spending Category</Text>
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
    return(
        <SafeAreaView style={[styles.container]}>
        <StatusBar barStyle='dark-content'/>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
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
      {spendingContainer}
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
    },

    setSpendingContainer: {
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
  });
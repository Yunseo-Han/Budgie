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

import PieChart from 'react-native-pie-chart';

import { buttonGrey, addButtonBlue } from '../budgieColors';
import { ObjectId } from "bson";

import { Dimensions } from "react-native";


export const BudgetScreen = ({ navigation, route }) => {

    // const [spendingContainer, setSpendingContainer] = useState(SpendingContainer)
    const [spendingItems, setSpendingItems] = useState([]);
    
  
    const {idString} = route.params;

    // add catagory modal 
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    // add spending modal 
    const [spendingModalVisible, setSpendingModalVisible] = useState(false);
   
    const screenWidth = Dimensions.get("window").width;

    

    // function pressedAddSpending() {
    //     setSpendingContainer(<SpendingContainer/>)
    // }

    // function addNewSpending() {
    //   setSpendingItems(... spendingItmes, <Spending spendingName, spedflksjd/>)
    //   setSpendingName("")
    //   setSpending(0)
    //   setSpendingCatagory("")
    //   setSpendingContainer(null)
    // }

    function handleAddCategory() {
      console.log("HERE!");
      return;
      // setModalVisible(!modalVisible);
      // let name = categoryName.trim();
      // if(name == "") {
      //   return;
      // }
      // console.log(name);
      // // CHECK THIS
      // let id = ObjectId(idString);
      // let currentBudget = budgets.filtered("_id == $0", id);
      // let newCat;
      // realm.write(() => {
      //   newCat = realm.create("Category", new Category({name}));
      //   currentBudget.categories.push(newCat);
      // });
      // console.log(newCat);
      // console.log(JSON.stringify(currentBudget.categories));

      // let i = 1;
      // budgets.forEach(element => {
      //   console.log("Budget " + i);
      //   console.log(element._id.toString());
      //   console.log(element.startDate);
      //   console.log(element.endDate);
      //   console.log(element.targetSpending);
      //   console.log(element.categories);
      //   console.log("\n");
      //   i++;
      // });
    }

    function addCategory({title}){
      setModalVisible(!modalVisible);
    };


    // Components
    const CategorySummary = ({ title, allocated, spent}) => {
        return(
        <View flexDirection = 'row' justifyContent = 'flex-start' alignContent = 'center'>
            <View style = {styles.listItem}>
              <Text style={styles.importantText}> {title} </Text>
              <View style = {{alignContent: 'flex-end', maxWidth: '30%'}}>
                <Text>{allocated} </Text>
                <Text>{spent}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() =>setSpendingModalVisible(true)} style={styles.addButton}>
              <View style={styles.centerAddSymbol}>
                <Text style={styles.plusSymbol}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      };

    const ModalAddCategory = () => {
      // category name iput 
      const [categoryInput, setCatagoryInput] = React.useState("");
      const [categoryLimitInput, setCatagoryLimitInput] = React.useState("");


      return(
        <Modal
          animationType="slide"
          transparent={true}
          visible={categoryModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View flexDirection = 'row' justifyContent = 'space-between' alignContent = 'center'>

                <Text style={styles.sectionTitle}>New Category</Text>
                <TouchableOpacity style={styles.cancelButton} onPress={() =>setCategoryModalVisible(false)}>
                  <View>
                    <Text>CLOSE</Text>
                  </View>
                </TouchableOpacity>

              </View>


              <Text style={styles.textInputTitle}>Category Name</Text>
              <TextInput 
                style={styles.textInputBox}
                onChangeText={setCatagoryInput}
                value={categoryInput}
              />

              <Text style={styles.textInputTitle}>Category Spending Limit</Text>
              <TextInput 
                style={styles.textInputBox}
                onChangeText={setCatagoryLimitInput}
                value={categoryLimitInput}
              />

              <TouchableOpacity
                style={styles.addBudgetButton}
                onPress={handleAddCategory}>
                <Text>Add Category</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      );
    };
  
    
    const Spending = ({ title, amount, date }) => {
      return( 
          <View style = {styles.roundedButton}>
            <View style = {{alignContent: 'flex-start', maxWidth: '70%'}}>
              <Text style = {{fontWeight: 'bold'}}> {title} </Text>
              <Text> {date} </Text>
            </View>

            <View style = {{alignContent: 'flex-end', maxWidth: '30%'}}>
              <Text style = {styles.spendingAmount}> {amount} </Text>
            </View>
          </View>
        );
      };
  
      
  
  
    const ModalAddSpending = () => {
        const [spendingName, setSpendingName] = React.useState("");
        const [spending, setSpending] = React.useState(0);
        const [spendingCatatory, setSpendingCatagory] = React.useState("");
        

    
    
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
        
              </View>
            </View>
          </Modal>
        );
      }
      

    // Screen
    const widthAndHeight = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#D8F3DC','#B7E4C7','#95D5B2', '#74C69D', '#52B788']
    
    return(
        <SafeAreaView style={[styles.container]}>
        <StatusBar barStyle='dark-content'/>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
        <View style = {{alignItems : 'center'}}>
        {/* <Image
            source={{
              uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
            }}
            style={{ 
              width: 200, 
              height: 200,
              alignSelf: 'center'}}
          /> */}
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            doughnut={true}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View>
  
        <View style = {{borderTopColor : buttonGrey, borderTopWidth : 2}}>
          <Text style = {styles.sectionText}> Budget Categories </Text>     
          <CategorySummary title = "Rent" allocated = "$1500"/>
          <CategorySummary title = "Rent" allocated = "$1500"/>
          <CategorySummary title = "Rent" allocated = "$1500"/>
          <TouchableOpacity style = {styles.addCategoryButton} onPress={() => {setCategoryModalVisible(true)}} >
            <Text style={styles.importantText}>New Category</Text>
          </TouchableOpacity>
        </View>
  
        <View style = {{borderTopColor : buttonGrey, borderTopWidth : 2, marginHorizontal : 10}}>
          <Text style = {styles.sectionTitle}> New Spendings </Text>    
          <Spending title = "Nordstrom" amount = "$500.00" date = "4/6/2022"/>
          <Spending title = "Best Buy" amount = "$50.00" date = "4/6/2022"/>
          <Spending title = "Target" amount = "$54.00" date = "4/6/2022"/>
          <TouchableOpacity style = {styles.addCategoryButton} onPress={() => {setSpendingModalVisible(true)}} >
            <Text style={styles.importantText}>New Spending</Text>
          </TouchableOpacity>
        </View>
        <ModalAddCategory/>
        <ModalAddSpending/>
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
      borderRadius: 20,
      borderWidth: 2,
      borderColor: buttonGrey,
      marginBottom: 10,
      marginRight : 10,
      height : 50,
      width: 50,
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
      
  });
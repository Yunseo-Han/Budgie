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
    TouchableHighlight,
    Button,
    KeyboardAvoidingView,
    TextInput,
  } from 'react-native';

import PieChart from 'react-native-pie-chart';
import { buttonGrey, addButtonBlue } from '../budgieColors';
import { Dimensions } from "react-native";
import Swipeable from 'react-native-swipeable-row';


//REALM
import {useMemo} from 'react';
import BudgetContext, { Budget, Category, Transaction } from "../models/Budget";
import { ObjectId } from "bson";

const screenWidth = Dimensions.get("window").width;

export const BudgetScreen = ({ navigation, route }) => {
    
    const {idString} = route.params;

    // add category modal 

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const screenWidth = Dimensions.get("window").width;

    //REALM
    const { useRealm, useQuery, RealmProvider } = BudgetContext;
    const realm = useRealm();

    const id = ObjectId(idString);
    const currentBudget = realm.objects("Budget").filtered("_id == $0", id)[0];

    // Using result for creating Legend
    const result = useQuery("Budget").filtered("_id == $0", id)[0].categories;

    function transactionsExist() {
      if(currentBudget.categories.some(e => e.transactions.length > 0)) {
        return true;
      }
      return false;
    }

    function constructor(props) {
      this.onPress = this.onPress.bind(this);
    }

    function handleAddCategory(nameInput, limitInput) {
      setCategoryModalVisible(false);
      let name = nameInput.trim();
      let limit = parseFloat(parseFloat(limitInput).toFixed(2));
      // Don't think it'll reach the error checking if parseFloat fails, 
      // but whatever, I'm leaving it here anyway
      if(isNaN(limit)) {
        console.log("Spending limit is not a number");
        return;
      } else if(limit < 0) {
        console.log("Spending limit must be greater than 0.");
        return;
      }
      if(name == "") {
        console.log("Every category must be given a name.");
        return;
      }
      if(currentBudget.categories.some(e => e.name === name)) {
        console.log("A category using with that name already exists.");
        return;
      }
      let newCat;
      realm.write(() => {
        newCat = realm.create("Category", new Category({name: name, spendingLimit: limit}));
        currentBudget.categories.push(newCat);
      });
    }

    function handleEditCategory(catIdString, newName, newLimit) {
      let id = ObjectId(catIdString);
      let catToEdit = realm.objects("Category").filtered("_id == $0", id)[0];
      realm.write(() => {
        catToEdit.name = newName;
        catToEdit.spendingLimit = newLimit;
      });
    }

    function handleDeleteCategory(catIdString) {
      let id = ObjectId(catIdString);
      let catToDel = realm.objects("Category").filtered("_id == $0", id)[0];
      let currentCatSum = catToDel.transactionSum;
      realm.write(() => {
        currentBudget.totalSpending = currentBudget.totalSpending - currentCatSum;
        realm.delete(catToDel);
      });
    }

    const ModalAddCategory = () => {
      // category name input 

      const [categoryInput, setCategoryInput] = React.useState("");
      const [categoryLimitInput, setCategoryLimitInput] = React.useState("");
      
      function pressedSubmitNewCategory() {
        handleAddCategory(categoryInput, categoryLimitInput);
        setCategoryInput("");
        setCategoryLimitInput("");
        setCategoryModalVisible(false);
      }


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
                onChangeText={setCategoryInput}
                value={categoryInput}
              />

              <Text style={styles.textInputTitle}>Category Spending Limit</Text>
              <TextInput 
                style={styles.textInputBox}
                onChangeText={setCategoryLimitInput}
                value={categoryLimitInput}
                keyboardType={'decimal-pad'}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={pressedSubmitNewCategory}>
                <Text>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      );
    };
  
    //Legend go to transactionListScreen when clicked on
    function pressedLegendButton(catIdString) {
      navigation.navigate('Transactions', {
        catIdString : catIdString,
        budIdString: idString
      })
    }

  const Legend = ({ title, amount, limit, color, index, catIdString }) => {

    //Set bar to full if over budget
    function isOverBudgetWidth(){
      if (amount >= limit) return 0.5*screenWidth;
      else return (amount/limit)*(0.5*screenWidth);
    }

    //Set dollar amount WORD to red if over budget
    function isOverBudgetColor(){
      if (amount >= limit) return 'red';
      else return 'green';
    }

    const deleteButton = <TouchableHighlight style={styles.deleteButton} onPress ={() => handleDeleteCategory(catIdString)}>
                            <Text style={{paddingLeft: 23, color: 'white'}}>Delete</Text>
                          </TouchableHighlight>

    // ADD ONPRESS LATER*****************
    const editButton = <TouchableHighlight style={styles.editButton}>
                      <Text style={{paddingLeft: 25, color: 'white'}}>Edit</Text>
                    </TouchableHighlight>    

    return( 
      <View >
      <Swipeable rightButtons={[editButton, deleteButton]}> 
      <View style = {[styles.legendBox]}>
        <TouchableOpacity style={{flexDirection: 'row', justifyContent:'space-between'}} onPress={()=>pressedLegendButton(catIdString)}>

        

        {/* <View style={{flexDirection: 'row', alignContent:'space-between'}}> */}

          <View style = {{paddingLeft: 4}}>
            <Text style = {{fontWeight : 'bold', color: 'black', paddingBottom:7}}> {title} </Text>
            <View style = {{flexDirection : 'row'}}>
              <Text style = {{ fontWeight: 'bold', color : isOverBudgetColor()}}>{"$" + amount.toFixed(2)} </Text>
              <Text style = {{ color:'grey'}}>{"/ $" + limit}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginRight: 10}}>
            <View style = {[styles.bar, {backgroundColor : color}, {width : isOverBudgetWidth()}]} />
            <View style = {[styles.bar, {backgroundColor : buttonGrey}, {width : (0.5*screenWidth) - isOverBudgetWidth()}]}/>
          </View>


        {/* </View> */}

        </TouchableOpacity>
        
      </View>
      </Swipeable>
      <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, margin: 10, borderBottomWidth: 2, opacity: 0.1}} />
      </View>
      
    );
  };
  


//PIE CHART AND LEGEND CATEGORIES STUFF
    const widthAndHeight = 250  //pie chart size

    //Default settings: pie chart is grey when no categories or spending
    const defaultNum = [100]    
    const defaultColor = [buttonGrey]

    //These arrays is what the chart is based on
    const series = []
    const sliceColor = ['#D8F3DC','#B7E4C7','#95D5B2', '#74C69D', '#52B788', 
                        '#00A36C', '#478778', '#C1E1C1', '#9FE2BF', '#008080']

    
    function transactionsExist(){
      if(currentBudget.categories.some(e => e.transactions.length > 0)) {
        return true;
      }
      return false;
    }

    //for pie chart COLORS
    function setSliceColor(){
      if (currentBudget.categories.length == 0) return defaultColor;
      if (!transactionsExist()) return defaultColor;
      else{
        return sliceColor.slice(0, currentBudget.categories.length); //series and sliceColor must be same size for pie chart to work
      } 
    }

    //For pie chart slice
    function setSlice(){
      if (currentBudget.categories.length == 0) return defaultNum;
      if (!transactionsExist()) return defaultNum;
      else {
        currentBudget.categories.forEach( (e) => {series.push(parseFloat(e.transactionSum.toFixed(2)));});
        return series;
      }
    }

    //Set legend category bar to red when over budget
    function setBarColor(index) {
      if (currentBudget.categories[index].transactionSum >= currentBudget.categories[index].spendingLimit) return '#FF0000'; 
      else return sliceColor[index];
    }

    function getTotalSpendingColor() {
      if (currentBudget.targetSpending-currentBudget.totalSpending>0) {
        return 'grey'
      } else {
        return 'red'
      }
    }
    
    // Screen
    return(
        <SafeAreaView style={[styles.container, {backgroundColor: 'white'}]}>
        <StatusBar barStyle='dark-content'/>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.startDateText}>{currentBudget.startDate.toLocaleDateString('en-us',{month:'short', day: 'numeric', year:'numeric'})} -</Text>
            <Text style={styles.endDateText}> {currentBudget.endDate.toLocaleDateString('en-us',{month:'short', day: 'numeric', year:'numeric'})}</Text>
          </View>

          <View>
            <Text style={{alignSelf: 'flex-end', marginRight: 20, color: getTotalSpendingColor()}}>{'$' + currentBudget.totalSpending + ' /'}</Text>
            <Text style={[styles.budgetText, {marginRight: 10, alignSelf: 'flex-start'}]}>{'$' + currentBudget.targetSpending}</Text>
          </View>
        </View>

        {/* PIE CHART */}
        <View style = {{alignItems : 'center', paddingVertical : 10}}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series = {setSlice()} //setSlice()
            sliceColor = {setSliceColor()} //setSliceColor()
            doughnut={true}
            coverRadius={0.45}
            coverFill='white'
          />
        </View>

      {/* BUDGET CATEGORIES */}
        <View style = {{paddingVertical : 20}}>
        <Text style = {styles.sectionText}>Categories </Text>  

        <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, margin: 10, borderBottomWidth: 2, opacity: 0.1}} />

        <View>
          {
              result.map((item, index) => (
                <Legend
                  key={item._id}
                  title = {item.name}
                  amount = {item.transactionSum}    //item.transactionSum
                  limit = {item.spendingLimit}     //item.spendingLimit 
                  color = {setBarColor(index)}    //TODO: fix setBarColor->'undefined' error
                  index = {index}
                  catIdString = {item._id.toString()}
                />
              ))
          }
        </View>

          {/* NEW CATEGORY BUTTON */}
          <TouchableOpacity style = {styles.addCategoryButton} onPress={() => {setCategoryModalVisible(true)}}>
            <Text>New Category</Text>
          </TouchableOpacity>
        </View>

        {/* REMOVED SPENDING STUFF commented for reference*/}
        {/* <View style = {{borderTopColor : buttonGrey, borderTopWidth : 2, marginHorizontal : 10}}>
          <Text style = {styles.sectionTitle}> New Spendings </Text>    
          <Spending title = "Nordstrom" amount = "$500.00" date = "4/6/2022"/>
          <Spending title = "Best Buy" amount = "$50.00" date = "4/6/2022"/>
          <Spending title = "Target" amount = "$54.00" date = "4/6/2022"/>
          <TouchableOpacity style = {styles.addCategoryButton} onPress={() => {setSpendingModalVisible(true)}} >
            <Text style={styles.buttonText}>New Spending</Text>
          </TouchableOpacity>
        </View> */}

        <ModalAddCategory/>
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

    bar : {
      height : 40,  // 24 before
      // borderBottomRightRadius: 20, 
      // borderTopRightRadius: 20
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

    legendBox: {
      // flexDirection: 'row',
      // alignItems: 'space-between',
      paddingVertical : 4,
      paddingHorizontal : 10,
      // maxWidth : "100%"
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
      fontSize: 15,
      fontWeight: 'bold',
      paddingVertical: 5,
    },
  
    sectionText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical : 10,
      marginHorizontal : 10,
      color: 'black',
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
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 0.5, // IOS
        shadowRadius: 4, //IOS
        elevation: 2, // Android
      },

      submitButton: {
        backgroundColor: addButtonBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginVertical: 20,
        marginHorizontal: 50,
      },

      deleteButton: {
        backgroundColor: 'tomato',
        width: 300,
        height: 50,
        
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
        height: 50,
        
        justifyContent: 'center',
        alignItems: 'flex-start',
        
        shadowColor: 'rgba(0,0,0, .4)', // IOS
            shadowOffset: { height: 1, width: 1 }, // IOS
            shadowOpacity: 0.5, // IOS
            shadowRadius: 4, //IOS
            elevation: 2, // Android
      }, 

      endDateText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 20,
      },

      startDateText: {
        paddingLeft: 18,
      },

      budgetText: {
        fontSize: 20,
        fontWeight: 'bold',
        // marginVertical : 10,
        // marginHorizontal : 10,
        color: 'black',
      },
      
  });
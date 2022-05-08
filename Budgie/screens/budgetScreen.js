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
import { Dimensions } from "react-native";

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

    function transactionsExist() {
      let id = ObjectId(idString);
      let currentBudget = realm.objects("Budget").filtered("_id == $0", id)[0];
      if(currentBudget.categories.some(e => e.transactions.length > 0)) {
        return true;
      }
      return false;
    }

    function constructor(props) {
      this.onPress = this.onPress.bind(this);
    }

    //TODO: Sometimes transactionSum gives really long decimal places (fix it to 2)
    function populateCategories(numTxs) {
      console.log("\n", JSON.stringify(currentBudget.categories), "\n");
      currentBudget.categories.forEach((e) => {
        let total = 0;
        realm.write(() => {
          for(let i = 0; i < numTxs; i++) {
            let ranamt = parseFloat((Math.random() * 100.00).toFixed(2));
            e.transactions.push(realm.create("Transaction", new Transaction({
              name: "test", 
              date: new Date(), 
              amount: ranamt
            })));
            total += ranamt;
          }
        });
        realm.write(() => {
          e.transactionSum = total;
        });
      });
    }


    const ModalAddCategory = () => {
      // category name input 

      const [categoryInput, setCategoryInput] = React.useState("");
      
      const [categoryLimitInput, setCategoryLimitInput] = React.useState("");

      function handleAddCategory() {
        setCategoryModalVisible(false);
        let name = categoryInput.trim();
        //let limit = categoryLimitInput;
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
          newCat = realm.create("Category", new Category({name: name, spendingLimit: parseFloat(categoryLimitInput)}));  //TODO: implement spendingLimit
          currentBudget.categories.push(newCat);
        });

        populateCategories(10);
      }
      
      function pressedSubmitNewCategory() {
        handleAddCategory();
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
              />

              <TouchableOpacity
                style={styles.addCategoryButton}
                onPress={pressedSubmitNewCategory}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      );
    };
  
    //Legend go to transactionListScreen when clicked on
      function pressedLegendButton(catIdString) {
        console.log(catIdString);
        navigation.navigate('Transactions', {
          catIdString : catIdString
        })
      }

      const Legend = ({ title, amount, limit, color, index, catIdString }) => {

        //Set bar to full if over budget
        function isOverBudgetWidth(){
          if (amount >= limit) return 0.6*screenWidth;
          else return (amount/limit)*(0.6*screenWidth);
        }

        //Set dollar amount WORD to red if over budget
        function isOverBudgetColor(){
          if (amount >= limit) return 'red';
          else return 'green';
        }

        return( 
          <View style = {[styles.legendBox, {alignContent: 'center'}]}>
            <TouchableOpacity style = {{flexDirection : 'row'}}  onPress={()=>pressedLegendButton(catIdString)}>
            <View style = {[styles.bar, {backgroundColor : color}, 
              {width : isOverBudgetWidth()}]}></View>
            
            <View style = {[styles.bar, {backgroundColor : buttonGrey}, 
              {width : (0.6*screenWidth) - isOverBudgetWidth()}]}></View>
            </TouchableOpacity>
            
              <View style = {{paddingLeft : 10}}>
                <View style = {{width : 0.5 * screenWidth}}>
                  <Text style = {{fontWeight : 'bold', maxWidth: '60%'}}> {title} </Text>
                  <View style = {{flexDirection : 'row'}}>
                    <Text style = {{ fontWeight: 'bold', color : isOverBudgetColor()}}> {"$" + amount.toFixed(2)} </Text>
                    <Text style = {{ paddingLeft : 0, color:'grey'}}> {"/ $" + limit} </Text>
                </View>
                </View>
            </View>
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
        currentBudget.categories.forEach( (e) => {series.push(e.transactionSum);});
        console.log(series);
        return series;
      }
    }

    //Set legend category bar to red when over budget
    function setBarColor(index) {
      console.log(currentBudget.categories.spendingLimit);    //TODO: getting 'undefined' for both spendingLimit and transactionSum, cannot do comparison
      if (currentBudget.categories.transactionSum >= currentBudget.categories.spendingLimit) return '#FF0000'; 
      else return sliceColor[index];
    }
    
    

     // Screen
    return(
        <SafeAreaView style={[styles.container]}>
        <StatusBar barStyle='dark-content'/>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
        
        {/* PIE CHART */}
        <View style = {{alignItems : 'center', paddingVertical : 10}}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series = {setSlice()} //setSlice()
            sliceColor = {setSliceColor()} //setSliceColor()
            doughnut={true}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View>

      {/* BUDGET CATEGORIES */}
        <View style = {{paddingVertical : 20}}>
        <Text style = {styles.sectionText}> Budget Categories </Text>  
          <View>
            {
                currentBudget.categories.map((item, index) => (
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
          <TouchableOpacity style = {styles.addCategoryButton}>
            <Text onPress={() => {setCategoryModalVisible(true)}} 
              style = {styles.buttonText}
            >New Category</Text>
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
      height : 30,
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
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical : 10,
      paddingHorizontal : 10,
      maxWidth : "100%",
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
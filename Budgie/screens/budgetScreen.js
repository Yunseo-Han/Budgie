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
import BudgetContext, { Budget, Category } from "../models/Budget";
import { ObjectId } from "bson";

const screenWidth = Dimensions.get("window").width;



export const BudgetScreen = ({ navigation, route }) => {

    // const [spendingContainer, setSpendingContainer] = useState(SpendingContainer)
    const [spendingItems, setSpendingItems] = useState([]);
    
    const {idString} = route.params;

    // add category modal 

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    // add spending modal 
    const [spendingModalVisible, setSpendingModalVisible] = useState(false);
   
    const screenWidth = Dimensions.get("window").width;


    //REALM
    const { useRealm, useQuery, RealmProvider } = BudgetContext;
    const realm = useRealm();

    let id = ObjectId(idString);
    let currentBudget = realm.objects("Budget").filtered("_id == $0", id)[0];


    // function addNewSpending() {
    //   setSpendingItems(... spendingItmes, <Spending spendingName, spedflksjd/>)
    //   setSpendingName("")
    //   setSpending(0)
    //   setSpendingCatagory("")
    //   setSpendingContainer(null)
    // }

    

    


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

      const [categoryInput, setCategoryInput] = React.useState("");
      
      const [categoryLimitInput, setCategoryLimitInput] = React.useState("");

      function handleAddCategory() {
        let name = categoryInput.trim();
        let limit = categoryLimitInput;
        if(name == "") {
          console.log("Every category must be given a name.");
          return;
        }
        let id = ObjectId(idString);
        let currentBudget = realm.objects("Budget").filtered("_id == $0", id)[0];
        if(currentBudget.categories.some(e => e.name === name)) {
          console.log("A category using with that name already exists.");
          return;
        }
        let newCat;
        realm.write(() => {
          newCat = realm.create("Category", new Category({name: name, spendingLimit: 0}));
          currentBudget.categories.push(newCat);
        });


        console.log(JSON.stringify(currentBudget), "\n");
        

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
      
      function pressedSubmitNewCategory() {
        handleAddCategory();
        setCategoryModalVisible(false);
    }

    function showTransactions(index){
     setSpendingModalVisible(true);
    }

    // function pressedSeeTransactions(){
    //   navigation.navigate('Transactions', {
    //     idString : idString
    //   })
    // }


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
                style={styles.rowButton}
                onPress={pressedSubmitNewCategory}>
                <Text style={styles.buttonText}>Submit</Text>
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

      const Legend = ({ title, amount, limit, color, index }) => {

        return( 
          <View style = {[styles.legendBox, {alignContent: 'center'}]}>
            <TouchableOpacity style = {{flexDirection : 'row'}}>
            <View style = {[styles.bar, {backgroundColor : color}, 
              {width : (amount/limit)*(0.6*screenWidth)}]}></View>
            
            <View style = {[styles.bar, {backgroundColor : buttonGrey}, 
              {width : (0.6*screenWidth)-((amount/limit)*(0.6*screenWidth))}]}></View>
            </TouchableOpacity>
            
              <View style = {{paddingLeft : 10}}>
                <View style = {{width : 0.4 * screenWidth}}>
                  <Text style = {{fontWeight : 'bold', maxWidth: '60%'}}> {title} </Text>
                  <View style = {{flexDirection : 'row'}}>
                    <Text style = {{ fontWeight: 'bold', color : 'green'}}> {"$" + amount} </Text>
                    <Text style = {{ paddingLeft : 0, color:'grey'}}> {"/ $" + limit} </Text>
                </View>
                </View>
            </View>
          </View>
          );
        };
  
      
  
  
    const ModalAddSpending = () => {
        const [spendingName, setSpendingName] = React.useState("");
        const [spending, setSpending] = React.useState(0);
        const [spendingCatagory, setSpendingCatagory] = React.useState("");
        

    
    
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
    const defaultNum = [100]
    const defaultColor = [buttonGrey]
    const colorPalette = ['#D8F3DC','#B7E4C7','#95D5B2', '#74C69D', '#52B788', '#00A36C', '#478778']
    const series = []
    const sliceColor = ['#D8F3DC','#B7E4C7','#95D5B2', '#74C69D', '#52B788', '#00A36C', '#478778']

    function transactionsExist(){
      if(currentBudget.categories.some(e => e.transactions.length > 0)) {
        return true;
      }
      return false;
    }

    function setsliceColor(){
      if (currentBudget.categories.length == 0) return defaultColor;
      if (!transactionsExist()) return defaultColor;
      else return sliceColor;
    }

    function setSlice(){
      if (currentBudget.categories.length == 0) return defaultNum;
      if (!transactionsExist()) return defaultNum;
      else return series;
    }
    
    function setColor(index) {
      return sliceColor[index];
    }

    function addSlice(amount, color){
      series.push(amount);
      sliceColor.push(color);
    }

    return(
        <SafeAreaView style={[styles.container]}>
        <StatusBar barStyle='dark-content'/>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
        <View style = {{alignItems : 'center', paddingVertical : 10}}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={setSlice()}
            sliceColor={setsliceColor()}
            doughnut={true}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View>

        {/* borderTopColor : buttonGrey, borderTopWidth : 2 */}
        <View style = {{paddingVertical : 20}}>
        <Text style = {styles.sectionText}> Budget Categories </Text>  
          <View>
            {
                currentBudget.categories.map((item, index) => (
                  <Legend
                    title = {item.name}
                    amount = {400}    //item.transactionSum
                    limit = {item.spendingLimit}     //item.spendingLimit 
                    color = {sliceColor[index]}
                    index = {index}
                    catIdString={item._id.toString()}
                  />
                ))
            }
          </View>
          <TouchableOpacity style = {styles.rowButton}>
            <Text onPress={() => {setCategoryModalVisible(true)
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
      fontSize: 20,
      fontWeight: 'bold',
      paddingVertical: 10,
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
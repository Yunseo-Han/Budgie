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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export const LogInScreen = ({ navigation, route }) => {
    return(
        <SafeAreaView style={[styles.container, {backgroundColor: 'white'}]}>
            <View style = {{alignItems: 'center', height : screenHeight, paddingVertical: 30}}>
                <Image style = {{width: 250, height: 250}} source={require('../img/Budgie1024.png')} />
                <Text> </Text>
                <Image style = {{width: 150, height: 40, paddingVertical: 30}} source={require('../img/budgie-login.png')} />
                <Text style={[styles.textInputTitle, {alignSelf: 'flex-start', paddingLeft: 50}]}>Email</Text>
                <TextInput
                    style={styles.textInputBox}
                />
                <Text style={[styles.textInputTitle, {alignSelf: 'flex-start', paddingTop: 10, paddingLeft: 50}]}>Password</Text>
                <TextInput secureTextEntry={true} style={styles.textInputBox}/>
                <TouchableOpacity style = {{paddingTop: 10}} onPress={() => navigation.navigate('ඞ ඞ ඞ ඞ')}>
                    <View style = {styles.rowButton}>
                        <Text style = {{fontWeight: 'bold', fontSize: 15}}>LOG IN</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textInputTitle: {
        marginLeft: 10,
        color: 'grey',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
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

      rowButton: {
        backgroundColor: addButtonBlue,
        borderRadius: 20,
        marginTop: 20,
        marginBottom : 30,
        paddingVertical: 10,
        paddingHorizontal: 50,
        alignSelf : 'center',
        alignItems : 'stretch',
      },
});
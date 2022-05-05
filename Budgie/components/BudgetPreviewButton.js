// import React from "react";

// import {
//   Text,
//   View,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';

// import {buttonGrey} from '../budgieColors';

// import pressedBudgetPreviewButton from '../realmFunctions';

// export const BudgetPreviewButton = ({startDate, endDate, spending, saving, idString}) => {
//     return (
//       <TouchableOpacity onPress={() => pressedBudgetPreviewButton(idString)} style={styles.roundedButton}>
//         <Text style={styles.importantText}> {startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString()} </Text>
//         <View style = {{alignContent: 'flex-end', maxWidth: '50%'}}>
//           <Text> {'$' + spending} </Text>
//           <Text> {'$' + saving} </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }

//   const styles = StyleSheet.create({
//     roundedButton: {
//       backgroundColor: buttonGrey,
//       borderRadius: 10,
//       paddingVertical: 15,
//       paddingHorizontal: 20,
//       justifyContent: 'space-between',
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 10,
//       marginHorizontal: 20,
//     },
    
//     importantText: {
//       fontWeight: 'bold',
//       maxWidth: '50%',
//     },
//   });
// // REALM
// import {useMemo} from 'react';
// import {Budget, BudgetContext} from './models/Budget';
// // import {BSON} from "realm-web";
// import { ObjectId } from "bson";

// const { useRealm, useQuery, RealmProvider } = BudgetContext;

// const realm = useRealm();
// const result = useQuery("Budget");
// const budgets = useMemo(() => result.sorted("startDate"), [result]);


// function pressedBudgetPreviewButton(idString) {
//     console.log(idString);
//     let id = ObjectId(idString);
//     let budObj = realm.objects("Budget").filtered("_id == $0", id);
//     console.log(budObj);
//     console.log(JSON.stringify(budObj.categories));
//     navigation.navigate('Budget', {
//       idString : ""
//     })
//   }
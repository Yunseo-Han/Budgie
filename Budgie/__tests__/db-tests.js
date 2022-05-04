// REALM
import {useMemo} from 'react';
import BudgetContext, { Budget } from "../models/Budget";
import { BudgetScreen } from './budgetScreen';
const { useRealm, useQuery, RealmProvider } = BudgetContext;
const realm = useRealm();
const result = useQuery("Budget");
const budgets = useMemo(() => result.sorted("startDate"), [result]);

function handleAddBudget(startDate, endDate, targetSpending) {
	targetSpending = parseFloat(targetSpending);
	realm.write(() => {
	  realm.create("Budget", new Budget({startDate, endDate, targetSpending}));
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
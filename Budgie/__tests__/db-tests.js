// REALM
import {useMemo} from 'react';
import BudgetContext, { Budget } from "../models/Budget";
import { BudgetScreen } from '../budgetScreen';
const { useRealm, useQuery, RealmProvider } = BudgetContext;
const realm = useRealm();
const result = useQuery("Budget");
const budgets = useMemo(() => result.sorted("startDate"), [result]);
const categories = useMemo(() => result.sorted("startDate"), [result]);
const transactions = useMemo(() => result.sorted("startDate"), [result]);

export function testDb() {
	QueryBudgets();
	QueryCategories();
	QueryTransactions();
	QueryBudgetsDeletions();
	QueryCategoriesDeletions();
	QueryTransactionsDeletions();
	QueryBudgetsUpdates();
	QueryBudgetsRollbacks();
	QueryTransactionsRollbacks();
	QueryCategoriesUpdates();
	QueryCategoriesRollbacks();
}

// Budget Insertions Test
export function QueryBudgets() {
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

// Category Insertions Test
export function QueryCategories() {
	let i = 1;
	categories.forEach(element => {
	  console.log("Category " + i);
	  console.log(element._id.toString());
	  console.log("\n");
	  i++;
	});
}

// Transactions Insertions Test
export function QueryTransactions() {
	let i = 1;
	transactions.forEach(element => {
	  console.log("Transaction " + i);
	  console.log(element._id.toString());
	  console.log("\n");
	  i++;
	});
}

// Budget Deletions Test
export function QueryBudgetsDeletions() {
	let i = 1;
	budgets.forEach(element => {
	  console.log("Budget Deleted " + i);
	  console.log(element._id.toString());
	  i++;
	});
}

// Category Deletions Test
export function QueryCategoriesDeletions() {
	let i = 1;
	categories.forEach(element => {
	  console.log("Category Deleted " + i);
	  console.log(element._id.toString());
	  i++;
	});
}

// Transactions Deletions Test
export function QueryTransactionsDeletions() {
	let i = 1;
	transactions.forEach(element => {
	  console.log("Transactions Deleted " + i);
	  console.log(element._id.toString());
	  i++;
	});
}

// Sprint 2 //
// Budget Updates Test
export function QueryBudgetsUpdates() {
	let i = 1;
	budgets.forEach(element => {
	  console.log("Budgets Updated " + i);
	  console.log(element._id.toString());
	  i++;
	});
}

// Budget Rollbacks Test
export function QueryBudgetsRollbacks() {
	let i = 1;
	budgets.forEach(element => {
	  console.log("Budgets Rollbacked " + i);
	  console.log(element._id.toString());
	  i++;
	});
}

// Transaction Rollbacks Test
export function QueryTransactionsRollbacks() {
	let i = 1;
	transactions.forEach(element => {
	  console.log("Transactions Rollbacked " + i);
	  console.log(element._id.toString());
	  i++;
	});
}

// Category Updates Test
export function QueryCategoriesUpdates() {
	let i = 1;
	categories.forEach(element => {
	  console.log("Categories Updated " + i);
	  console.log(element._id.toString());
	  i++;
	});
}

// Category Rollbacks Test
export function QueryCategoriesRollbacks() {
	let i = 1;
	categories.forEach(element => {
	  console.log("Categories Rollbacked " + i);
	  console.log(element._id.toString());
	  i++;
	});
}



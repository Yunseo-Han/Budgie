import React, {useState, useCallback, useMemo} from 'react';
import BudgetContext, { Budget } from "./models/Budget";

const { useRealm, useQuery, RealmProvider } = BudgetContext;
const realm = useRealm();
const result = useQuery("Budget");
const budgets = useMemo(() => result.sorted("startDate"), [result]);

export const handleAddBudget = useCallback(
	(name, startDate, endDate, goal) => {
	  if (!name) {
	    return;
	  }
	  realm.write(() => {
	    realm.create("Budget", new Budget({name, startDate, endDate, goal}));
	  });
	},
	[realm],
);

export const handleDeleteBudget = useCallback(
	(budget) => {
	  realm.write(() => {
	    realm.delete(budget);
	  });
	},
	[realm],
);
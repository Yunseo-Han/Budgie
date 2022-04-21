import React, {useState, useCallback, useMemo} from 'react';
import BudgetContext, { Budget } from "./Budget";

const { useRealm, useQuery, RealmProvider } = BudgetContext;
const realm = useRealm();
const result = useQuery("Budget");
const budgets = useMemo(() => result.sorted("startDate"), [result]);

// export const handleAddBudget = (startDate, endDate, targetSpending) => {
// 	if (!name) return;
// 	realm.write(() => {
// 	    realm.create("Budget", new Budget({startDate, endDate, targetSpending}));
// 	})
// }

  export const handleAddBudget = useCallback(
  	(startDate, endDate, targetSpending) => {
  	  realm.write(() => {
  	    realm.create("Budget", new Budget({startDate, endDate, targetSpending}));
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
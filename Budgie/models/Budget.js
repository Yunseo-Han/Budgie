import 'react-native-get-random-values'
import { Realm, createRealmContext } from '@realm/react';

export class Budget {
  constructor({id = new Realm.BSON.ObjectId(), startDate, endDate, targetSpending}) {
    this._id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalSpending = 0;
    this.targetSpending = targetSpending;
    this.categories = new Array();
  }
  
  static schema = {
    name: 'Budget',
    primaryKey: '_id',
    properties: {
      '_id' : 'objectId',
      'startDate' : 'date',
      'endDate' : 'date',
      'totalSpending' : 'double',
      'targetSpending' : 'double',
      'categories' : { type: 'list', objectType: 'Category' }
    }
  };
}

export class Category {
  constructor({id = new Realm.BSON.ObjectId(), name, spendingLimit}) {
    this._id = id;
    this.name = name;
    this.transactionSum = 0;
    this.spendingLimit = spendingLimit;
    this.transactions = [];
  }

  static schema = {
    name: 'Category',
    primaryKey: '_id',
    properties: {
      '_id' : 'objectId',
      'name' : 'string',
      'transactionSum' : 'double',
      'spendingLimit' : 'double',
      'transactions' : { type: 'list', objectType: 'Transaction' }
    }
  };
}

export class Transaction {
  constructor({id = new Realm.BSON.ObjectId(), name, date, amount}) {
    this.date = new Date();
    this.amount = amount;
    this.name = name;
  }

  static schema = {
    name: 'Transaction',
    primaryKey: '_id',
    properties: {
      '_id' : 'objectId',
      'name' : 'string',
      'date' : 'date',
      'amount' : 'double'
    }
  };
}

export default createRealmContext({
  schema: [Budget.schema, Category.schema, Transaction.schema],
  deleteRealmIfMigrationNeeded: true,
});
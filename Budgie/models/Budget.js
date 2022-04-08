import { Realm, createRealmContext } from '@realm/react';

export class Budget {
  constructor({id = new Realm.BSON.ObjectId(), name, startDate, endDate, goal}) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this._id = id;
    this.totalSpending = 0;
    this.goal = goal;
    this.transactions = [];
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Budget',
    primaryKey: '_id',
    properties: {
      '_id' : 'objectId',
      'name' : 'string',
      'startDate' : 'date',
      'endDate' : 'date',
      'totalSpending' : 'double',
      'goal' : 'double',
      'transactionsList' : { type: 'list', objectType: 'Transaction' }
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
  schema: [Budget.schema, Transaction.schema],
  deleteRealmIfMigrationNeeded: true,
});
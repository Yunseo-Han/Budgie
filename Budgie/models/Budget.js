import { Realm, createRealmContext } from '@realm/react';

export class Budget {
  constructor({id = new Realm.BSON.ObjectId(), name, isActive = false, startDate, endDate}) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this._id = id;
    this.amountSpent = 0;
    this.isActive = isActive;
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Budget',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      startDate: 'date',
      endDate: 'date',
      isActive: {type: 'bool', default: false},
      amountSpent: 'double'
    },
  };
}

export default createRealmContext({
  schema: [Budget.schema],
  deleteRealmIfMigrationNeeded: true,
});
import {createRealmContext, Realm} from '@realm/react';

export class Budget {
    constructor({id = new Realm.BSON.ObjectId(), name}) {
        this.name = name;
        this.createdAt = new Date();
        this._id = id;
        this.spending = spending;
        this.saving = saving;
    }

    static schema = {
        name: 'Budget',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            createdAt: 'date',
            spending: 'int',
            saving: 'int'
        },
    };
}

export const {useRealm, useQuery, RealmProvider} = createRealmContext({
    schema: [Budget.schema],
    deleteRealmIfMigrationNeeded: true,
});
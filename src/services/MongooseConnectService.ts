import * as Mongoose from 'mongoose';
import {EventEmitter} from "events";

(<any>Mongoose).Promise = Promise;

export default class MongooseConnectService extends EventEmitter {
    private db = null;

    constructor(private host: string, private dbName: string) {
        super();

        process.on('exit', function () {
            Mongoose.disconnect();
        });
    }

    /**
     *
     */
    connect() {

        if (this.db === null) {

            console.log('Mongoose attempt to connect to ' + 'mongodb://' + this.host + '/' + this.dbName);

            this.db = Mongoose.connect('mongodb://' + this.host + '/' + this.dbName, (err) => {
                if (err) {
                    this.emit('error', 'Fail to connect to ' + 'mongodb://' + this.host + '/' + this.dbName)
                } else {
                    this.emit("connect", this.db);
                }
            });

        } else {
            this.emit("connect", this.db);
        }

        return this;
    }

    /**
     * 
     * @returns {function(any, any, any): undefined}
     */
    middleware(){
        return (request, response, next) => {
            request.db = this.db;
            next();
        }
    }
}
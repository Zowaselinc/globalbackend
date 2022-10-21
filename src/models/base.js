const { Connection } = require('~database/connection');

class Base{
    constructor(){

    }

    /* ------------------------------------------------------------------------------------------------------------------ */
    /*                                                 BOOT MODEL INSTANCE                                                */
    /* ------------------------------------------------------------------------------------------------------------------ */

    _boot(table,attributes,input){
        this._table = () => table;
        this._attributes = () => attributes;
        // Cast possible ID input to number from string
        if(input && typeof input == "string"){ input = eval(input) }
        //----------------------------------------------------------
        const id = (input && typeof input == "number") ? input : null;
        const data = (input && typeof input == "object") ? input : null;

        /* ------------------------------ IF LOADING RETURN PROMISE ELSE RETURN SIMPLE INSTANCE ----------------------------- */

        if(data){
            this._setAttributeValues(data);
            return this;
        }
        if(id){
            return new Promise(async (resolve, reject) => {
                this._setUniqueKey(id);
                await this._loadInstance();
                this._isExisting = true;
                resolve(this);
            });
        }
        // if(relationships){
        //     let vm = this;
        //     Object.keys(relationships).forEach((key)=>{
        //         vm._relationships[key] = relationships[key];
        //     });
        // }else{
        //     this._relationships = null;
        // }
        return this;
    }

    _db(){
        return Connection.db;
    }

    // _relationships = {};


    async _select(params){
        let result = await (params ? this._db().select(this._table(),params) : this._db().select(this._table()));
        return result;
    }

    async _insert(data){
        let result = await this._db().insert(this._table(),data);
        return result;
    }

    async _update(data,params){
        let result = await this._db().update(this._table(),data,params);
        return result;
    }

    async _delete(params){
        let result = await this._db().delete(this._table(),params);
        return result;
    }

    /* ------------------------------------------------------------------------------------------------------------------ */
    /*                                            LOAD EXISTING RECORD FROM DB                                            */
    /* ------------------------------------------------------------------------------------------------------------------ */

    _setUniqueKey(value){
        this._uniqueKey = value;
    }


    async _loadInstance(){
        let vm = this;
        let instance = await this._select({id : this._uniqueKey});
        if(instance.length){
            Object.keys(instance[0]).forEach((item,index)=>{
                if(item!='id'){
                    vm[item] = Object.values(instance[0])[index];
                }
            });
        }
    }

    _setAttributeValues(data){
        let vm = this;
        Object.keys(data).forEach((item,index)=>{
            if(this._attributes().includes(item)){
                vm[item] = Object.values(data)[index];
            }else{
                throw new TypeError(`Property '${item}' not defined on model`);
            }
        });
    }

    _generateDataObject(){
        let dataObject = {};
        this._attributes().forEach((item,index)=>{
            dataObject[item] = this[item];
        });
        return dataObject;
    }

    _resultSetType(params){
        let vm = this;
        var rsType = {
            get : async ()=>{
                let result =  await vm._select(params);
                return result;
            },
            first : async ()=>{
                let result =  await vm._select(params);

                Object.keys(result[0]).forEach((item,index)=>{
                    if(item!='id'){
                        vm[item] = Object.values(result[0])[index];
                    }
                });
                
                this._isExisting = true;
                this._uniqueKey = result[0].id;
                return this;
            }
        }
        return rsType;
    }

    /* ------------------------------------------------------------------------------------------------------------------ */
    /*                                                   PUBLIC METHODS                                                   */
    /* ------------------------------------------------------------------------------------------------------------------ */

    async save(){
        if(this._isExisting){
            this._update(this._generateDataObject(),{id : this._uniqueKey});
        }
        else{
            let result = await this._insert(this._generateDataObject());

            //Set inserted id to _uniqueKey
            this._setUniqueKey(result.insertId);
        }
    }


    where(params){
        let vm = this;
        return this._resultSetType(params);
    }

    all(){
        return this._select();
    }

    // with(relationshipKey){
    //     if(this._relationships){
    //         let relationType = this._relationships[relationshipKey].type;
    //         let Model = this._relationships[relationshipKey].model;
    //     }
    // }

}

module.exports = Base;
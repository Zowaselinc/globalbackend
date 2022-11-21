const { Connection, RawConnection } = require('~database/connection');

class Base{
    constructor(){

    }

    /* ------------------------------------------------------------------------------------------------------------------ */
    /*                                                 BOOT MODEL INSTANCE                                                */
    /* ------------------------------------------------------------------------------------------------------------------ */

    _boot(table,attributes,relationships,appends,input){
        this._table = () => table;
        this._attributes = () => attributes;
        this._relationships = () => relationships;
        this._appends = () => appends;
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
        return this._buildSelectResult(result);
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

    async _selectWithJoin(relationship, params){
        let vm = this;
        var query = params 

            ? `SELECT ${this._table()}.* , ${this._buildRelationshipFields(relationship)} FROM ${this._table()} INNER JOIN ${relationship.model._table()} ON ${this._table()}.${relationship.key} = ${relationship.model._table()}.id WHERE ${this._buildQueryParams(params)}`

            : `SELECT ${this._table()}.* , ${this._buildRelationshipFields(relationship)} FROM ${this._table()} INNER JOIN ${relationship.model._table()} ON ${this._table()}.${relationship.key} = ${relationship.model._table()}.id`;

            console.log(query);

        return new Promise(function(myResolve, myReject) {
            RawConnection.db.query(
                query,
                function(err, results, fields) {
                    results = vm._buildSelectResult(results);
                    myResolve(vm._formatJoinResult(results));
                }
            );
        });

    }

    /* ------------------------------------------------------------------------------------------------------------------ */
    /*                                            LOAD EXISTING RECORD FROM DB                                            */
    /* ------------------------------------------------------------------------------------------------------------------ */

    _setUniqueKey(value){
        this._uniqueKey = value;
        this.id = value;
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
            if( item != "created_at" && item != "updated_at"){
                dataObject[item] = this[item];
            }
        });
        return dataObject;
    }

    _buildSelectResult(results){
        var vm = this;
        if(results){
            results.forEach(result => {
                Object.keys(vm._appends()).forEach( data => {
                    result[data] = vm._appends()[data];
                });
            });
        }
        return results;
    }

    _buildQueryParams(params){
        var resultArray = [];
        Object.keys(params).forEach((item)=>{
            resultArray.push(`${this._table()}.${item} = ${params[item]}`);
        });
        return resultArray.join(' AND ');
    }

    _buildRelationshipFields(relationship){
        var fields = relationship.model._attributes();
        var selectors = [];
        fields.forEach(field => {
            selectors.push(`${relationship.model._table()}.${field} as '${relationship.name}#${field}'`)
        });
        return selectors.join(' , ');
    }

    _formatJoinResult(result){
        var formatted = [];
        // Loop through each result
        if(result){
            result.forEach(row => {
                var keys = Object.keys(row);
                var rowResult = {};
                // Check each key
                keys.forEach( key => {
                    if(key.includes("#")){
                        var keySplit = key.split('#');
                        var propertyToAdd = {};
                        propertyToAdd[keySplit[1]] = row[key];
                        // Generate new object
                        rowResult[keySplit[0]] = {
                            ...(rowResult[keySplit[0]] ?? {}),
                            ...propertyToAdd
                        };
                    }else{
                        rowResult[key] = row[key];
                    }
                });
                formatted.push(rowResult);
            });
        }else{
            return result;
        }


        return formatted;
    }

    _resultSetType(loadResult){
        let vm = this;
        var rsType = {
            get : async ()=>{
                var result = await loadResult();
                return result;
            },
            first : async ()=>{
                var result = await loadResult();
                if(!result || result.length == 0){ return null; }
                Object.keys(result[0]).forEach((item,index)=>{
                    // if(item!='id'){
                        vm[item] = Object.values(result[0])[index];
                    // }
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

    async delete(){
        this._delete({id : this._uniqueKey});
        
    }


    where(params){
        let vm = this;
        var result = async () => {
            var rs;
            if(vm._linkedRelation){
                rs = await this._selectWithJoin(vm._linkedRelation(),params);
                return rs
            }
            rs = await this._select(params);
            return rs;
        }
        return this._resultSetType(result);
    }

    with(relation){
        var relationship = this._relationships()[relation];
        relationship.name = relation;
        this._linkedRelation = () => relationship;
        return this;
    }

    all(){
        if(this._linkedRelation){
            return this._selectWithJoin(this._linkedRelation(),null);
        }
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
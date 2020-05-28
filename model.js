const mongoose = require('mongoose');
const _ = require("lodash");
require('dotenv').config();

//create & connect to DB
mongoose.connect(process.env.MONGODB_DATABASE_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
(err) => {
    try {
        console.log(`Server connected successfully to MongoDB`);
    } catch (err) {
        console.log(err);
    }
});


//create schema
const itemsSchema = new mongoose.Schema ({
  name: String
});

const listSchema = new mongoose.Schema ({
  name: String,
  items: [itemsSchema]
});


//create model (aka Collection) (equivalent to Table in SQL))
const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', listSchema);


class DBUtility {

    // *** DB utility methods

    static findOneList(listName, callBack) {

        List.findOne({name: listName}, (err, foundList) => {
            let list = null;
            if (err) {
                console.log(`Error: ${err}`);         
            } else {
                list = foundList
                callBack(list);
            }
        });
    }

    static findAllLists(callBack) {
        List.find({}, (err, allLists) => {
            if (err) {
                console.log(err);
            } else {
                callBack(allLists);
            }  
        });
    }
            
    static createNewListInDB(listName) {
        //create default items for new list
        const introItem = new Item({
            name: 'Welcome to your todolist!'
        });
    
        const addItem = new Item({
            name: 'Hit the + button to add a new item.'
        });
    
        const deleteItem = new Item({
            name: '<-- Hit this to delete an item.'
        });
    
        const listNameCap = _.capitalize(listName);
        const list = new List({
            name: listNameCap,
            items: [introItem, addItem, deleteItem]
        });
        list.save(err => {
            if (err) {
                console.log(err);
            } else {
                console.log(`created list ${list.name} successfully.`);
            }
        });
    }
    
    static addNewItemToListInDB(listName, itemName) {
        return new Promise((resolve, reject) => {
            List.findOne({name: listName}, (err, foundList) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    foundList.items.push({ name: itemName });
                    foundList.save(err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`Item ${itemName} added to list ${foundList.name} successfully.`);
                            resolve(foundList);
                        }
                    });
                }  
            });
        });
    }
  
    static deleteItemFromListInDB(listName, itemID) {
        return new Promise((resolve, reject) => {
            // findOneAndUpdate is a mongoose method, but $pull is a mongoDB method
            List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, (err, updatedList) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`deleted item "${itemID}" from list ${updatedList} successfully.`);
                    resolve(updatedList);
                }
            });
        });
    }
  
    static deleteOneListFromDB(listID) {
        List.findByIdAndDelete(listID, (err, deletedList) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Deleted list ${deletedList.name} successfully`);
            }
        });
    }
}

exports.DBUtility = DBUtility;

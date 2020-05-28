const express = require('express');
const bodyParser = require('body-parser');
const date = require('./date.js');
const model = require('./model.js');
const ejs = require('ejs');
const _ = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));


//*** HTTP requests handlers

app.get('/', (req, res) => {
  const defaultListName = "Today's";
  const todayFormatted = date.getDate();
  model.DBUtility.findOneList(defaultListName, (foundList) => {
    if (!foundList) {
      model.DBUtility.createNewListInDB(defaultListName);
      res.redirect('/');
    } else { 
      res.render('list', {
        listTitlePassToH1: foundList.name,
        todayDate: todayFormatted,
        listItems: foundList.items
      });
    }
  });
});

app.post('/', async (req, res, next) => {
    const receivedItem = req.body.newItem;
    const listName = req.body.listName;
    try {
      const updatedList = await model.DBUtility.addNewItemToListInDB(listName, receivedItem);
      console.log(`updated list: ${updatedList} successfully`);
      if (listName === "Today's") {
        res.redirect('/');
      } else {
        res.redirect('/' + listName);
      } 
  } catch (err) {
    next(err);
  }
});

app.post('/deleteItem', async (req, res, next) => {
  
    const itemID = req.body.itemID;
    const listName = req.body.listName;
    try {
      await model.DBUtility.deleteItemFromListInDB(listName, itemID);
      if (listName === "Today's") {
        res.redirect('/');
      } else {
        res.redirect('/' + listName);
      }
  } catch (err) {
    next(err);
  }
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/allLists', (req, res) => {
  model.DBUtility.findAllLists((allLists) => {
    res.render('all-lists', {
      lists: allLists
    });
  });
});

app.post('/deleteList', (req, res) => {
  const listID = req.body.deleteListID;
  model.DBUtility.deleteOneListFromDB(listID);
  res.redirect('/allLists');
});

app.get('/createNewList', (req, res) => {
  res.render('create-list');
});

app.post('/addList', (req, res) => {
  const listNameCap = _.capitalize(req.body.listName);
  model.DBUtility.findOneList(listNameCap, (foundList) => {
    if (!foundList) {
      model.DBUtility.createNewListInDB(listNameCap);
      res.redirect(`/${listNameCap}`);
    } else {
      res.redirect(`/${foundList.name}`);
    }
  });
});

app.get('/:listName', (req, res) => {
  const routeParamListName = _.capitalize(req.params.listName);
  model.DBUtility.findOneList(routeParamListName, (foundList) => {
    if (!foundList) {
      res.write("<p>Error: page not found!</p>");
      res.write("<a href='/'>Back to Home page</a>");
      res.send();
    } else {
      res.render('new-list', {
        listTitlePassToH1: foundList.name,
        listItems: foundList.items
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log(`Server started, listening on port: ${port}`);
});
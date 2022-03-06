const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

const text = fs.readFileSync(__dirname + "/jokes.txt", "utf-8");
var jokeArray = text.split("\n");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/list", function(req, res){
  res.redirect("/list");
})

app.route("/list")
  .get(function(req, res) {
    res.write("<table>");
    for(var i = 0; i < jokeArray.length; i++){
      const joke = jokeArray[i].split("<>");
       res.write("<tr>");
       res.write("<td>" + joke[0] + "</td>");
       res.write("<td>" + joke[1] + "</td>");
       res.write("</tr>");
    }
    res.write("</table>");
    res.end();
  }) //get whole list
  .post(function(req, res){
    const joke = {
      joke: req.body.joke,
      punchLine: req.body.punchLine
    }
    var jokeString = "\n" + joke.joke +"<>" + joke.punchLine;
    var jokeList = fs.readFileSync(__dirname + "/jokes.txt", "utf-8");
    jokeList = jokeList + jokeString;
    fs.writeFileSync(__dirname + "/jokes.txt", jokeList);
    res.status(200).send("Joke was added successfully!!");
  }) //add to the list
  .put() //not used
  .delete() //not used

app.route("/list/:index")
  .get(function(req, res){
    try{
      const index = req.params.index - 1;
      const joke = jokeArray[index].split("<>");
      res.write("<table>");
        res.write("<tr>");
          res.write("<td>" + joke[0] + "</td>");
          res.write("<td>" + joke[1] + "</td>");
        res.write("</tr>");
      res.write("</table>");
      res.end();
    } catch {
      const count = jokeArray.length;
      res.send("Index out of bounds. This list only has " + count  + " number of jokes on it");
    }
  }) //this get one item from the list
  .post() //not used
  .put(function(req, res) {
    try{
      const index = req.params.index -1;
      const joke = {
        joke: req.body.joke,
        punchLine: req.body.punchLine
      }
      var jokeString =  joke.joke +"<>" + joke.punchLine;
      const array = jokeArray;
      array[index] = jokeString;
      const string = array.join("\n");
      fs.writeFileSync(__dirname + "/jokes.txt", string);
      res.status(200).send("List was updated successfully!!");
    } catch {
      const count = jokeArray.length;
      res.send("Index out of bounds. This list only has " + count  + " number of jokes on it");
    }
  }) //update one item
  .delete(function(req, res){
    const index = req.params.index -1;
    const array = jokeArray;
    array.splice(index, 1);
    const string = JSON.stringify(array);
    fs.writeFileSync(__dirname + "/jokes.txt", string);
    res.status(200).send("Joke number " + index + " was deleted successfully!!");
  }) //delete one item

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if(error){
    console.log(error);
    return;
  }
  console.log("server started on port " + PORT);
})

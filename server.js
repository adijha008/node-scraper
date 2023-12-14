const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const crawler = require('./crawler.js');

app.use(express.json());
app.use("/questions", crawler);
require('dotenv').config();

// fetch port and url environment variables
const port = process.env.PORT || 5000;
const url = process.env.URL || "https://stackoverflow.com/questions?tab=votes&" ;

// mongoose.connect(process.env.MONGODB_URL)
//      .then(function(){
//           console.log('Connection to MongoDB Successful!');
//      })
//      .catch(function(){
//           console.log('Connection Unsuccessful.')
//      }
// );

mongoose.connect('mongodb://localhost/stackoverflow')  // connect to stackoverflow
     .then(function(){
          console.log('Connection to MongoDB Successful!');
     })
     .catch(function(){
          console.log('Connection Unsuccessful.')
     }
);


// call crawler function with given url
crawler(url);


app.get("/", function(req, res){
     res.status(200).json({"URL": url});
});


// Listen
app.listen(port, function(){
     console.log(`Listening in port: ${port}`);
});
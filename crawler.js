const express = require('express');
const router= express.Router();
const fs = require('fs');
const axios = require('axios');
const Questions = require('./schema/schema.questions');
const cheerio = require('cheerio');
const { json } = require('express/lib/response');
const mongoose = require('mongoose');

// initializing an empty array, keys for .csv, and the .csv file itself
let jsonArray = [];
let keys = ['Questions', 'Count', 'Upvotes', 'Answers'];
fs.writeFile('stackoverflow.csv', keys.toString()+'\n', function (err) {
     if (err) throw err;
});


// function to scrape from the url
async function stackoverflow(url) {
     try {
          // const siteUrl = "https://stackoverflow.com/questions?tab=votes";
          const siteUrl = url;
          // get url's html body
          const { data } = await axios({
               method: 'GET',
               url: siteUrl,
          });
          const $ = cheerio.load(data);
          // axios helps fetch the url's html body
          
          const elemSelector = $('.question-summary');
          // gets list of elements with class=question-summary

          // for each .question-summary element
          $(elemSelector).each(async function (parentIdx, parentElem) {
               var jsonObj = {};
               // fetch body content from each element
               // store into object - jsonObj
               
               // create jsonObj properties
               jsonObj.questionLink = "https://stackoverflow.com"+$(parentElem).find(".summary").find("a").attr("href");
               jsonObj.count = 1;
               jsonObj.upvotes = $(parentElem).find(".votes").find("strong").text();
               jsonObj.answers = $(parentElem).find(".status").find("strong").text();

               // verify if each object is in an array of element objects
               await append(jsonObj);
          });
          
          url = url.split("&page=");
          url[1] = parseInt(url[1]) + 1;
          newUrl = url.join("&page=");

          while(true) await stackoverflow(newUrl);
     }

     catch (error) {
          console.log(error);
     }

}


// function to find a match of question url in the array of jsonObj
async function append(jsonObj){
     // save to mongodb atlas
     
     // fetch match from jsonArray (initially empty)
     var match = jsonArray.filter(obj => {
          return obj.questionLink === jsonObj.questionLink;
     });

     // if match[0] is valid
          // increment count
     if(match[0]) match[0].count++;  // manipulation
     // else
          // append newobject to jsonArray
     else jsonArray = jsonArray.concat(jsonObj);
     
     // pass newly created array to add to .csv file
     await convertToCSV(jsonArray);

}

// function to write/append to .csv file
async function convertToCSV(array){
     // get array string from parameter
     arr = array.map(it => {
          return Object.values(it).toString()
     }).join('\n');

     // write csv headings with new array
     await fs.writeFile('stackoverflow.csv', keys.toString()+'\n'+arr, function (err) {
          if (err) throw err;
     });

     // await db.dropCollection('questions', function(err, result) {
     //      console.log(err)
     // });

     await Questions.deleteMany({});

     await Questions.insertMany(jsonArray)
          .then(function(){
               console.log("Data Inserted");
          })
          .catch(function(){
               console.log("Data not inserted.");
          });

}

module.exports = stackoverflow;

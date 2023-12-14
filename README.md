# nodejs-crawler
## A recursive crawler to fetch data from a website with pagination

run the following code in directory:
### `npm install`

and then:
### `npm start`

-------------------------------------
## Working
1. Created a listen server 'server.js' to listen at certain port. The server will execute the crawler from 'crawler.js' module, passing a valid url. <br />
2. 'crawler.js' module will execute using exec function. It will call stackoverflow() function recursively. <br />
3. Axios is used to get the HTML body. Cheerio is used for parsing HTML content. <br />
4. Every question is assigned with a property in a jsonObj variable. This object's question property value is used to verify if it already exists in the list of all questions. <br />
5. This is done by passing the jsonObj to an append() function which will find a match. if match is found, increment count. else append the object into the array <br />
6. The object is also being stored in a database in a MongoDB Atlas Cluster. Feel free to provide a server of your own <br />
7. Since each time an object is being vaidated to find a match, it is essential to pass the entire jsonArray to convert to csv, with the convertToCSV() function <br />
8. Finally, a 'stackoverflow.csv' file is created and the new array is written into it. <br />
9. In this manner, for every object, we can pass the object into the .csv file.

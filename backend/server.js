const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { EOL } = require("os");
const fs = require("node:fs/promises");
const csvFile = path.join(__dirname, "menu.csv");
const txtFile = path.join(__dirname, "menu.txt");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const readMenu = async (CSVFILE) => {
   fs.readFile(CSVFILE, "utf-8")
    .then((data) => data.split(EOL))
    .then((array) => {
      let mealsArray = [];
      let sortedMealsArray = [];
      array.forEach((line) => {        
         if (line === "") return;
         let lineArray = line.trim().split(",");        
         let [mealType, mealName, mealQuantity, price, photo] = lineArray;         
         let mealTypeUppercase =
               mealType.slice(0, 1).toUpperCase() + mealType.slice(1);
         
         let existingObj = mealsArray.find((item)=>item[mealTypeUppercase])

         if(existingObj){
            existingObj[mealTypeUppercase].push(`${mealName},${mealQuantity},${price},${photo}`)
         } else {
            let newObj ={}
            newObj[mealTypeUppercase] = [`${mealName},${mealQuantity},${price},${photo}`]
            mealsArray.push(newObj)        
         }  
      
        //step 1: send back to the UI an array called mealsArray for displaying
         sortedMealsArray = mealsArray.sort((a, b) => {
               const keyA = Object.keys(a)[0];
               const keyB = Object.keys(b)[0];            
              
               return keyB.localeCompare(keyA);
         });
          
         return sortedMealsArray
    })      
})}

readMenu(csvFile);

app.listen(PORT, () => {
  console.log(`Lab04AdvancedFullStack is running on: http://localhost:${PORT}`);
})

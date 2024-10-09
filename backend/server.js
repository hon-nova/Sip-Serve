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

class Meal {
   constructor(type,name,quantity,price,photo){
      this.mealType =type,
      this.mealName=name,
      this.mealQuantity=quantity,
      this.mealPrice =price,
      this.mealPhoto=photo
   }

   addMeal = async (meal,CSVFILE)=>{
      fs.appendFile(meal,CSVFILE)
   }
}
const readMenu = async (CSVFILE)=>{
      fs.readFile(CSVFILE,'utf-8')
         .then(data=>data.split(EOL))
         .then((array)=>{
            let mealsArray =[]
            let list ={}
            let sortedMealsArray=[]
            array.forEach(line=>{
               if(line==='') return

               let lineArray = line.trim().split(",")
               // console.log(`each line an array::${lineArray}`)
               let [mealType,mealName,mealQuantity,price,photo] = lineArray

               // let newMeal = new Meal(mealType,mealName,mealQuantity,price,photo)
               let mealTypeUppercase =mealType.slice(0,1).toUpperCase() + mealType.slice(1)

               //logic to create the mealsAray as desired
               mealsArray.push({[mealTypeUppercase]:[`${mealName},${mealQuantity},${price},${photo}`]})
               
               mealsArray.forEach((obj)=>{                  
                  let type = Object.keys(obj)[0]
                  let mealDetail=obj[type]
                  console.log(`type: ${type}, and meal details: ${mealDetail}`)

                  if(!list[type]){
                     list[type]=[]
                  } else {
                     list[type].push(`${mealName},${mealQuantity},${price},${photo}`)
                  }                

               })
               
               let sortedKeyMealsArray = mealsArray.map((item)=>Object.keys(item)[0]).sort((a,b)=>b.localeCompare(a))
               // console.log(`sortedKeyMealsArray`)
               // console.log(sortedKeyMealsArray)
               sortedMealsArray = sortedKeyMealsArray.map((key)=>{
                  let matchingObj =mealsArray.find((item)=>Object.keys(item)===key)
                  return matchingObj
               })
               
              
               
            //step 1: send back to the UI an array called mealsArray for displaying



            //step 2: save a copy into the menu.txt file with a desired format




           })
           //testing
         //   console.log(`mealsArray`)
         //   console.log(mealsArray)
             console.log(`sortedMealsArray`)
             console.log(sortedMealsArray)
         //   console.log(`list:: ${list}`)
         })
}

readMenu(csvFile)

app.listen(PORT, ()=>{
   console.log(`Lab04AdvancedFullStack is running on: http://localhost:${PORT}`)
})
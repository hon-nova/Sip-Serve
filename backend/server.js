const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { EOL } = require("os");
const fs = require("node:fs/promises");
const csvFile = path.join(__dirname, "menu.csv");
const txtFile = path.join(__dirname, "menu.txt");
const { v4: uuidv4 } = require('uuid');
const dotenv =require('dotenv') 

require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** STRIPE */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
   apiVersion: '2024-09-30.acacia; custom_checkout_beta=v1;',
 });
// console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
   console.log(`create-checkout-session triggered`)
   // const {items, totalPay } = req.body
   // console.log(`items `,items)
   // console.log(`totalPay `,totalPay)
//    const lineItems = items.map((item) => ({
//       price_data: {
//          currency: 'cad',
//          product_data: {
//          name: item.name, 
//          },
//          unit_amount: item.price * 100, 
//       },
//       quantity: item.quantity, 
//   }));
 
//    const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//    });

//    // res.json({ clientSecret: session.id });
//    res.json({clientSecret: session.client_secret});
 });
/** END STRIPE */
const readMenu = async (CSVFILE) => {   
   const data = await fs.readFile(CSVFILE, "utf-8")
   const array = data.split(EOL)

   let sortedMealsArray = [];
   let mealsArray = [];      
   array.forEach((line) => {        
      if (line === "") return;
      let lineArray = line.trim().split(",");        
      let [mealType, mealName, mealQuantity, price, photo] = lineArray;         
      let mealTypeUppercase =
            mealType.slice(0, 1).toUpperCase() + mealType.slice(1);
      // const newUUID = uuidv4();
      let existingObj = mealsArray.find((item)=>item[mealTypeUppercase])
      const id = uuidv4()
      // console.log(`uuid:  ${id}`)
      if(existingObj){
         existingObj[mealTypeUppercase].push(`${id},${mealName},${mealQuantity},${price},${photo}`)
      } else {
         let newObj ={}
         newObj[mealTypeUppercase] = [`${id},${mealName},${mealQuantity},${price},${photo}`]
         mealsArray.push(newObj)        
      }  
   
      //step 1: send back to the UI an array called mealsArray for displaying
      sortedMealsArray = mealsArray.sort((a, b) => {
            const keyA = Object.keys(a)[0];
            const keyB = Object.keys(b)[0];            
            
            return keyB.localeCompare(keyA);
      });        
    })   
   return sortedMealsArray  

   }
// readMenu(csvFile);
app.get("/menu",async (req,res)=>{

   try {
      const menu = await readMenu(csvFile)      
      return res.status(200).json({menu: menu, successMsg:'Successfully retrieving menu'})
   } catch(error){
      console.log(`ERROR reading file::${error}`)
   }
})
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "build", "index.html"));
 });
 app.use(express.static(path.join(__dirname, "build")));

app.listen(PORT, () => {
  console.log(`Lab04AdvancedFullStack is running on: http://localhost:${PORT}`);
})

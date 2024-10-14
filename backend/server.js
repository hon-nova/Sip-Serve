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
const dotenv =require('dotenv'); 
const { existsSync } = require("fs");

require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** STRIPE */
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY); 

app.post('/create-checkout-session', async (req, res) => {
   // console.log(`create-checkout-session triggered`)
   const {cartItems, estTotal } = req.body
   const lineItems = cartItems.map((item) => {
      let newPrice = item.price.replace("$","")
      return {
         price_data: {
            currency: 'cad',
            product_data: {
            name: item.name, 
            description:item.mealType, 
            images: [item.photo]
         },
         unit_amount: Math.round(newPrice * 100), 
      },
      quantity: parseInt(item.quantity), 
      }     
  }); 
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
   });
   res.json({url: session.url, clientSecret: session.client_secret,id: session.id});
 });
const endpointSecret = process.env.endpointSecret;

 app.use((req, res, next) => {
   if (req.originalUrl === '/webhook') {
       // Use raw body parser for webhook
       const rawBodyBuffer = [];
       req.on('data', chunk => rawBodyBuffer.push(chunk));
       req.on('end', () => {
           req.rawBody = Buffer.concat(rawBodyBuffer).toString(); // Concatenate buffer and convert to string
           next();
       });
   } else {
       // For all other routes, use the standard JSON parser
       express.json()(req, res, next);
   }
});

app.post('/webhook',(req,res) => {
   console.log(`webhook called starts`)
   const sig = req.headers['stripe-signature'];
   console.log(`req.headers:  `,req.headers)
   let event;
   try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }    
   // Handle the event
   console.log(`switch started`)
   switch (event.type) {
      case 'payment_intent.succeeded':
         const paymentIntent = event.data.object;
         console.log('PaymentIntent was successful!');
         console.log(`IMPORTANT: paymentIntent: `, paymentIntent);
         break;
      case 'payment_intent.payment_failed':
         const paymentIntentFailed = event.data.object;
         console.log('PaymentIntent failed!');
         break;
      case 'payment_intent.canceled':
         console.log('PaymentIntent was canceled. Please go back to the homepage to continue shopping!');
         break;
      default:
         console.log(`Unhandled event type ${event.type}`);
   }

   // Acknowledge the event was received
   res.json({ received: true });
});
 

app.post('/success-order', async(req,res)=>{
   // console.log(`success-order triggered`)
   try {
      const {id, cartItems} =req.body
      // console.log(`id: `,id)
   // console.log(`cartItems:  `,cartItems)
   const session = await stripe.checkout.sessions.retrieve(id);
   // console.log(`session backend:  `,session)
   // const paymentIntent = await stripe.paymentIntents.retrieve(id)
      // const paymentIntendId = session.payment_intent
   // console.log(`paymentIntendId:  `,paymentIntendId)
   // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntendId)
   //  console.log(`paymentIntent:  `,paymentIntent)
   // const {amount_total, currency}= paymentIntent
   //let amount_paid=amount_total/100 REMEMBER
   // console.log(`amount paid:  `,amount)
  /**  console.log(`currency:  `,currency)

   const orderId = uuidv4()
   const orderData = cartItems.map((item)=>({
      order_id: orderId,
      name: item.name,
      price:item.price,
      quantity:item.quantity,
      currency,
      total_pay:amount,
      order_date: new Date().toISOString()
   }))

   if(!existsSync('./orders.csv')){
      writer.pipe(fs.createWriteStream('./orders.csv'))
   }
   orderData.forEach((order)=>writer.write(order))
   write.end()
   res.status(200).json({successMsg:"Order stored successfully"})
*/
   } catch(error){
      console.log(error.message)
      res.status(500).json({errorMsg:"Error processing order!"})
   } 
   
})
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

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

app.use(bodyParser.urlencoded({ extended: true }));
 
/** STRIPE */
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY); 

const endpointSecret = process.env.endpointSecret;
 
app.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
   const sig = request.headers['stripe-signature'];
   console.log(`JSON.stringify(request.body):   `,JSON.stringify(request.body,null,2))
   let event;
 
   try {
     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
     console.log(`EVENT:  `,event)
   //   console.log('Event type:', event.type);
   }
   catch (err) {
     response.status(400).send(`Webhook Error: ${err.message}`);
   }
   // Log the received event type
   console.log('Received event type:', event.type);
   // Handle the event
 
   switch (event.type) {
      case 'checkout.session.completed':
         const session = event.data.object;
            console.log(`Processing checkout.session.completed for session:`, session.id);

            // Retrieve cart items from metadata
            const cartItems = JSON.parse(session.metadata.cart_items || '[]');
            console.log(`Cart items from metadata:`, cartItems);
      
      case 'payment_intent.succeeded':
         const paymentIntentSucceeded = event.data.object;
         console.log('PaymentIntent was successful!');
         break;

      case 'payment_method.payment_failed':
         console.log('PaymentMethod was failed');
         break;

      case 'payment_intent.created':
         console.log('PaymentMethod was created');
         break;

      case 'payment_intent.charged':
         console.log('PaymentMethod was charged');
         break;

      case 'charge.updated':
         const paymentChargeUpdated = event.data.object;
         console.log('Charge Updated and paymentIntent');
         const paymentChargeUpdatedId = paymentChargeUpdated.payment_intent
         console.log(`paymentChargeUpdatedId:   `,paymentChargeUpdatedId);
         const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentChargeUpdatedId
          );
         console.log(`paymentIntent Object retrieved:  `,paymentIntent)
         const amount_received =parseFloat(paymentIntent.amount_received/100)
         // console.log(`amount_received:  `,amount_received)
         const currency = paymentIntent.currency
         // console.log(`currency:  `,currency)

         // const charge = await stripe.charges.retrieve('ch_3MmlLrLkdIwHu7ix0snN0B15');

         // const metadata = paymentIntent.metadata
         // if(metadata.order_id){
         //    console.log(`metadata.order_id:: `,metadata.order_id)
         
         // }
         // console.log(`metadata is an empty object`)

         //THIS WORKED. DON'T DELETE
         // const paymentIntents = await stripe.paymentIntents.list({
         //    limit: 3,
         //  });
         // console.log(`paymentIntents:  `,paymentIntents)
         
      break;
         
     // ... handle other event types
     default:
       console.log(`Unhandled event type ${event.type}`);
   } 
   // Return a response to acknowledge receipt of the event
   response.json({received: true});
 });
 
app.use(bodyParser.json());
app.post('/create-checkout-session', async (req, res) => {
    // console.log(`create-checkout-session triggered`
    
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

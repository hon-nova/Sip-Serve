export const Payment =()=>{


   return(
      <div>Payment
      <div>
         <form>
         <div>
             <label htmlFor="digit">Enter 16 digits</label><br/>
             <input type="text" id="digit" name="digit" 
               onChange=""
             />
         </div>
         <div>
            <label htmlFor="amount">Amount: {0}</label><br/>
            <input type="text" id="amount" name="amount" placeholder="Enter exact amount"
                  onChange=""/>
         </div>
         <button type="submit" onClick="">Pay</button>
           
         </form>
      </div>
      </div>
   )
}
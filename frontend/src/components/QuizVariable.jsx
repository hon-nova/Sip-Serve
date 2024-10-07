import {useState } from 'react'


export const Quiz =()=>{

   const [answer,setAnswer]= useState("")
   const [error,setError]=useState('')
   const [status,setStatus]=useState('typing')

   if (status === 'success'){
      return <h1>That is right!</h1>
   }
   const handleSubmitQuiz = async (e)=>{
      e.preventDefault()
      setStatus('submitting')
      try {
         await getAnswer(answer)
         setStatus('success')
      } catch(error){
         setStatus('typing')
         setError(error)
      }
   }
   const getAnswer = (userAnswer)=>{
      return new Promise((resolve, reject)=>{
         setTimeout(()=>{
            let shouldError = userAnswer.toLowerCase() !=='lima'
            if(shouldError){
               reject(new Error(`Good guess but a wrong answer. Try again.`))
            } else {
               resolve()
            }
         },1500)
      })
   }
   const handleInputChange = (e)=>{
      setAnswer(e.target.value)
   }
   return (
      <div>
         <div className="main-quiz">
         <h3>In which city is there a billboard that turns air into drinkable water?</h3>
            <form onSubmit={handleSubmitQuiz}>
               <div>
                  <label htmlFor="answer">Answer:</label>
                  <input type="text" name="answer" id="answer" 
                     value={answer}
                     onChange={handleInputChange}
                     disabled={status==='submitting'}
                  />
               </div>
               <button type="submit" className="btn bnt-sm btn-primary"
                     disabled={answer.length===0 || status=== "submitting"}>Submit</button>
               {error!==null && <p className="alert alert-danger">{error.message}</p>}
            </form>
         </div>
      </div>
   )

}

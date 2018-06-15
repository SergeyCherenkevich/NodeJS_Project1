

const returnText = () => {
    setTimeout(()=>{
      return 'Hello form function' 
    },3000);
}

const returnText2 = () => {
   return new Promise ((resolve, reject)=>{
       setTimeout(()=>{
           resolve('Hello, from function')
       },3000) 
   })
}

let result = returnText();
console.log(result);


returnText2().then((text)=>{
       console.log(text)
   });
   
const returnText3 = ()=> new Promise((resolve,reject)=>{
    setTimeout(()=> {
        return 'Hello'
    },3000)
})

const mainfunc = async() => {
     let result = await returnText2() 
     console.log(result)
     let result1 = await returnText3()
     console.log(result1)
}
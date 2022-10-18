import axios from "axios"


 export async function  PostData (url,payload){
    try {
        const resp = await axios.post(url,payload);
        console.log(resp.data) 
    } catch (error) {
        console.error(error);
        
    }
    }

  export  async function DeleteData (key){
        const resp = await axios.delete(`http://localhost:9090/api/v1/loanDetails/${key}`)
        .then(resp =>{return resp.data })
        .catch(error =>{console.error(error); return Promise.reject(error)})

    
    }
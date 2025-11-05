import axios from "axios";

const serverURL = 'http://localhost:5000/api';

const loginUsingGoogle = async () => {
    try {
      const response = await axios.get(serverURL+'/auth/google');
      console.log(response.data); 
      return response.data;
    } catch (error) {
      console.error('Some error occurred:', error);
    }
}


export { loginUsingGoogle };
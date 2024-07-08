import axios from 'axios';
//Axios instance

export default axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// httpClient.js
import axios from 'axios';
import authenticate from './boxAuth.js';

const createClient = async () => {
  const accessToken = await authenticate();
  
  return axios.create({
    baseURL: 'https://api.box.com/2.0',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  });
};

export default createClient;

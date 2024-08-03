import axios from 'axios';

const createMondayClient = () => {
  const apiToken = process.env.MONDAY_API_TOKEN;

  return axios.create({
    baseURL: 'https://api.monday.com/v2',
    headers: {
      'Authorization': apiToken,
    }
  });
};

export default createMondayClient;

import axios from 'axios';

const apiToken = process.env.MONDAY_API_TOKEN;

class MondayHttpClient {
  constructor() {
    this.apiToken = apiToken;
    this.apiUrl = 'https://api.monday.com/v2';
  }

  async sendRequest(query) {
    try {
      const response = await axios({
        url: this.apiUrl,
        method: 'post',
        headers: {
          'Authorization': this.apiToken,
        },
        data: {
          query: query,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error making request to Monday.com:', error);
      throw error;
    }
  }
}

module.exports = MondayHttpClient;

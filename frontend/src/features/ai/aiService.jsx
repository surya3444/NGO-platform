import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai/';

// Get AI fundraising tips
const getFundraisingTips = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'fundraising-tips', config);
  return response.data;
};

const aiService = {
  getFundraisingTips,
};

export default aiService;
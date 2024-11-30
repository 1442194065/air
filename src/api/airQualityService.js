import axios from 'axios';

const API_TOKEN = '45a4edfcfe7bcdec6b08ee9ac712864043c96323'; // 请替换为你的实际令牌

/**
 * 获取指定城市或站点的实时空气质量数据。
 * @param {string} location - 城市名称或站点ID (例如: "beijing")
 * @returns {Promise<Object>} 包含空气质量数据的对象
 */

const API_URL = 'https://api.waqi.info/feed';

export function getAirQuality(location) {
    return axios.get(`${API_URL}/${location}/`, {
      params: { token: API_TOKEN },
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("Error fetching air quality data:", error);
        throw error;
      });
  }
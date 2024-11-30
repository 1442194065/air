/**
 * 处理从 API 获取的空气质量数据
 * @param {Object} data - API 返回的原始数据
 * @returns {Object} 处理后的数据
 */

export function processAirQualityData(data) {
    if (!data || !data.data) {
        throw new Error("Invalid data format");
      }
      const {
        aqi,
        idx,
        attributions,
        city,
        dominantpol,
        iaqi,
        time,
        forecast,
      } = data.data;
  
    // 提取当前时间、城市、AQI 和主导污染物
    const airQualityData = {
        city: {
          name: city.name,
          geo: city.geo, // 地理位置 [纬度, 经度]
          url: city.url,
        },
        aqi, // 空气质量指数
        idx, // 唯一的站点ID
        attributions, // 数据来源
        dominantpol, // 主导污染物
        iaqi, // 各种污染物指数
        time: {
          localTime: time.s,
          timestamp: time.v,
          isoTime: time.iso,
        },
        forecast: forecast.daily, // 未来7天的空气质量预测
      };
  
      return airQualityData;
  }
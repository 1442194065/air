import axios from 'axios';

const API_TOKEN = '45a4edfcfe7bcdec6b08ee9ac712864043c96323'; // ���滻Ϊ���ʵ������

/**
 * ��ȡָ�����л�վ���ʵʱ�����������ݡ�
 * @param {string} location - �������ƻ�վ��ID (����: "beijing")
 * @returns {Promise<Object>} ���������������ݵĶ���
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
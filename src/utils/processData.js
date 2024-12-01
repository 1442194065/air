/**
 * ����� API ��ȡ�Ŀ�����������
 * @param {Object} data - API ���ص�ԭʼ����
 * @returns {Object} ����������
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

    // ��ȡ��ǰʱ�䡢���С�AQI ��������Ⱦ��
    const airQualityData = {
        city: {
            name: city.name,
            geo: city.geo, // ����λ�� [γ��, ����]
            url: city.url,
        },
        aqi, // ��������ָ��
        idx, // Ψһ��վ��ID
        attributions, // ������Դ
        dominantpol, // ������Ⱦ��
        iaqi, // ������Ⱦ��ָ��
        time: {
            localTime: time.s,
            timestamp: time.v,
            isoTime: time.iso,
        },
        forecast: forecast.daily, // δ��7��Ŀ�������Ԥ��
    };

    return airQualityData;
}
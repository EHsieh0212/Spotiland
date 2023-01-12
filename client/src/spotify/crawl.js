import axios from 'axios';

export const predict = async (name, length, seeding, textSeed) => {
    const url = "http://54.254.122.144/predict";
    const data = { name:name, length:length, seeding:seeding, textSeed: textSeed};
    return axios({ method: 'post', url, data });
}
import axios from 'axios';

export const predict = async (name, length, seeding, textSeed) => {
    const url = "http://localhost:4004/predict";
    const data = { name:name, length:length, seeding:seeding, textSeed: textSeed};
    return axios({ method: 'post', url, data });
}
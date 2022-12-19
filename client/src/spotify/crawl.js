import axios from 'axios';

export const predict = async (name, length, seeding) => {
    const url = "http://localhost:4004/predict";
    const data = { name:name, length:length, seeding:seeding};
    return axios({ method: 'post', url, data });
}
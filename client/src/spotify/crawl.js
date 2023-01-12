import axios from 'axios';

export const predict = async (model, name, length, textSeed, seeding) => {
    const url = "http://localhost:4004/predict";
    const data = { model:model, name:name, length:length, textSeed: textSeed, seeding:seeding};
    return axios({ method: 'post', url, data });
}
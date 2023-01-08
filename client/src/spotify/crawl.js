import axios from 'axios';

export const predict = async (name, length, gram, textSeed, seeding) => {
    const url = "http://localhost:4004/predict";
    const data = { name:name, length:length, gram:gram, textSeed: textSeed, seeding:seeding};
    return axios({ method: 'post', url, data });
}
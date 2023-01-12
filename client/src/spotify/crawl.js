import axios from 'axios';

export const predict = async (name, length, seeding, textSeed) => {
    const url = "https://crawling.herokuapp.com/predict";
    const data = { name: name, length: length, seeding: seeding, textSeed: textSeed };
    return axios({
        method: 'post', url, data, headers: {
            'Content-Type': "application/json",
            'Accept': "application/json"
        }
    });
}
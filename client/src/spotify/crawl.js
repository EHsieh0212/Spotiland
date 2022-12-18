import axios from 'axios';

export const getCrawl = async () => {
    const a = await axios.get("http://localhost:4004/")
    console.log("a", a)
    return a.data.name
}
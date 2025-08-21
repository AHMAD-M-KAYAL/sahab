import axios from "axios";
export const baseURL="https://sahab.ghinashop.net/";
export default axios.create(
    {
        baseURL:"https://sahab.ghinashop.net",
        params:{}
    }
)
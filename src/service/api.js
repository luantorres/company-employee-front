import axios from 'axios';

export default axios.create({
    baseURL: 'https://luan-company-test-back.herokuapp.com/api/',
    responseType: 'json',
});

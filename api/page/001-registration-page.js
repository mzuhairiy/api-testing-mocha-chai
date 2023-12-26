const supertest = require("supertest");
const env = require("dotenv").config();
const api = supertest(process.env.BASE_URL);

const userRegistration = (data) => api.post('/registration')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(data);


module.exports = {
    userRegistration
}
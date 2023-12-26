const supertest = require("supertest");
const env = require("dotenv").config;
const api = supertest(process.env.BASE_URL);

const getAccessToken = (data) => api.post('/authentications')
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send(data);

module.exports = {
    getAccessToken
}
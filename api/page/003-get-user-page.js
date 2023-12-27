const supertest = require("supertest");
const env = require("dotenv").config;
const api = supertest(process.env.BASE_URL);

const getAllUser = (token) => api.get('/users')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const getUserById = (token, userId) => api.get(`/users/${userId}`)
   .set('Content-Type', 'application/json')
   .set('Accept', 'application/json')
   .set('Authorization', `Bearer ${token}`)

module.exports = {
    getAllUser,
    getUserById
};
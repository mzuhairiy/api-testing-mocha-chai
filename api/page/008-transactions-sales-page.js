const supertest = require("supertest");
const env = require("dotenv").config;
const api = supertest(process.env.BASE_URL);

const addSales = (token, data) => api.post(`/sales`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data)

const getListSales = (token, currentDate, futureDate) => api.get(`/sales?startDate=${currentDate}&endDate=${futureDate}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const getSalesOrderById = (token, salesId) => api.get(`/sales/${salesId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

module.exports = {
    addSales,
    getListSales,
    getSalesOrderById,
}

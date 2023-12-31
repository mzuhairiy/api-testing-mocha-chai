const supertest = require("supertest");
const env = require("dotenv").config;
const api = supertest(process.env.BASE_URL);

const addCustomer = (token, data) => api.post(`/customers`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data)

const getCustomers = (token) => api.get('/customers')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const getCustomerById = (token, customerId) => api.get(`/customers/${customerId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const updateCustomer = (token, customerId, data) => api.put(`/customers/${customerId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data)

const deleteCustomer = (token, customerId) => api.delete(`/customers/${customerId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

module.exports = {
    addCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
}

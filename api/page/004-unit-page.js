const supertest = require("supertest");
const env = require("dotenv").config;
const api = supertest(process.env.BASE_URL);

const addUnit = (token, data) => api.post(`/units`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data)

const getUnits = (token) => api.get('/units')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const getUnitById = (token, unitId) => api.get(`/units/${unitId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const updateUnit = (token, unitId, data) => api.put(`/units/${unitId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data)

const deleteUnit = (token, unitId) => api.delete(`/units/${unitId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

module.exports = {
    addUnit,
    getUnits,
    getUnitById,
    updateUnit,
    deleteUnit
}

const supertest = require("supertest");
const env = require("dotenv").config;
const api = supertest(process.env.BASE_URL);

const addCategory = (token, data) => api.post(`/categories`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data)

const getCategories = (token) => api.get('/categories')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const getCategoryById = (token, categoryId) => api.get(`/categories/${categoryId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

const updateCategory = (token, categoryId, data) => api.put(`/categories/${categoryId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data)

const deleteCategory = (token, categoryId) => api.delete(`/categories/${categoryId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)

module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}

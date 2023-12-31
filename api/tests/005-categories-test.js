const assert = require('chai').expect;
const { getAccessToken } = require('../page/002-auth-page');
const { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../page/005-categories-page');
const { faker } = require('@faker-js/faker');
const { categoriesData } = require('../data/005-categories-data');


const testCase = {
    positive : {
        createWithValidData : "As a User, I want to create a new category with valid data",
        createWithEmptyDescription : "As a User, I want to create a new category with empty description",
        getAllCategoryWithValidToken : "As a User, I want to get all category",
        getWithValidCategoryId : "As a User, I want to get a category by id",
        updateWithValidData : "As a User, I want to update a category with valid data",
        deleteCategory : "As a User, I want to delete a category"
    },
    negative : {
        createWithInvalidToken : "As a User, I should got an error when trying to create a new category with invalid token",
        createWithEmptyName : "As a User, I should got an error when trying to create a new category with empty name",
        getAllCategoryWithInvalidToken : "As a User, I should got an error when trying to get all category with invalid token",
        getWithInvalidCategoryId : "As a User, I should got an error when trying to get a category with invalid unit id",
        updateWithInvalidCategoryId : "As a User, I should got an error when trying to update a category with invalid unit id",
    }
}

let accessToken;
let categoryId;
let emptyDescCategoryData = {
    "name" : "KG",
    "description" : ""
};
let emptyNameCategoryData = {
    "name" : "",
    "description" : "Makanan Sapi"
};
let authData = {
    "email": "toko@toki.com",
    "password": "1234567"
}

describe('Categories Endpoint', () => {
    before(async () => {
        const response = await getAccessToken(authData);
        //console.log(response);
        assert(response.status).to.equal(201);
        accessToken = response.body.data;
        //console.log(accessToken);
    })

    it(`@categories ${testCase.positive.createWithValidData}`, async() => {
        //hit api and check
        const response = await addCategory(accessToken.accessToken, categoriesData);
        //console.log(response.body.data);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Category berhasil ditambahkan');

        //take some response data and show the data
        categoryId = response.body.data.categoryId;
    })

    it(`@categories ${testCase.positive.createWithEmptyDescription}`, async() => {
        //hit api and check
        const response = await addCategory(accessToken.accessToken, emptyDescCategoryData);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Category berhasil ditambahkan');
    })

    it(`@categories ${testCase.positive.getAllCategoryWithValidToken}`, async() => {
        //hit api and check
        const response = await getCategories(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@categories ${testCase.positive.getWithValidCategoryId}`, async() => {
        //hit api and check
        const response = await getCategoryById(accessToken.accessToken, categoryId);
        //console.log(response.body.data);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@categories ${testCase.positive.updateWithValidData}`, async() => {
        //hit api and check
        categoryId.name = faker.word.noun();

        const response = await updateCategory(accessToken.accessToken, categoryId, categoriesData);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@categories ${testCase.positive.deleteCategory}`, async() => {
        //hit api and check
        const response = await deleteCategory(accessToken.accessToken, categoryId);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@categories ${testCase.negative.createWithInvalidToken}`, async() => {
        //hit api and check
        const response = await addCategory(accessToken.accessToken + '1', categoriesData);
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@categories ${testCase.negative.createWithEmptyName}`, async() => {
        //hit api and check
        const response = await addCategory(accessToken.accessToken, emptyNameCategoryData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"name\" is not allowed to be empty');
    })

    it(`@categories ${testCase.negative.getAllCategoryWithInvalidToken}`, async() => {
        //hit api and check
        const response = await getCategories(accessToken.accessToken + '1');
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@categories ${testCase.negative.getWithInvalidCategoryId}`, async() => {
        //hit api and check
        const response = await getCategoryById(accessToken.accessToken, categoryId + '1');
        // console.log(response);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })

    it(`@categories ${testCase.negative.updateWithInvalidCategoryId}`, async() => {
        //hit api and check
        const response = await updateCategory(accessToken.accessToken, categoryId + 'X', categoriesData);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })
})
const assert = require('chai').expect;
const { getAccessToken } = require('../page/002-auth-page');
const { addCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../page/006-customers-page');
const { faker } = require('@faker-js/faker');
const { customerData } = require('../data/006-customers-data');

const testCase = {
    positive : {
        createWithValidData : "As a User, I want to create a new customer with valid data",
        createWithEmptyDescription : "As a User, I want to create a new customer with empty description",
        getAllCustomerWithValidToken : "As a User, I want to get all customer",
        getWithValidCustomerId : "As a User, I want to get a customer by id",
        updateWithValidData : "As a User, I want to update a customer with valid data",
        deleteCustomer : "As a User, I want to delete a customer"
    },
    negative : {
        createWithInvalidToken : "As a User, I should got an error when trying to create a new customer with invalid token",
        createWithEmptyName : "As a User, I should got an error when trying to create a new customer with empty name",
        getAllCustomerWithInvalidToken : "As a User, I should got an error when trying to get all customer with invalid token",
        getWithInvalidCustomerId : "As a User, I should got an error when trying to get a customer with invalid unit id",
        updateWithInvalidCustomerId : "As a User, I should got an error when trying to update a customer with invalid unit id",
    }
}

let accessToken;
let customerId;
let emptyDescCustomerData = {
    "name" : "KG",
    "description" : ""
};
let emptyNameCustomerData = {
    "name" : "",
    "description" : "Makanan Sapi"
};
let authData = {
    "email": "toko@toki.com",
    "password": "1234567"
}

describe('Customers Endpoint', () => {
    before(async () => {
        const response = await getAccessToken(authData);
        //console.log(response);
        assert(response.status).to.equal(201);
        accessToken = response.body.data;
        //console.log(accessToken);
    })

    it(`@customers ${testCase.positive.createWithValidData}`, async() => {
        //hit api and check
        const response = await addCustomer(accessToken.accessToken, customerData);
        //console.log(response.body.data);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Customer berhasil ditambahkan');

        //take some response data and show the data
        customerId = response.body.data.customerId;
    })

    it(`@customers ${testCase.positive.createWithEmptyDescription}`, async() => {
        //hit api and check
        const response = await addCustomer(accessToken.accessToken, emptyDescCustomerData);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Customer berhasil ditambahkan');
    })

    it(`@customers ${testCase.positive.getAllCustomerWithValidToken}`, async() => {
        //hit api and check
        const response = await getCustomers(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@customers ${testCase.positive.getWithValidCustomerId}`, async() => {
        //hit api and check
        const response = await getCustomerById(accessToken.accessToken, customerId);
        //console.log(response.body.data);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@customers ${testCase.positive.updateWithValidData}`, async() => {
        //hit api and check
        customerId.name = faker.word.noun();

        const response = await updateCustomer(accessToken.accessToken, customerId, customerData);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@customers ${testCase.positive.deleteCustomer}`, async() => {
        //hit api and check
        const response = await deleteCustomer(accessToken.accessToken, customerId);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@customers ${testCase.negative.createWithInvalidToken}`, async() => {
        //hit api and check
        const response = await addCustomer(accessToken.accessToken + '1', customerData);
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@customers ${testCase.negative.createWithEmptyName}`, async() => {
        //hit api and check
        const response = await addCustomer(accessToken.accessToken, emptyNameCustomerData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"name\" is not allowed to be empty');
    })

    it(`@customers ${testCase.negative.getAllCustomerWithInvalidToken}`, async() => {
        //hit api and check
        const response = await getCustomers(accessToken.accessToken + '1');
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@customers ${testCase.negative.getWithInvalidCustomerId}`, async() => {
        //hit api and check
        const response = await getCustomerById(accessToken.accessToken, customerId + '1');
        // console.log(response);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })

    it(`@customers ${testCase.negative.updateWithInvalidCustomerId}`, async() => {
        //hit api and check
        const response = await updateCustomer(accessToken.accessToken, customerId + 'X', customerData);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })
})

module.exports = {
    customerId
}
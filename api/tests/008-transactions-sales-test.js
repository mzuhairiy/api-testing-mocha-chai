const assert = require('chai').expect;
const { salesData } = require('../data/008-transactions-sales-data');
const { getAccessToken } = require('../page/002-auth-page');
const { addSales, getListSales, getSalesOrderById } = require('../page/008-transactions-sales-page');
const { faker } = require('@faker-js/faker');

const testCase = {
    positive : {
        createWithValidData : "As a User, I want to create a sales transaction valid data",
        getAllSalesWithValidToken : "As a User, I want to get all sales data with valid token",
        getAllSlaesWithValidDate : "As a User, I want to get all sales data with valid date",
        getWithValidSalesId : "As a User, I want to get a sales by id",
    },
    negative : {
        createWithInvalidToken : "As a User, I should got an error when trying to create a sales transaction with invalid token",
        createWithInvalidOfficeId : "As a User, I should got an error when trying to create a transaction with invalid office id",
        createWithInvalidCustomerId : "As a User, I should got an error when trying to create a transaction with invalid customer id",
        createWithEmptyDate : "As a User, I should got an error when trying to create a transaction with empty date",
        createWithEmptyInvoice : "As a User, I should got an error when trying to create a transaction with empty invoice",
        createWithEmptyAmount : "As a User, I should got an error when trying to create a transaction with empty amount",
        createWithInvalidDiscount : "As a User, I should got an error when trying to create a transaction with invalid discount",
        createWithInvalidProductId : "As a User, I should got an error when trying to create a transaction with invalid product id",
        createWithInvalidQty : "As a User, I should got an error when trying to create a transaction with invalid quantity",
        createWithInvalidPrice : "As a User, I should got an error when trying to create a transaction with invalid price",
        getAllSalesWithInvalidToken : "As a User, I should got an error when trying to get all transaction with invalid token",
        getAllSalesWithInvalidDate : "As a User, I should got an error when trying to get all transaction with invalid date",
        getWithInvalidSalesId : "As a User, I should got an error when trying to get a Product with invalid unit id",
    }
}

let accessToken;
let salesId;

let emptyCodeProductData = {
    "category_id" : categoryId,
    "code": "",
    "name": "A Product",
    "price": "3500",
    "cost": "3000",
    "stock": "5"
};

let emptyNameProductData = {
    "category_id" : categoryId,
    "code": "A314ASDDFIER3432",
    "name": "",
    "price": "3500",
    "cost": "3000",
    "stock": "5"
};

let emptyPriceProductData = {
    "category_id" : categoryId,
    "code": "A314ASDDFIER3432",
    "name": "A Product",
    "price": "",
    "cost": "3000",
    "stock": "5"
};

let emptyCostProductData = {
    "category_id" : categoryId,
    "code": "A314ASDDFIER3432",
    "name": "A Product",
    "price": "3500",
    "cost": "",
    "stock": "5"
};

let emptyStockProductData = {
    "category_id" : categoryId,
    "code": "A314ASDDFIER3432",
    "name": "A Product",
    "price": "3500",
    "cost": "3000",
    "stock": ""
};

let higherCostProductData = {
    "category_id" : categoryId,
    "code": "A314ASDDFIER3432",
    "name": "A Product",
    "price": "1000",
    "cost": "3000",
    "stock": "5"
};

let authData = {
    "email": "toko@toki.com",
    "password": "1234567"
}

describe('sales Endpoint', () => {
    before(async () => {
        const response = await getAccessToken(authData);
        //console.log(response);
        assert(response.status).to.equal(201);
        accessToken = response.body.data;
        //console.log(accessToken);
    })

    it(`@sales ${testCase.positive.createWithValidData}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, productData);
        //console.log(response.body.data);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Product berhasil ditambahkan');

        //take some response data and show the data
        productId = response.body.data.productId;
    })

    it(`@sales ${testCase.positive.getAllsalesWithValidToken}`, async() => {
        //hit api and check
        const response = await getsales(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@sales ${testCase.positive.getWithValidProductId}`, async() => {
        //hit api and check
        const response = await getProductById(accessToken.accessToken, productId);
        //console.log(response.body.data);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@sales ${testCase.positive.updateWithValidData}`, async() => {
        //hit api and check
        productData.name = faker.word.noun();

        const response = await updateProduct(accessToken.accessToken, productId, productData);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Product berhasil diupdate');
    })

    it(`@sales ${testCase.positive.deleteProduct}`, async() => {
        //hit api and check
        const response = await deleteProduct(accessToken.accessToken, productId);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Product berhasil dihapus');
    })

    it(`@sales ${testCase.negative.createWithInvalidToken}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken + '1', productId);
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@sales ${testCase.negative.createWithEmptyCode}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyCodeProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"code\" is not allowed to be empty');
    })

    it(`@sales ${testCase.negative.createWithEmptyName}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyNameProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"name\" is not allowed to be empty');
    })

    it(`@sales ${testCase.negative.createWithEmptyPrice}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyPriceProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"price\" must be a number');
    })

    it(`@sales ${testCase.negative.createWithEmptyCost}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyCostProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"cost\" must be a number');
    })

    it(`@sales ${testCase.negative.createWithEmptyStock}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyStockProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"stock\" must be a number');
    })

    it(`@sales ${testCase.negative.createWithHigherCost}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, higherCostProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"price\" must be greater than ref:cost');
    })

    it(`@sales ${testCase.negative.getAllsalesWithInvalidToken}`, async() => {
        //hit api and check
        const response = await getsales(accessToken.accessToken + '1');
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@sales ${testCase.negative.getWithInvalidProductId}`, async() => {
        //hit api and check
        const response = await getProductById(accessToken.accessToken, productId + '1');
        // console.log(response);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })

    it(`@sales ${testCase.negative.updateWithInvalidProductId}`, async() => {
        //hit api and check
        const response = await updateProduct(accessToken.accessToken, productId + 'X', productData);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })
})
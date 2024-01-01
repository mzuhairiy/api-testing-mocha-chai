const assert = require('chai').expect;
const { getAccessToken } = require('../page/002-auth-page');
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../page/007-products-page');
const { faker } = require('@faker-js/faker');
const { productData } = require('../data/007-products-data');
const { categoryId } = require('./005-categories-test');

const testCase = {
    positive : {
        createWithValidData : "As a User, I want to create a new Product with valid data",
        getAllProductsWithValidToken : "As a User, I want to get all Products with valid token",
        getWithValidProductId : "As a User, I want to get a Product by id",
        updateWithValidData : "As a User, I want to update a Product with valid data",
        deleteProduct : "As a User, I want to delete a Product"
    },
    negative : {
        createWithInvalidToken : "As a User, I should got an error when trying to create a new Product with invalid token",
        createWithInvalidCategoryId : "As a User, I should got an error when trying to create a new Product with invalid category id",
        createWithEmptyCode : "As a User, I should got an error when trying to create a new Product with invalid category id",
        createWithEmptyName : "As a User, I should got an error when trying to create a new Product with empty name",
        createWithEmptyPrice : "As a User, I should got an error when trying to create a new Product with empty price",
        createWithEmptyCost : "As a User, I should got an error when trying to create a new Product with empty cost",
        createWithEmptyStock : "As a User, I should got an error when trying to create a new Product with empty stock",
        createWithHigherCost : "As a User, I should got an error when trying to create a new Product with cost higher than price",
        getAllProductsWithInvalidToken : "As a User, I should got an error when trying to get all Product with invalid token",
        getWithInvalidProductId : "As a User, I should got an error when trying to get a Product with invalid unit id",
        updateWithInvalidProductId : "As a User, I should got an error when trying to update a Product with invalid unit id",
    }
}

let accessToken;
let productId;

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

describe('Products Endpoint', () => {
    before(async () => {
        const response = await getAccessToken(authData);
        //console.log(response);
        assert(response.status).to.equal(201);
        accessToken = response.body.data;
        //console.log(accessToken);
    })

    it(`@products ${testCase.positive.createWithValidData}`, async() => {
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

    it(`@products ${testCase.positive.getAllProductsWithValidToken}`, async() => {
        //hit api and check
        const response = await getProducts(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@products ${testCase.positive.getWithValidProductId}`, async() => {
        //hit api and check
        const response = await getProductById(accessToken.accessToken, productId);
        //console.log(response.body.data);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@products ${testCase.positive.updateWithValidData}`, async() => {
        //hit api and check
        productData.name = faker.word.noun();

        const response = await updateProduct(accessToken.accessToken, productId, productData);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Product berhasil diupdate');
    })

    it(`@products ${testCase.positive.deleteProduct}`, async() => {
        //hit api and check
        const response = await deleteProduct(accessToken.accessToken, productId);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Product berhasil dihapus');
    })

    it(`@products ${testCase.negative.createWithInvalidToken}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken + '1', productId);
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@products ${testCase.negative.createWithEmptyCode}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyCodeProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"code\" is not allowed to be empty');
    })

    it(`@products ${testCase.negative.createWithEmptyName}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyNameProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"name\" is not allowed to be empty');
    })

    it(`@products ${testCase.negative.createWithEmptyPrice}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyPriceProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"price\" must be a number');
    })

    it(`@products ${testCase.negative.createWithEmptyCost}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyCostProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"cost\" must be a number');
    })

    it(`@products ${testCase.negative.createWithEmptyStock}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, emptyStockProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"stock\" must be a number');
    })

    it(`@products ${testCase.negative.createWithHigherCost}`, async() => {
        //hit api and check
        const response = await addProduct(accessToken.accessToken, higherCostProductData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"price\" must be greater than ref:cost');
    })

    it(`@products ${testCase.negative.getAllProductsWithInvalidToken}`, async() => {
        //hit api and check
        const response = await getProducts(accessToken.accessToken + '1');
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@products ${testCase.negative.getWithInvalidProductId}`, async() => {
        //hit api and check
        const response = await getProductById(accessToken.accessToken, productId + '1');
        // console.log(response);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })

    it(`@products ${testCase.negative.updateWithInvalidProductId}`, async() => {
        //hit api and check
        const response = await updateProduct(accessToken.accessToken, productId + 'X', productData);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })
})
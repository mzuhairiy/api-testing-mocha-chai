const assert = require('chai').expect;
const { getAccessToken } = require('../page/002-auth-page');
const { addUnit, getUnits, getUnitById, updateUnit, deleteUnit } = require('../page/004-unit-page');
const { faker } = require('@faker-js/faker');
const { unitData } = require('../data/004-unit-data');

const testCase = {
    positive : {
        createWithValidData : "As a User, I want to create a new unit with valid data",
        createWithEmptyDescription : "As a User, I want to create a new unit with empty description",
        getAllUnitsWithValidToken : "As a User, I want to get all units",
        getWithValidUnitId : "As a User, I want to get a unit by id",
        updateWithValidData : "As a User, I want to update a unit with valid data",
        deleteUnit : "As a User, I want to delete a unit"
    },
    negative : {
        createWithInvalidToken : "As a User, I should got an error when trying to create a new unit with invalid token",
        createWithEmptyName : "As a User, I should got an error when trying to create a new with empty name",
        getAllUnitsWithInvalidToken : "As a User, I should got an error when trying to get all units with invalid token",
        getWithInvalidUnitId : "As a User, I should got an error when trying to get an unit with invalid unit id",
        updateWithInvalidUnitId : "As a User, I should got an error when trying to update an unit with invalid unit id",
    }
}

let accessToken;
let unitId;
let emptyDescUnitData = {
    "name" : "KG",
    "description" : ""
};
let emptyNameUnitData = {
    "name" : "",
    "description" : "berat container"
};
let authData = {
    "email": "toko@toki.com",
    "password": "1234567"
}

describe('Units Endpoint', () => {
    before(async () => {
        const response = await getAccessToken(authData);
        //console.log(response);
        assert(response.status).to.equal(201);
        accessToken = response.body.data;
        //console.log(accessToken);
    })

    it(`@unit ${testCase.positive.createWithValidData}`, async() => {
        //hit api and check
        const response = await addUnit(accessToken.accessToken, unitData);
        //console.log(response.body.data);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Unit berhasil ditambahkan');

        //take some response data and show the data
        unitId = response.body.data.unitId;
        //console.log(unitId);
    })

    it(`@unit ${testCase.positive.createWithEmptyDescription}`, async() => {
        //hit api and check
        const response = await addUnit(accessToken.accessToken, emptyDescUnitData);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Unti berhasil ditambahkan');
    })

    it(`@unit ${testCase.positive.getAllUnitsWithValidToken}`, async() => {
        //hit api and check
        const response = await getUnits(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@unit ${testCase.positive.getWithValidUnitId}`, async() => {
        //hit api and check
        const response = await getUnitById(accessToken.accessToken, unitId);
        //console.log(response.body.data);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@unit ${testCase.positive.updateWithValidData}`, async() => {
        //hit api and check
        unitData.name = faker.word.noun();

        const response = await updateUnit(accessToken.accessToken, unitId, unitData);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@unit ${testCase.positive.deleteUnit}`, async() => {
        //hit api and check
        const response = await deleteUnit(accessToken.accessToken, unitId);
        assert(response.status).to.equal(200);
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.status).to.equal('success');
    })

    it(`@unit ${testCase.negative.createWithInvalidToken}`, async() => {
        //hit api and check
        const response = await addUnit(accessToken.accessToken + '1', unitData);
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@unit ${testCase.negative.createWithEmptyName}`, async() => {
        //hit api and check
        const response = await addUnit(accessToken.accessToken, emptyNameUnitData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('name is required, description is optional');
    })

    it(`@unit ${testCase.negative.getAllUnitsWithInvalidToken}`, async() => {
        //hit api and check
        const response = await getUnits(accessToken.accessToken + '1');
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["statusCode", "error", "message", "attributes"]);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@unit ${testCase.negative.getWithInvalidUnitId}`, async() => {
        //hit api and check
        const response = await getUnitById(accessToken.accessToken, unitId + '1');
        // console.log(response);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })

    it(`@unit ${testCase.negative.updateWithInvalidUnitId}`, async() => {
        //hit api and check
        const response = await updateUnit(accessToken.accessToken, unitId + 'X', unitData);
        assert(response.status).to.equal(404);
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })
})
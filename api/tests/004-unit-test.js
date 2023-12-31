const assert = require('chai').expect;
const { getAccessToken } = require('../page/002-auth-page');
const { addUnit, getUnits, getUnitById, updateUnit, deleteUnit } = require('../page/004-unit-page');
const { faker } = require('@faker-js/faker');
const { unitData } = require('../data/004-unit-data');
const { authData } = require('../data/002-auth-data');

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
        createWithInvalidToken : "As a User, I should got an error when trying to create with invalid token",
        createWithEmptyToken : "As a User, I shoukd got an error when trying to create with empty token",
        createWithEmptyName : "As a User, I should got an error when trying to create with empty name",
        getAllUnitsWithInvalidToken : "As a User, I should got an error when trying to get all units with invalid token",
        getAllUnitsWithEmptyToken : "As a User, I should got an error when trying to get all units with empty token",
        getWithInvalidUnitId : "As a User, I should got an error when trying to get an unit with invalid unit id",
        getWithEmptyUnitId : "As a User, I should got an error when trying to get an unit with empty unit id",
        updateWithInvalidUnitId : "As a User, I should got an error when trying to update an unit with invalid unit id",
        updateWithEmptyUnitId : "As a User, I should got an error when trying to update an unit with empty unit id",
    }
}

let accessToken;
let unitId;

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

    // it(`@unit ${testCase.positive.createWithEmptyDescription}`, async() => {
    //     //hit api and check
    //     unitData.description = "";
    //     const response = await addUnit(accessToken.accessToken, unitData);
    //     assert(response.status).to.equal(201);
    //     assert(response.body).to.have.keys(["status", "message", "data"]);
    //     assert(response.body.status).to.equal('success');
    //     assert(response.body.message).to.equal('Unti berhasil ditambahkan');
    // })

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
})
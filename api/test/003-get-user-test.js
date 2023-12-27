const { describe } = require('mocha');
const { getAccessToken } = require('../page/002-auth-page');
const { getAllUser } = require('../page/003-get-user-page');
const { authData } = require('../data/002-auth-data');
const assert = require('chai').expect;

const testCase = {
    positive : {
        getAccessToken : "As a User, I want to get access token with valid data",
        getAllUsers : "As a User, I want to get all users",
        getUserById : "As a User, I want to get users by user id"
    },
    negative : {
        invalidToken : "As a User, I should got an error when I send request with invalid token",
        emptyToken : "As a User, I should got an error when I send request with empty token",
        invalidUserId : "As a User, I should got an error when I send request with invalid user id",
        emptyUserId : "As a User, I should got an error when I send request with empty user id"
    }
}

let accessToken;

describe('Get Users', () => {
    before(async() => {
        const response = await getAccessToken(authData);
        assert(response.status).to.equal(201);
        //console.log(response.body);
        accessToken = response.body.data;
        console.log(accessToken);
    })

    it(`@get ${testCase.positive.getAllUsers}`, async() => {
        const response = await getAllUser(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.data).to.be.an('object');
    })

    it(`@get ${testCase.positive.getUserById}`, async() => {
    });
})
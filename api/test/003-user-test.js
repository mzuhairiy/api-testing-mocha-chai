const { describe } = require('mocha');
const { getAccessToken } = require('../page/002-auth-page');
const { getAllUser, getUserById, updateUser } = require('../page/003-user-page');
//const { authData } = require('../data/002-auth-data');
const { authTest } = require('./002-auth-test');
const assert = require('chai').expect;

const testCase = {
    positive : {
        getAccessToken : "As a User, I want to get access token with valid data",
        getAllUsers : "As a User, I want to get all users",
        getUserById : "As a User, I want to get users by user id",
        updateUser : "As a User, I want to update my data with valid data"
    },
    negative : {
        invalidToken : "As a User, I should got an error when I send request with invalid token",
        emptyToken : "As a User, I should got an error when I send request with empty token",
        invalidUserId : "As a User, I should got an error when I send request with invalid user id",
    }
}

let accessToken;
let userId = '11a168f2-099a-4a66-b350-951a5cd65090';
let userData = {
    "name" : "tokotoku",
    "email" : "tokitoki@gmail.com"
}
let authData = {
    "email": "toko@toki.com",
    "password": "1234567"
}

describe('Users Endpoint', () => {
    before(async() => {
        const response = await getAccessToken(authData);
        //console.log(response);
        assert(response.status).to.equal(201);
        accessToken = response.body.data;
       //console.log(accessToken);
    })

    it(`@user ${testCase.positive.getAllUsers}`, async() => {
        const response = await getAllUser(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.data).to.be.an('object');
    })

    it(`@user ${testCase.positive.getUserById}`, async() => {
        const response = await getUserById(accessToken.accessToken, userId);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.data).to.be.an('object');
    })

    it(`@user ${testCase.negative.invalidToken}`, async() => {
        const response = await getUserById(accessToken.accessToken + '1', userId);
        assert(response.status).to.equal(401);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@user ${testCase.negative.emptyToken}`, async() => {
        const response = await getUserById('', userId);
        assert(response.status).to.equal(401);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Bad HTTP authentication header format');
    })

    it(`@user ${testCase.negative.invalidUserId}`, async() => {
        const response = await getUserById(accessToken.accessToken, userId + '1');
        assert(response.status).to.equal(404);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })

    it(`@user ${testCase.positive.updateUser}`, async() => {
        const response = await updateUser(accessToken.accessToken, userId, userData);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.data).to.be.an('object');
        //console.log(response.body);
    })
    
})
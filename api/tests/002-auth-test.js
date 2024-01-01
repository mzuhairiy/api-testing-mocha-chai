const assert = require('chai').expect;
const { faker } = require('@faker-js/faker');
const { authData } = require('../data/002-auth-data');
const { getAccessToken } = require('../page/002-auth-page');

const testCase = {
    positive : {
        validData : "As a User, I want to be able to login with valid data",
        getAccessToken : "As a System, I want to be able to get access token"
    },
    negative : {
        invalidCredentials : "As a User, I should got an error message when I login with invalid credential",
        invalidEmail : "As a User, I should got an error message when I login with invalid email",
        invalidPassword : "As a User, I should got an error message when I login with invalid password",
        emptyEmail : "As a User, I should got an error message when I login with an empty email",
        emptyPassowrd : "As a User, I should got an error message when I login with an empty password",
    },
}

const expectedAuthKeys = [
    "data", "status", "message"
]

let accessToken;
let officeId;

describe('Authentication Endpoint', () => {
    it(`@auth ${testCase.positive.validData}`, async () => {
        //hit api and check
        const response = await getAccessToken(authData);
        //console.log(response.body)
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["message", "status", "data"]);
        assert(response.body).to.have.keys(expectedAuthKeys);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Authentication berhasil ditambahkan');

        //take some response data and show the data
        accessToken = response.body.data.accessToken;
        officeId = response.body.data.officeId;
        //console.log(accessToken);
    })

    it(`@auth ${testCase.negative.invalidCredentials}`, async () => {
        //compose request data
        authData.email = faker.internet.email();
        authData.password = faker.internet.password();

        //hit api and check
        const response = await getAccessToken(authData);
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["message", "status"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('Kredensial yang Anda berikan salah');
    })

    it(`@auth ${testCase.negative.invalidEmail}`, async () => {
        //compose request data
        authData.email = ("abc");
        authData.password = faker.internet.password();

        //hit api and check
        const response = await getAccessToken(authData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["message", "status"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"email\" must be a valid email');
    })

    it(`@auth ${testCase.negative.invalidPassword}`, async () => {
        //compose request data
        authData.email = faker.internet.email();
        authData.password = faker.internet.password();

        //hit api and check
        const response = await getAccessToken(authData);
        assert(response.status).to.equal(401);
        assert(response.body).to.have.keys(["message", "status"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('Kredensial yang Anda berikan salah');
    })

    it(`@auth ${testCase.negative.emptyEmail}`, async () => {
        //compose request data
        authData.email = ("");

        //hit api and check
        const response = await getAccessToken(authData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["message", "status"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"email\" is not allowed to be empty');
    })

    it(`@auth ${testCase.negative.emptyPassowrd}`, async () => {
        //compose request data
        authData.email = faker.internet.email();
        authData.password = ("");

        //hit api and check
        const response = await getAccessToken(authData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["message", "status"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"password\" is not allowed to be empty');
    })
});

module.exports = {
    accessToken,
    officeId
}
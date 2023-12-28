const { describe } = require('mocha');
const { getAccessToken } = require('../page/002-auth-page');
const { getAllUser, getUserById, updateUser, addUser, deleteUser } = require('../page/003-user-page');
const { faker } = require('@faker-js/faker');
const assert = require('chai').expect;

const testCase = {
    positive : {
        getAccessToken : "As a User, I want to get access token with valid data",
        addUserWithValidData: "As a User, I want to add new user with valid data",
        getAllUsers : "As a User, I want to get all users",
        getUserById : "As a User, I want to get users by user id",
        updateUser : "As a User, I want to update my data with valid data",
        deleteUser : "As a System, I want to delete a user"
    },
    negative : {
        addWithInvalidToken : "As a User, I should got an error when I add new user with invalid token",
        addWithInvalidEmail : "As a User, I should got an error when I add new user with invalid email",
        addWithEmptyEmail : "As a User, I should got an error when I add new user with invalid email",
        addWithEmptyPassword : "As a User, I should got an error when I add new user with empty password",
        getWithInvalidToken : "As a User, I should got an error when I get user with invalid token",
        getWithEmptyToken : "As a User, I should got an error when I get user with empty token",
        getWithInvalidUserId : "As a User, I should got an error when I get user with invalid user id",
        updateWithEmptyEmail : "As a User, I should got an error when I updated my data with empty email",
        updateWithInvalidEmail : "As a User, I should got an error when I updated my data with invalid email",
        updateWithEmptyName : "As a User, I should got an error when I updated my data with empty name",
        
    }
}

let accessToken;
let userId;

let newUser = {
    "name" : faker.person.firstName(),
    "email" : faker.internet.email(),
    "password" : faker.internet.password()
}

let newUserInvalidEmail = {
    "name" : faker.person.firstName(),
    "email" : "aaa",
    "password" : faker.internet.password()
}

let newUserEmptyPassword = {
    "name" : faker.person.firstName(),
    "email" : faker.internet.email(),
    "password" : ""
}

let authData = {
    "email": "toko@toki.com",
    "password": "1234567"
}

let userData = {
    "name" : "tokotoku",
    "email" : "tokitoki@gmail.com"
}


describe('Users Endpoint', () => {
    before(async() => {
        const response = await getAccessToken(authData);
        //console.log(response);
        assert(response.status).to.equal(201);
        accessToken = response.body.data;
       //console.log(accessToken);
    })

    it(`@user ${testCase.positive.addUser}`, async() => {
        const response = await addUser(accessToken.accessToken, newUser);
        assert(response.status).to.equal(201);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "data", "message"]);
        assert(response.body.data).to.be.an('object');
        userId = response.body.data;
    })

    it(`@user ${testCase.positive.getAllUsers}`, async() => {
        const response = await getAllUser(accessToken.accessToken);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.data).to.be.an('object');
    })

    it(`@user ${testCase.positive.getUserById}`, async() => {
        const response = await getUserById(accessToken.accessToken, userId.userId);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "data"]);
        assert(response.body.data).to.be.an('object');
    })

    it(`@user ${testCase.positive.addUserWithValidData}`, async() => {
        const response = await addUser(accessToken.accessToken, newUser);
        assert(response.status).to.equal(201);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "data", "message"]);
        assert(response.body.data).to.be.an('object');
        userId = response.body.data;
    })

    it(`@user ${testCase.negative.addWithInvalidToken}`, async() => {
        const response = await addUser(accessToken.accessToken + '1', newUser);
        assert(response.status).to.equal(401);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@user ${testCase.negative.addWithInvalidEmail}`, async() => {
        const response = await addUser(accessToken.accessToken, newUserInvalidEmail);
        assert(response.status).to.equal(400);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"email\" must be a valid email');
    })

    it(`@user ${testCase.negative.addWithEmptyEmail}`, async() => {
        newUser.email = ("");
        const response = await addUser(accessToken.accessToken, newUser);
        //console.log(response);
        assert(response.status).to.equal(400);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"email\" is not allowed to be empty');
    })

    it(`@user ${testCase.negative.addWithEmptyPassword}`, async() => {
        const response = await addUser(accessToken.accessToken, newUserEmptyPassword);
        //console.log(response);
        assert(response.status).to.equal(400);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"password\" is not allowed to be empty');
    })

    it(`@user ${testCase.positive.updateUser}`, async() => {
        userData.name = faker.person.firstName();
        userData.email = faker.internet.email();

        const response = await updateUser(accessToken.accessToken, userId.userId, userData);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "message", "data"]);
        assert(response.body.data).to.be.an('object');
        //console.log(response.body);
    })

    it(`@user ${testCase.negative.getWithInvalidToken}`, async() => {
        const response = await getUserById(accessToken.accessToken + '1', userId.userId);
        assert(response.status).to.equal(401);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Invalid token signature');
    })

    it(`@user ${testCase.negative.getWithEmptyToken}`, async() => {
        const response = await getUserById('', userId.userId);
        assert(response.status).to.equal(401);
        assert(response.body.error).to.equal('Unauthorized');
        assert(response.body.message).to.equal('Bad HTTP authentication header format');
    })

    it(`@user ${testCase.negative.getWithInvalidUserId}`, async() => {
        const response = await getUserById(accessToken.accessToken, userId.userId + '1');
        assert(response.status).to.equal(404);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('id tidak valid');
    })

    it(`@user ${testCase.negative.updateWithEmptyEmail}`, async() => {
        userData.email = ("");
        const response = await updateUser(accessToken.accessToken, userId.userId, userData);
        assert(response.status).to.equal(400);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('"email" is not allowed to be empty');
    })

    it(`@user ${testCase.negative.updateWithInvalidEmail}`, async() => {
        userData.email = ("aaa");
        const response = await updateUser(accessToken.accessToken, userId.userId, userData);
        assert(response.status).to.equal(400);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('"email" must be a valid email');
    })

    it(`@user ${testCase.negative.updateWithEmptyName}`, async() => {
        userData.name = ("");
        const response = await updateUser(accessToken.accessToken, userId.userId, userData);
        assert(response.status).to.equal(400);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('"name" is not allowed to be empty');
    })

    it(`@user ${testCase.positive.deleteUser}`, async() => {
        const response = await deleteUser(accessToken.accessToken, userId.userId);
        assert(response.status).to.equal(200);
        assert(response.body.status).to.equal('success');
        assert(response.body).to.have.keys(["status", "message"]);
        assert(response.body.message).to.equal('User berhasil dihapus')
    })

})
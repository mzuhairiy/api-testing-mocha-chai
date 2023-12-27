const assert = require("chai").expect;
const {userRegistration} = require("../page/001-registration-page");
const {registrationData} = require("../data/001-registration-data");
const {faker} = require("@faker-js/faker");

const testCase = {
    positive : {
        validData : "As a User, I want to be able to register",
    },
    negative : {
        invalidData : "As a User, I should got an error message when I register with invalid data",
    },
}

const expectedRegistrationKeys = [
    "data", "status", "message"
]

describe('User Registration Endpoint', () => {
    it(`@post ${testCase.positive.validData}`, async () => {
        //compose registration request data
        registrationData.name = faker.person.fullName();
        registrationData.email = faker.internet.email();
        registrationData.password = faker.internet.password();

        //hit api and check
        const response = await userRegistration(registrationData);
        assert(response.status).to.equal(201);
        assert(response.body).to.have.keys(["message", "status", "data"]);
        assert(response.body).to.have.keys(expectedRegistrationKeys);
        assert(response.body.status).to.equal('success');
        assert(response.body.message).to.equal('Toko berhasil didaftarkan');

        //take some response data and show the data
        tokoName = response.body.data.name;
        //console.log(tokoName);
    })
    it(`@post ${testCase.negative.invalidData}`, async () => {
        //compose registration request data
        registrationData.name = ("");
        registrationData.email = faker.internet.email();
        registrationData.password = faker.internet.password();

        //hit api and check
        const response = await userRegistration(registrationData);
        assert(response.status).to.equal(400);
        assert(response.body).to.have.keys(["message", "status"]);
        assert(response.body.status).to.equal('fail');
        assert(response.body.message).to.equal('\"name\" is not allowed to be empty');
    })
});
const assert = require('chai').expect;
const describe = require('mocha');
const { getAccessToken } = require('../page/002-auth-page');
const { addUnit, getUnits, getUnitById, updateUnit, deleteUnit } = require('../page/004-unit-page');
const { Faker } = require('@faker-js/faker');

const testCase = {
    positive : {

    },
    negative : {

    }
}
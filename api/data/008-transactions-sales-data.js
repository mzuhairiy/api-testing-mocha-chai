const { faker } = require("@faker-js/faker")
const { officeId } = require("../tests/002-auth-test")
const { customerId } = require("../tests/006-customers-test")
const { productId } = require("../tests/007-products-test")


let salesData = {
   "officeId": officeId,
   "customerId": customerId,
   "date": "2023-02-01",
   "invoice": "INV001",
   "amount": 2000,
   "discount": 0,
   "description": "Pembelian",
    "items" : [
       {
           "productId": productId,
           "quantity": 1,
           "price": 2000
       }
   ]
}

module.exports = {
    salesData
}
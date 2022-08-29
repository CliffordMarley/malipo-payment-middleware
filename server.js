require('dotenv').config()
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')

const PaymentProcessing = require('./PaymentProcessing.Controller')

const app = express()

app.use (compression ());
app.use (express.urlencoded ({limit: '50mb'}));
app.use (express.json ({limit: '1mb'}));
app.set ('trust proxy', 1); // trust first proxy
app.use (bodyParser.json());
app.use (cors ());

app.post('/api/makeDepositRequest', new PaymentProcessing().RequestDeposit)

app.listen(process.env.PORT, () => { 
    console.log("Payment middleware listengin on port %s ...", process.env.PORT)
})
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const PaymentProcessing = require('./PaymentProcessing.Controller')

const app = express()

app.use(cors)
app.use(express.json())

app.post('/api/makeDepositRequest', new PaymentProcessing().RequestDeposit)

app.listen(process.env.PORT || 9000, () => { 
    console.log("Payment middleware listengin on port %s ...", process.env.PORT)
})
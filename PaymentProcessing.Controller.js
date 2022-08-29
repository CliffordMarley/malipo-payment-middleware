const fetch = require('node-fetch')
const ShortUniqueId  = require('short-unique-id')


module.exports = class { 
    constructor() { 

    }

    RequestDeposit = async (req, res) => { 
        try {
            const uid = new ShortUniqueId ({length: 10});
            req.body.merchantReference = uid();
            console.log("Request received!")
            console.log("Body:", req.body)
            res.json({
                status: 'success',
                message:'Payment request is processing...'
            })

            const options = {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(req.body)
            }
            let response = await fetch(process.env.PAYMENT_URL, options)
            response = await response.json()
            
            response.responseCode == 200 ?
                this.sendCallBack('success', req.body) :
                this.sendCallBack ('error', req.body)            
        } catch (err) { 
            console.log("Error 1: ", err)
            res.json({
                status: 'error',
                message: err.message
            })
        }
    }

    sendCallBack = async (status, data) => { 
        data.description = "Deposit request"
        data.customerPhone = "265"+data.customerPhone.substring (1);

        console.log(data)
        try {
            console.log("Sending %s callback for ref: "+data.merchantReference,status)
            data.status = status
            const options = {
                method: "PUT",
                headers: {
                    'Content-Type':"application/json"
                },
                body: JSON.stringify(data)
            }
            let response = await fetch(`${process.env.CORE_URL}/api/v1/transactions/callback`, options)
            response = await response.json()
            if (response.status == 'error') {
                console.log ('Failed with Error: ', response.message);
                console.log ('Retrying in callback for ref: %s in 15 seconds...');
                setTimeout(() => {
                    this.sendCallback(status, data)
                }, 15000)
            } else { 
                console.log('Callback successfully sent!')
            }
        } catch (err) { 
            console.log("Error 2: ",err)
            console.log("Failed with Error: ", err.message)
            console.log('Retrying in callback for ref: %s in 15 seconds...', data.merchantReference)
            setTimeout (() => {
                this.sendCallback(status, data);
            }, 15000);
        }
    }
}
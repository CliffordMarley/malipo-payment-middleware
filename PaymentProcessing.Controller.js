const fetch = require('node-fetch')


module.exports = class { 
    constructor() { 

    }

    RequestDeposit = async (req, res) => { 
        try {
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
                this.sendCallBack('success', req.body.merchantReference) :
                this.sendCallBack ('error', req.body.merchantReference)            
        } catch (err) { 
            res.json({
                status: 'error',
                message: err.message
            })
        }
    }

    sendCallBack = async (status, data) => { 
        let interval
        try {
            console.log("Sending %s callback for ref: %s",status, data.merchantReference)
            data.status = status
            const options = {
                method: "PUT",
                headers: {
                    'Content-Type':"application/json"
                },
                body: JSON.stringify(data)
            }
            let response = await fetch(`${CORE_URL}/api/v1/transactions/callback`, options)
            response = await response.json()
            if (response.status == 'error') {
                console.log ('Failed with Error: ', response.message);
                console.log ('Retrying in callback for ref: %s in 15 seconds...');
                setTimeout(() => {
                    this.setCallback(status, data)
                }, 15000)
            } else { 
                console.log('Callback successfully sent!')
            }
        } catch (err) { 
            console.log("Failed with Error: ", err.message)
            console.log('Retrying in callback for ref: %s in 15 seconds...')
            setTimeout (() => {
                this.setCallback (status, data);
            }, 15000);
        }
    }
}
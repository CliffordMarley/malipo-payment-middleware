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
            fetch(process.env.PAYMENT_URL, options)
            .then(res=>res.json())
                .then(res => { 
                console.log(res)
                this.sendCallBack ('success', req.body.merchantRef);
            }).catch(err => { 
                this.sendCallBack('error', req.body.merchantRef)
            })
        } catch (err) { 
            res.json({
                status: 'error',
                message: err.message
            })
        }
    }

    sendCallBack = async (type, reference) => { 
        try {
            console.log("Type: %s", type)
            console.log("Reference: %s", reference)
        } catch (err) { 
            console.log("Error: ",err)
        }
    }
}
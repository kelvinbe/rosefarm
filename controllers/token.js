import axios from "axios";
    
import * as dotenv from "dotenv";

dotenv.config();

let token

export const createToken=async (req, res, next)=>{
        const secret = 'K8Rt73sltOqEwipA';
        const consumerkey = 'pXHE2VYPYdrAWGUpk4OFqCxsHBIyWVGr';
        const auth = new Buffer.from(`${consumerkey}:${secret}`).toString("base64");
        console.log("secret", secret);
        await axios.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            {
              headers: {
                authorization: `Basic ${auth}`,
                },
            }
          ).then((data) => {
            token = data.data.access_token
            console.log(data.data)
            next()
          }).catch(error => {
        console.log(error)
        res.status(400).json(error.message)
        }) 
}

export const stkPush = async (req, res) => {
      const phone = req.body.phone.substring(1);
      const amount = req.body.amount;
      const date = new Date();
      const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
      const shortcode = '174379'
      const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
      const password = new Buffer.from(shortcode+passkey+timestamp).toString(
        "base64"
      );

      const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

      const data = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: "174379",
        PhoneNumber: `254${phone}`,
        CallBackURL: "https://mydomain.com/pat",
        AccountReference: `254${phone}`,
        TransactionDesc: "Test",
      }
    
      await axios.post(url, data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((data) =>{
        console.log(data)
        res.status(200).json(data.data)
      }).catch (error => {
        console.log('errr', error.message)
        res.status(400).json(error.message)
      }) 

}

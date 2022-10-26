import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

const db =
  "mongodb+srv://Kelvin:1234@cluster0.8no4u.mongodb.net/gaming?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

let token;
mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port:${PORT} `));
  })
  .catch((err) => console.error(err));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());



// middleware function to generate token

app.get("/token", (req, res) => {
  generateToken()
})


const generateToken = async (req, res, next) => { 
  try {
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
      ).then((response) => {
        token = response.data.access_token;
        console.log('tokeeeeeeeeeeeen', token)
        next();
        console.log('tokeeeeeepasss')
      })
    
  } catch (error) {
    console.log(error)
  }
};


app.use(generateToken)



app.post("/stk" ,generateToken,  async (req, res) => {

    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    console.log("phone", phone);
    console.log("amount", amount);
    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);
    const shortcode = process.env.MPESA_PAYBILL;
    const passkey = process.env.MPESA_CONSUMER_KEY;
    const password = new Buffer.from(shortcode + passkey + timestamp).toString(
      "base64"
    );
    console.log("passworddd", password);
    console.log("time", timestamp);
    await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: `254${phone}`,
        PartyB: "174379",
        PhoneNumber: `254${phone}`,
        CallBackURL: "https://mydomain.com/pat",
        AccountReference: `254${phone}`,
        TransactionDesc: "Test",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((data) =>{
      console.log('dataaa', data)
      res.status(200).json(data)
    }).catch((err)=>{
      console.log('errr', err.message)
      res.status(400).json(err.message)
    })

});

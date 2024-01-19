let express = require('express');
let app = express();
var mongo = require("../db.js");
var cors = require('cors');
const res = require('express/lib/response');
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
let { hashSync, compareSync } = require('bcrypt')
var jwt = require('jsonwebtoken');
// var PhoneNumber = require('awesome-phonenumber');
const { phone } = require('phone');
var otplib = require('otplib');
let axios = require('axios');

otplib.authenticator.options = {
    step: 900,
    window: 1,
    digits: 6
};
var OTP_SECRET = process.env.OTP_SECRET || 'ETTRTFGFCFSCGJLKLLUIOYUITTFFGCFZXEAWRRTTIUIGHFERHAPPI2022IIPL';
const secret = process.env.HMAC_SECRET || '1584FFBB3C6D5F74A5A41E7D3674A';

async function userLogin(req, res) {
    try {
        let data = req.body
        let db = await mongo.connect();//database connection 
        let userTb = await db.collection('user');//connect createUser collection
        let mailcheckresponse = await userTb.findOne({ "email": data.email });
        if (mailcheckresponse == null) {
            return res.json({
                status: false,
                message: 'User Not Found'
            })

        }
        else {
            let hashedpassword = bcrypt.compareSync(data.password, mailcheckresponse.password);
            //const token = jwt.sign({"email":data.email}, 'SecretKey');
            if (hashedpassword) {
                return res.json({
                    status: true,
                    //token:token,
                    message: "Login Successfully"
                })

            }
            else {
                return res.json({
                    status: false,
                    message: "Invalid Password"
                })
            }


        }



    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
        })
    }
}


async function createUsers(req, res) {
    try {
        let data = req.body;
        data.id = uuidv4();
        const hash = bcrypt.hashSync(data.password, 10);//convert password into hash format using bcrtpy module
        delete data.password;
        data.password = hash;
        let db = await mongo.connect();//database connection 
        let userTb = await db.collection('user');//connect createUser collection
        let mailcheckresponse = await userTb.findOne({ "email": data.email });
        if (mailcheckresponse == null) {
            await userTb.insertOne(data);//create Users
            return res.json({
                status: true,
                message: "User created successfully"
            })


        }
        else {
            return res.json({
                status: true,
                message: "Email already exists"
            })
        }
        // let userDetails = await userTb.insertOne(data);//create Users
        // return res.json({
        //     status:true,
        //     data:userDetails
        // })


    }
    catch (error) {
        console.log("error----", error);
        return res.json({
            status: false,
            message: error

        })
    }

}

async function overAllsearch(req, res) {
    try {

    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            sttaus: false,
            message: error
        })
    }

}


async function sendOtp(req, res) {
    try {

        var expr = /^(0|91)?[6-9][0-9]{9}$/

        let pn= expr.test(req.body.phone)

        if (pn == true) {
            const secret = OTP_SECRET + req.body.phone;
            const token = otplib.authenticator.generate(secret);
            var options = {
                'method': 'GET',
                'url': `https://2factor.in/API/V1/e27f1a8a-e428-11e9-9721-0200cd936042/SMS/${req.body.phone}/${token}/Happi`,
            };

            try {
                const response = await axios(options);
                var result = response.data
                if (result.Status == "Success") {
                    res.json({
                        status: true,
                        message: "Otp Sent"
                    })




                } else {
                    res.json({
                        status: false,
                        message: "Unable to send OTP"
                    })
                }
            } catch (error) {
                console.error(error);
                res.json({
                    status: false,
                    message: "Unable to send OTP Try After some time"
                })
            }





        } else {
            res.json({
                status: false,
                message: "Invalid Phone number"
            })
        }



    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }
}

async function verifyOtp(req, res) {
    try {
        var data = req.body;
        const secret = OTP_SECRET + data.phone;
        var isValid = otplib.authenticator.check(data.otp, secret);
        if (!isValid) {
            return res.json({
                status: false,
                message: "Invalid OTP"
            });
        }
        else{
            return res.json({
                status:true,
                message:"OTP VERIFIED SUCCESS"
            })
        }

    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            messsage: error
        })
    }
}

module.exports.userLogin = userLogin
module.exports.createUsers = createUsers
module.exports.overAllsearch = overAllsearch
module.exports.sendOtp = sendOtp
module.exports.verifyOtp = verifyOtp
let express = require('express');
let app = express();
var mongo = require("../db.js");
var cors = require('cors');
const res = require('express/lib/response');

app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//get location taxes based on state ansd cities
async function getLocationTaxes(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let LocationTaxTb = await db.collection('LocationTax');//connect LOCATION TAX table
        let locationqueryTaxes = {}
        locationqueryTaxes.state = req.query.state
        locationqueryTaxes.city = req.query.city
        let LocationTaxResponse = await LocationTaxTb.find(locationqueryTaxes).toArray();
        return res.json({
            status: true,
            data: LocationTaxResponse
        })
    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }

}

//get  group by states with city data
async function getStatesAndCities(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let LocationCityTb = await db.collection('locationCity');//connect LOCATION TAX table
        let LocationCityResponse = await LocationCityTb.aggregate([{
            $group:
                { "_id": "$statename", "city": { "$push": "$$ROOT" } },
        }]).toArray();
        return res.json({
            status: true,
            data: LocationCityResponse
        })
    }
    catch (error) {
        console.log("error----", error);
        return res.json({
            status: false,
            message: error

        })
    }
}



//get location wise and enginee and pricerange

async function getVarientsBasedOnLocationtaxes(req, res) {
    try {

        let db = await mongo.connect();//database connection 
        let LocationTaxTb = await db.collection('LocationTax');//connect LOCATION TAX table
        let modelvarientTb = await db.collection('modelVarient');//connect LOCATION TAX table
        /////get location wise taxes based on city and state
        let locationtaxprices = await LocationTaxTb.find({ "state": req.query.state, "city": req.query.city }).toArray();
        let varientsEnginee;
        let varientPrices;
        let varientsCAP;
        let finaldata;
        for (var i = 0; i < locationtaxprices.length; i++) {//---for loop for  type of taxes(enginee,price slab,CAP)
            //if type_of_tax is Enginee
            if (locationtaxprices[i].type_of_tax == "Engine") {
                let query = {}
                query.Engine = { "$lte": parseInt(locationtaxprices[i].engine) };
                varientsEnginee = await modelvarientTb.find(query).toArray();
                //Enginee has two type of ammounts --(Percentage,Fixed Amount)
                if (locationtaxprices[i].typeofamount == 'Percentage') {
                    varientsEnginee.forEach((element) => {
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = element.Price * locationtaxprices[i].type_percent
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                    });
                }
                if (locationtaxprices[i].typeofamount == 'Fixed Amount') {
                    varientsEnginee.forEach((element) => {
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = parseInt(locationtaxprices[i].type_fixedamount)
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                    });

                }
                finaldata = [ ...varientsEnginee]
            }
            //if type_of_tax is Price slab
            if (locationtaxprices[i].type_of_tax == 'Price slab') {
                let query = {}
                query.Price = {
                    "$gte": locationtaxprices[i].pricerange[0],
                    "$lte": locationtaxprices[i].pricerange[1]
                }
                varientPrices = await modelvarientTb.find(query).toArray();
                if (locationtaxprices[i].typeofamount == 'Percentage') {
                    varientPrices.forEach((element) => {
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = element.Price * locationtaxprices[i].type_percent || 0
                        element.insurance = parseInt(locationtaxprices[i].insurance) || 0
                        element.fasttag = parseInt(locationtaxprices[i].fastag) || 0
                        element.tcs = element.Price * locationtaxprices[i].tcs || 0
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs 
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty) || 0
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges) || 0
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit) || 0
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                    });
                }
                if (locationtaxprices[i].typeofamount == 'Fixed Amount') {
                    varientPrices.forEach((element) => {
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = parseInt(locationtaxprices[i].type_fixedamount)
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        

                    });

                }
                finaldata = [ ...varientPrices]
               
            }
            //if type_of_tax is 'CAP
            if(locationtaxprices[i].type_of_tax == 'CAP'){
                let query = {}
                query.Engine = { "$lte": parseInt(locationtaxprices[i].engine) };
                query.Price = {
                    "$gte": initialPrice,
                    "$lte": finalPrice
                }
                varientsCAP= await modelvarientTb.find(query).toArray();
                

            }
         }
         return res.json({
            status: true,
            data: finaldata
        })




    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }
}


//get list of cities Dropdown

async function cityDropDown(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let LocationCityTb = await db.collection('locationCity');//connect LOCATION TAX table
        let locationcityResponse = await LocationCityTb.find({}).toArray();
        return res.json({
            status:true,
            data:locationcityResponse
        })

    }
    catch(error){
        console.log("error",error);
        return res.json({
            status:false,
            message:error
        })
    }
}

module.exports.getLocationTaxes = getLocationTaxes
module.exports.getStatesAndCities = getStatesAndCities
module.exports.getVarientsBasedOnLocationtaxes = getVarientsBasedOnLocationtaxes
module.exports.cityDropDown = cityDropDown

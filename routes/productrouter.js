var express = require('express');
var router = express.Router();
let product = require('../controllers/productcontroller');
router.post('/CreateProducts',product.CreateProducts);
router.get('/getAllProducts',product.ProductList);
router.get('/getproductbyid',product.getProductByID);
router.get('/searchProductsWithCarType',product.SearchPriceFilter);
router.get('/getListOfProductNames',product.getListOfProductNames);
router.get('/getTagNameWithProducts',product.getTagNameWithProducts);
router.get('/getcartypes',product.listOfCarTypes);
router.get('/searchBrandWithProductName',product.SearchBrandWithProductName);
router.post('/addPriceRange',product.PriceRanges);
router.get('/getpricerange',product.listOfAllPriceRanges);
router.get('/getProductBasedOnbrand',product.getProductsBasedOnBrands);
router.get('/getVarientsBasedOnProducts',product.getVarientsBasedOnProductName);
router.get('/getProductsWithSimilarPrice',product.getProductsWithSimilarPrice);
router.get('/CompareModels',product.CompareModels);
router.post('/createcartypes',product.createcartypes);
router.get('/noOfProductsBasedOnCategory',product.noOfProductsBasedOnCategory);
module.exports = router;





// ["de4be7eb-e364-40f7-bfce-0977dc8950b1","4ec461b9-4347-45eb-9337-5cff1a4a1215","2a203e6a-b346-487a-8824-6a1516e0cbee"]

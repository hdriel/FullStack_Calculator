const express = require('express');
const router = require('express-promise-router')() // already include try catch block when using in async functions
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const CalculatorController = require('../controllers/calculator');

//const CLIENT_ID = 'B7y2M4DKbcwVWiNQ2I4EOHQypf2bqAFQ';
//const CLIENT_SECRET = 'P9SLbgVM2e4489SiVAxxFJSG0WYjJrzJLRoqozGPZVjkwrj9AMmdUnMW7ycKU_mH';
const DOMAIN = 'hdriel.auth0.com';
const AUDIENCE = `https://${DOMAIN}/api/v2/`;

const authCheck = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${DOMAIN}/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: AUDIENCE,
    issuer: `https://${DOMAIN}/`,
    algorithms: ['RS256']
  });

// route to the function of the operator after check secure request
router.route('/operatorplus').post(authCheck,CalculatorController.operatorplus);
router.route('/operatorminus').post(authCheck, CalculatorController.operatorminus);
router.route('/operatormultiply').post(authCheck, CalculatorController.operatormultiply);
router.route('/operatordivide').post(authCheck, CalculatorController.operatordivide);
router.route('/fullexpression').post(authCheck, CalculatorController.fullexpression);


module.exports = router;

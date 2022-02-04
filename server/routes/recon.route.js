const router = require('express').Router();
const validate = require('express-validation').validate;
const reconValidation = require('../validations/recon.validation');
const reconController = require('../controllers/recon.controller');

// API 1.1: Fetch Recon Attribute List
router.post(
    '/attribute/list/fetch',
    validate(reconValidation.fetchReconAttributeList, { keyByField: true }),
    // reconController.fetchReconAttributeList
);

// API 1.2: Fetch Recon Request List
router.post(
    '/request/list/fetch',
    validate(reconValidation.fetchReconRequestList, { keyByField: true }),
    // reconController.fetchReconRequestList
);

// API 1.3: Fetch Recon Request
router.post(
    '/request/fetch',
    validate(reconValidation.fetchReconRequest, { keyByField: true }),
    // reconController.fetchReconRequest
);

// API 1.4: Fetch Recon Request Pass
router.post(
    '/request/pass/fetch',
    validate(reconValidation.fetchReconRequestPass, { keyByField: true }),
    // reconController.fetchReconRequestPass
);

// API 1.5: Submit Recon Request
router.post(
    '/request/submit',
    validate(reconValidation.fetchReconRequestPass, { keyByField: true }),
    // reconController.fetchReconRequestPass
);

module.exports = router;

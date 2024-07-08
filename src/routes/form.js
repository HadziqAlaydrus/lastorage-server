const express = require('express');
const router = express.Router();

const{
    getForm,
    getUser,
    signupUser,
    loginUser,
    createForm,
    getFromByUserId,
    deleteFormById,
    updateFormById,
} = require('../controllers/form');

const {authenticateToken} = require('../middleware/verifyToken');

router.get('/form', getForm);
router.get('/form/:id', getFromByUserId)
router.get('/users',getUser)
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/form', authenticateToken ,createForm);
router.delete('/form/:id', deleteFormById);
router.patch('/form/:id', updateFormById);

module.exports = router;


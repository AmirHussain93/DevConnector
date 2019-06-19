const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

//@route  Get api/auth
//@desc   Test route
//@acess  Public
router.get('/',
    auth,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });

//@route  Post api/auth
//@desc   Authenticate user & get token
//@acess  Public
router.post('/',
    [
        check('email', 'Please enter a valid email address').isEmail(),
        check('password', 'Password is required').exists()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email })

            //If user exists
            if (!user) {
                return res.status(400).json({ erros: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ erros: [{ msg: 'Invalid Credentials' }] });
            }
            //Return jsonwebtokens
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
            // res.send('User registered')
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }


    });

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const auth = require('../../middleware/auth');
// const User = require('../../models/User');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const bcrypt = require('bcryptjs');

// const { check, validationResult } = require('express-validator');

// // @route GET api/auth
// // @description :
// // Access :public

// router.get('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('server error');
//   }
// });

// // @route POST api/auth
// // @description : authenticate user and get token
// // Access :public

// router.post(
//   '/',
//   [
//     check('email', 'please include a valid email').isEmail(),
//     check('password', 'password is required').exists(),
//   ],
//   async (req, res) => {
//     // console.log(req.body);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     try {
//       // see if the user exists

//       let user = await User.findOne({ email });
//       if (!user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'invalid credentials' }] });
//       }

//       // Get Users Gravatar

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'invalid credentials' }] });
//       }

//       // Return Json Web Token

//       //   res.send('User Registered');
//       const payload = {
//         user: {
//           id: user.id,
//         },
//       };
//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: 360000 },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }

//     // see if the user exists

//     // Get Users Gravatar

//     // Encrypt password

//     // Return Json Web Token

//     // res.send('User Route');
//   }
// );

// module.exports = router;

// *****************************88

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

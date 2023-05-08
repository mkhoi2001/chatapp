const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Models
const User = require('./../models/userModel');

// Plugins
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');
const {
    contactsGet
  } = require('./../utils/query');

// common Token
const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// token set in cookies
const createSendToken = (user, statusCode, res, msg) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    res.cookie('user_id', user.id, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        message: msg,
        token,
        data: {
            user
        }
    });
}

/**
 * View Register
 */
 exports.register = async (req, res) => {
    res.status(200).render('register');
};

/**
 * SignUp post Form 
 */
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(200).json({
        status:'success',
        message: "Register Sucessfully",
        data:newUser
    });
});


/**
 * View Login
 */
 exports.login = async (req, res) => {
    res.status(200).render('login');
};

/**
 * SignIn post Form 
 */
exports.signin = catchAsync(async (req, res, next) => {
    
    /*if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.status(200).json({
            status: 'fail',
            message: 'Please select captcha'
        });   
    }*/

    const { email, password } = req.body;
    if (!email || !password) {

        return res.status(200).json({
            status: 'fail',
            message: 'Invalid Email And Password'
        });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(200).json({
            status: 'fail',
            message: 'Incorrect email or Password'
        });
    }
    createSendToken(user, 200, res, 'Login Successfully');
    //var secretKey = "6Lfi6ocfAAAAAAqrAU0ChbWJcXYzTP1rWyljqrPh";
    // req.connection.remoteAddress will provide IP address of connected user.
    //var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    //request(verificationUrl, async (error, response, body) => {
        //body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        //if (body.success !== undefined && !body.success) {
            //return res.status(200).json({
                //status: 'fail',
                //message: 'Failed captcha verification'
            //});
        //}
    //});
});


/**
 * View forgotPassword
 */
 exports.forgot_password = async (req, res) => {
    res.status(200).render('forgot_password');
};

/**
 * ForgotPassword post Form 
 */
exports.forgotPassword = catchAsync (async (req,res, next) => {
    // Get user based on posted email
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(404).json({
            status: "fail",
            message: "There is no user with email address."
        });
    }

    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
    
        return res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
            token: resetToken
        });
    }
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return req.status(500).json({
            status: 'fail',
            message: 'There was an error sending the email, Try again later!'
        });
    }
});


/**
 * View resetPassword
 */
 exports.reset_password = async (req, res) => {
    res.status(200).render('reset_password');
};

/**
 * ResetPassword post Form 
 */
exports.resetPassword = catchAsync(async (req,res,next) => {
    // 1) Get User based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return res.status(200).json({
            status: 'fail',
            message: 'Token is invalid or has expired'
        });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    const token = signToken(user._id);
    return res.status(200).json({
        status: 'success',
        message: 'Reset Password Successfully'
    });
});

/**
 * Index Page
 */
 exports.index = async (req, res) => {
    contactsGet(req.cookies.user_id).then((contacts) => {
        res.status(200).render('index',{contacts: contacts});
    });
};
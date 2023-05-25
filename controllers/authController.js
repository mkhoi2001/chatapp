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
        message: "Đăng ký thành công",
        data:newUser
    });
});

exports.getlistUser = catchAsync(async(req, res)=>{
    const listUser = await User.find();
    res.status(200).json({
        status:"Success",
        data: listUser,
        message:"Lay thong tin user thanh cong"
    })
})
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

    const { email, password } = req.body;
    if (!email || !password) {

        return res.status(200).json({
            status: 'fail',
            message: 'Vui lòng nhập email và mật khẩu'
        });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(200).json({
            status: 'fail',
            message: 'Email hoặc mật khẩu không đúng'
        });
    }
    createSendToken(user, 200, res, 'Đăng nhập thành công');

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
            message: "Email không tồn tại"
        });
    }

    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
    const message = `Quên mật khẩu? Gửi yêu cầu cấp lại mật khẩu tới: ${resetURL}.`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Mã cấp lại mật khẩu hiệu lực trong 10 phút',
            message
        });
    
        return res.status(200).json({
            status: 'success',
            message: 'Mã cấp lại mật khẩu đã được gửi tới email',
            token: resetToken
        });
    }
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return req.status(500).json({
            status: 'fail',
            message: 'Đã xảy ra lỗi khi gửi email, Hãy thử lại sau!'
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
            message: 'Mã không hợp lệ hoặc đã hết hạn'
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
        message: 'Khôi phục mật khẩu thành công!'
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
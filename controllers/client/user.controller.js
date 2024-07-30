const md5 = require("md5");
const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const Cart = require("../../models/cart.model")

const generateHeper = require("../../helpers/ganerate")
const sendMailHelper = require("../../helpers/sendMail")
// GET /user/register
module.exports.register = async (req, res)=> {
    
    res.render("client/pages/user/register",{
        pageTitle: "Dang ky tai khoan",
    })
}

// POST /user/registerPost
module.exports.registerPost = async (req, res)=> {
    const existEmail = await User.findOne({
        email: req.body.email
    });
    if(existEmail){
        req.flash("error", "email da ton tai");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/")
}

// GET /user/login
module.exports.login = async (req, res)=> {
    res.render("client/pages/user/login",{
        pageTitle: "Dang nhap tai khoan",
    })
}

// POST /user/loginPost
module.exports.loginPost = async (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash("error", "Email khong ton tai");
        res.redirect("back")
        return;
    }

    if(md5(password) !== user.password) {
        req.flash("error", "Sai mat khau");
        res.redirect("back")
        return;
    }

    if(user.status === "inactive") {
        req.flash("error", "Tai khoan dang bi khoa");
        res.redirect("back")
        return;
    }

    const cart = await Cart.findOne({
        user_id: user.id,
    })

    if(cart){
        res.cookie("tokenUser", user.tokenUser);
    } else{
        await Cart.updateOne({
            _id: req.cookies.cartId
        },{
            user_id: user.id
        })
    }

    res.cookie("tokenUser", user.tokenUser);
    await User.updateOne({
        tokenUser: user.tokenUser,

    }, {
        statusOnline: "online"
    });

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: user.id,
            status: "online",       
        });
        console.log(socket.userId)
    });           
    

    res.redirect("/");
}

// GET /user/logout
module.exports.logout = async (req, res)=> {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser,
    }, {
        statusOnline: "offline"
    })

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: res.locals.user.id,
            status: "offline"
        });

    });    
   res.clearCookie("tokenUser");
   res.clearCookie("cartId");
   res.redirect("back");
}

// GET /user/forgotPassword
module.exports.forgotPassword = async (req, res)=> {
    res.render("client/pages/user/forgot-password",{
        pageTitle: "Lay lai mat khau",
    })
}

// POST /user/forgotPasswordPost
module.exports.forgotPasswordPost = async (req, res)=> {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", "email nay khong ton tai");
        res.redirect("back");
        return;
    }
    // Luu thong tin vao DB
    const otp = generateHeper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: Date.now()
    }

    console.log(otp)

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Neu ton tai email thi gui mai qua OTP qua email
    const subject = "Ma OTP xac minh lay lai mat khau"
    const html = `
        Ma OTP de lay lai mat khau <b>${otp}</b>. Thoi han su dung la 3p
    `
    sendMailHelper.sendMail(email,subject, html);
    res.redirect(`/user/password/otp?email=${email}`)
}

// GET /user/otpPassword
module.exports.otpPassword = async (req, res)=> {
    const email = req.query.email;

    res.render("client/pages/user/otp-password",{
        pageTitle: "Nhap ma OTP",
        email: email
    });
}

// POST /user/otpPassword
module.exports.otpPasswordPost = async (req, res)=> {
    const email = req.body.email;
    const otp = req.body.otp;
    
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!result) {
        req.flash("error", "OTP khong hop le");
        res.redirect("back")
        return;
    }

    const user = await User.findOne({
        email: email,
    })

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

// GET /user/reset
module.exports.resetPassword = async (req, res)=> {
    res.render("client/pages/user/reset-password",{
        pageTitle: "Doi mat khau",
    });
}

// POST /user/otpPassword
module.exports.resetPasswordPost = async (req, res)=> {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne(
    {tokenUser: tokenUser},
    {password: md5(password)}
    )
    res.redirect("/")
}

// GET /user/info
module.exports.info = async (req, res)=> {
    res.render("client/pages/user/info",{
        pageTitle: "Thong tin tai khoan"
    });
}
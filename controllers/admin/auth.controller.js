var md5 = require('md5');
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")

// GET admin/auth/login
module.exports.login = (req, res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else{
        res.render("admin/pages/auth/login",
            {
                pageTitle: "Trang dang nhap"
            }
        )
    }
}

// POST admin/auth/login
module.exports.loginPost = async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", "Email khong ton tai");
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password){
        req.flash("error", "Sai mat khau");
        res.redirect("back");
        return;
    }

    if(user.status != "active"){
        req.flash("error", "Tai khoan bi khoa");
        res.redirect("back");
        return; 
    }
    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// GET admin/auth/logout
module.exports.logout = (req, res) => {
    // delete token in cookie
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
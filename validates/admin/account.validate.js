module.exports.createPost = (req, res, next) => {
    
    if(!req.body.fullName){
        req.flash("error", `Vui long nhap ho ten!`);
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        req.flash("error", `Vui long nhap email!`);
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash("error", `Vui long nhap password!`);
        res.redirect("back");
        return;
    }
    next();
}

module.exports.editPatch = (req, res, next) => {
    
    if(!req.body.fullName){
        req.flash("error", `Vui long nhap ho ten!`);
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        req.flash("error", `Vui long nhap email!`);
        res.redirect("back");
        return;
    }
    next();
}
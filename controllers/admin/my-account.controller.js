// GET myAccount
const Account = require("../../models/account.model")
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// GET /admin/account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index",
        {
            pageTitle: "Danh sach tai khoan",
        }
    )
}

// GET /admin/account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit",
        {
            pageTitle: "Chinh sua thong tin tai khoan",
        }
    )
}
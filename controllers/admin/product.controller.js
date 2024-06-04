const Product = require("../../models/product.model")

const systemConfig = require("../../config/system")

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
// get all
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelpers(req.query)

    let find = {
        deleted: false
    };

    if(req.query.status){
        find.status = req.query.status;
    }

    const objectSearch = searchHelpers(req.query);

    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // Pagination
    const countProduct = await Product.countDocuments(find);

    let objectPagination = paginationHelpers({
        currentPage: 1,
        limitItems: 4
    },req.query,countProduct)

    const products = await Product.find (find).sort({position: "desc"}).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/products/index",
        {
            pageTitle: "Danh Sach San Pham",
            products: products,
            filterStatus: filterStatus,
            keyword : objectSearch.keyword,
            pagination: objectPagination
        }
    )
}

// [patch] /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id: id}, {status: status});

    req.flash("success", "Cap nhap trang thai thanh cong!");
    res.redirect("back");

}

// [patch] /change-multi
module.exports.changeMulti = async (req, res) => {
    
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"})
            req.flash("success", `cap nhap trang thai thanh cong ${ids.length} san pham!`)
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"})
            req.flash("success", `cap nhap trang thai thanh cong ${ids.length} san pham!`)
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, {deleted: true, deletedAt: new Date()})
            req.flash("success", `da xoathanh cong ${ids.length} san pham!`)

            break;
        case "change-position":
            for(const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {
                    position: position
                }); 
            req.flash("success", `da doi vi tri thanh cong ${ids.length} san pham!`)
            
            }
            break;
        default:
            break;
    }
    res.redirect("back")
}

// [delete] /delete/:id vinh vien
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // xoa cung
    //await Product.deleteOne({_id: id});

    // xoa mem
    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `da xoa thanh cong san pham!`)

    res.redirect("back");

}

// [GET] admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Them moi mot san pham"
    })
}
// [Post] admin/products/create

module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position == ""){
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1;
    } else{
        req.body.position = parseInt(req.body.position);
    }
    console.log(req.body)
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] admin/products/edit
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chinh sua san pham",
            product: product
        })
    } catch (error) {
        req.flash("error", `Khong ton tai danh sach san pham`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)   
    }
}
// [PATCH] admin/products/edit

module.exports.editPatch = async (req, res) => {
    
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position);
    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    try {
        await Product.updateOne({_id: req.params.id},req.body)
        req.flash("success", `cap nhap thanh cong san pham`)
    } catch (error) {
        req.flash("error", `that bai`)
    }
    res.redirect("back");
}

// [GET] admin/products/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        req.flash("error", `Khong ton tai danh sach san pham`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)   
    }
}
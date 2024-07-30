const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
      title : String, 
      description: String, 
      permissions:{
        type: Array,
        default: ["Them san pham", "Xoa san pham"]
      },
      deleted: {
        type: Boolean,
        default: false
      },
      deletedAt: Date
    }, {
      timestamps: true
    }
)

const Role = mongoose.model('Role', roleSchema, "Roles");

module.exports = Role
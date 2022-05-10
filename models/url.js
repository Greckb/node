const { url } = require('inspector');
const mongoose = require('mongoose');

const {Schema} = mongoose

const urlSchema = new Schema ({
    origen: {
        type : String,
        unique : true,
        require: true,

    },
    shortURL : {
        type: String,
        unique: true,
        require: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,

    }
})

const Url = mongoose.model('Url', urlSchema)
module.exports = Url;




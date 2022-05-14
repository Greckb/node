const mongoose = require('mongoose');
require("dotenv").config();

const clientDb = mongoose
.connect(process.env.URI)
.then((m) => {
    console.log("Db Connect")
    return m.connection.getClient()
})
.catch(e => console.log("Fallo la conexion" + e))

//Guardamos toda la conexion en clientdb
module.exports= clientDb
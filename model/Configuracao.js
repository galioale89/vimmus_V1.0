const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Config = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        require: false,
    },
    slug:{
         type: String,
         require: true
    },
    potencia: {
        type: String,
        require: true,  
    },
    minatr: {
        type: Number,
        require: true
    },    
    minest: {
        type: Number,
        require: true
    },
    mininv: {
        type: Number,
        require: true
    },
    minmod: {
        type: Number,
        require: true
    },
    medkmh: {
        type: Number,
        require: false
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model('configuracao', Config)
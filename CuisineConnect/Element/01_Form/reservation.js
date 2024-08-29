const reservationSchema = new mongoose.Schema
({
    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },
    
    Table: {
        type: Number,
        enum: [2,4,8,10],
        required: true
    }
        
})
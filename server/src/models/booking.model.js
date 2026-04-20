import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserModel', 
        required: true 
    },
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'EventModel', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['confirmed', 'cancelled', 'pending'], 
        default: 'pending' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['paid', 'not_paid'], 
        default: 'not_paid' 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    bookedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

const BookingModel = mongoose.model('BookingModel', bookingSchema);

export default BookingModel
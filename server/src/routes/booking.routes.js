import { Router } from "express";
import { bookEvent, cancelBooking, confirmBooking, getMyBookings, sendBookingOTP } from "../controllers/booking.controller.js";
import { admin, protect } from "../middlewares/auth.middleware.js";

const router = Router();
router.post('/send-otp', protect, sendBookingOTP);
router.post('/', protect, bookEvent);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

export default router;
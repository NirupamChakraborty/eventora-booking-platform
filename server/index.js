import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import connectDB from "./src/config/db.js"
import authRoutes from "./src/routes/auth.routes.js"
import bookingRoutes from "./src/routes/booking.routes.js"
import eventRoutes from "./src/routes/event.routes.js"
dotenv.config()



const app = express()
const PORT = 5001

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.url);
    next();
});

app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/events", eventRoutes)


app.get("/", (req, res) => {
    res.send("Hello World!")
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

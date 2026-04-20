import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OTPModel from '../models/OTP.model.js';
import UserModel from '../models/user.model.js';
import { sendOTPEmail } from '../utils/email.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// export const handleRegisterController = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         let user = await UserModel.findOne({ email });
//         if (user) return res.status(400).json({ message: 'User already exists' });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         user = await UserModel.create({
//             name,
//             email,
//             password: hashedPassword,
//             role: 'user', // Hardcoded to prevent frontend passing role
//             isVerified: false
//         });

//         const otp = generateOTP();
//         await OTPModel.create({ email, otp, action: 'account_verification' });
//         await sendOTPEmail(email, otp, 'account_verification');

//         res.status(201).json({
//             message: 'OTP sent to email. Please verify.',
//             email: user.email
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };


export const handleRegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const cleanEmail = email.toLowerCase().trim(); // ✅ FIX

        let user = await UserModel.findOne({ email: cleanEmail });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await UserModel.create({
            name,
            email: cleanEmail,
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });

        const otp = generateOTP();

        // ✅ REMOVE OLD OTPs
        await OTPModel.deleteMany({ email: cleanEmail, action: 'account_verification' });

        // ✅ SAVE NEW OTP
        const savedOTP = await OTPModel.create({
            email: cleanEmail,
            otp,
            action: 'account_verification'
        });

        console.log("👉 REGISTER EMAIL:", cleanEmail);
        console.log("👉 GENERATED OTP:", otp);
        console.log("👉 SAVED OTP:", savedOTP);

        await sendOTPEmail(cleanEmail, otp, 'account_verification');

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: cleanEmail
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
export const handleLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified && user.role !== 'admin') {
            const otp = generateOTP();
            await OTPModel.findOneAndDelete({ email: user.email, action: 'account_verification' });
            await OTPModel.create({ email: user.email, otp, action: 'account_verification' });
            await sendOTPEmail(user.email, otp, 'account_verification');
            return res.status(403).json({ message: 'Account not verified', needsVerification: true, email: user.email });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// export const handleVerifyOTPController = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         const validOTP = await OTPModel.findOne({ email, otp, action: 'account_verification' });

//         if (!validOTP) {
//             return res.status(400).json({ message: 'Invalid or expired OTP' });
//         }

//         const user = await UserModel.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
//         await OTPModel.deleteOne({ _id: validOTP._id }); // Delete OTP after usage

//         res.json({
//             _id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             token: generateToken(user.id, user.role)
//         });

//         console.log("EMAIL:", email);
// console.log("OTP ENTERED:", otp);

// const allOTPs = await OTPModel.find({ email });
// console.log("DB OTPs:", allOTPs);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

export const handleVerifyOTPController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const cleanEmail = email.toLowerCase().trim(); // ✅ FIX
        const cleanOTP = otp.trim(); // ✅ FIX

        console.log("👉 Incoming Email:", cleanEmail);
        console.log("👉 Incoming OTP:", cleanOTP);

        const allOTPs = await OTPModel.find({ email: cleanEmail });
        console.log("👉 OTPs in DB:", allOTPs);

        const validOTP = await OTPModel.findOne({
            email: cleanEmail,
            otp: cleanOTP,
            action: 'account_verification'
        });

        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await UserModel.findOneAndUpdate(
            { email: cleanEmail },
            { isVerified: true },
            { returnDocument: 'after' }
        );

        await OTPModel.deleteOne({ _id: validOTP._id });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        console.error("VERIFY OTP ERROR:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
<h1>Eventora - Full-Stack Event Booking Platform</h1>
Eventora is a full-stack MERN application that allows users to seamlessly browse, register, and pay natively without any third party tools. It features an administrative dashboard for event organizers to create and manage free and paid events. All bookings can be managed manually by an admin to handle payments directly.

<h1>Features</h1>
1. User Authentication: Secure login & registration with JWT and bcrypt. <br>
2. 2FA OTP Verification: <br>
Mandatory Email OTP to activate your account upon Registration (or delayed login attempts). <br>
Mandatory Email OTP to finalize and secure event ticket booking. <br>
3. Role-Based Access: <br>
Admin: Create, edit, and delete events. Confirm and reject all incoming booking requests, mark them as 'Paid' or 'Not Paid'. Access is strictly locked to database-flagged users only. <br>
User: Browse events, submit ticket booking requests via OTP, view personal dashboard pending status, and cancel bookings. <br>
4. Event Management: Create free and paid events with detailed descriptions, external image URLs, dates, categories, and seating capacity. <br>
5. Smart Booking System: <br>
Mandatory 2FA OTP to authorize a booking request. <br>
All booking requests (both free and paid) enter a secure 'Pending' queue for Admin verification. <br>
Seat availability accurately updates and securely validates against overbooking logic. <br>
6. Admin Analytics Dashboard: Track live data such as Pending Requests, Total Revenue, and Total Confirmed Paid Clients directly from the admin panel. <br>
7. Email Notifications: Automated email delivery upon successful booking confirmation using Nodemailer. <br>
8. Modern UI/UX: Built entirely with React, Tailwind CSS, and polished with micro-interactions.
 <br>

# 💊 PharmaPlus – Online Pharmacy Management System

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-State-764ABC?style=for-the-badge&logo=redux" />
  <img src="https://img.shields.io/badge/Razorpay-Payment-02042B?style=for-the-badge&logo=razorpay" />
  



</p>

<p align="center">
  <b>A Full Stack MERN-based Online Pharmacy Management System with Secure Authentication, Prescription Verification, Online Payments, Order Management, Inventory Control, and Admin Dashboard.</b>
</p>

---

# 🌐 Live Demo

### 🚀 Website

**https://pharmaplus-frontend.vercel.app/**

---

# 📌 Project Overview

**PharmaPlus** is a modern full-stack Pharmacy Management System developed using the **MERN Stack**. It simplifies the process of purchasing medicines online while enabling pharmacies to efficiently manage inventory, prescriptions, customers, and orders through a powerful admin dashboard.

The platform allows customers to browse medicines, upload prescriptions for prescription-required medicines, securely place orders using Razorpay, and track their purchases. Administrators can manage medicines, categories, users, inventory, prescriptions, and orders from an intuitive dashboard.

The project follows modern web development practices including JWT Authentication, Role-Based Authorization, REST APIs, Cloudinary Integration, Redux Toolkit, Responsive UI, and Secure Payment Gateway Integration.

---

# ✨ Features

## 👤 User Features

* User Registration & Login
* JWT Authentication
* Secure Password Encryption
* Role-Based Authorization
* Browse Medicines
* Search Medicines
* Filter Medicines by Category
* Product Details Page
* Shopping Cart
* Quantity Management
* Upload Prescription (Image/PDF)
* Razorpay Payment Integration
* Cash on Delivery Option
* Order Tracking
* Order History
* User Profile Management
* Responsive UI
* Protected Routes

---

## 💊 Medicine Features

* Medicine Listing
* Medicine Details
* Category Wise Browsing
* Search Functionality
* Prescription Required Indicator
* Stock Availability
* Product Images
* Price Details
* Discount Display
* Inventory Updates

---

## 🛒 Cart Features

* Add to Cart
* Remove from Cart
* Update Quantity
* Calculate Total
* Secure Checkout
* Persistent Cart
* Order Summary

---

## 💳 Payment Features

* Razorpay Payment Gateway
* Secure Payment Verification
* Payment Success Handling
* Payment Failure Handling
* Online Payment
* Cash on Delivery
* Order Confirmation

---

## 📄 Prescription Features

* Upload Prescription
* Image & PDF Support
* Cloudinary Storage
* Admin Verification
* Prescription Status
* Approval/Rejection System

---

## 👨‍💼 Admin Features

### Dashboard

* Sales Overview
* Revenue Statistics
* Recent Orders
* Low Stock Alerts
* Quick Actions
* Inventory Summary

### Medicine Management

* Add Medicines
* Edit Medicines
* Delete Medicines
* Upload Images
* Manage Inventory
* Update Stock
* Manage Categories

### Order Management

* View Orders
* Update Order Status
* Payment Status
* Delivery Status
* Customer Details

### User Management

* View Users
* Manage User Roles
* Customer Information

### Prescription Management

* View Uploaded Prescriptions
* Verify Prescriptions
* Approve Prescription
* Reject Prescription

---

# 🏗️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router DOM
* Axios
* React Hook Form
* React Hot Toast
* Lucide React
* Recharts

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Multer
* Cloudinary
* Razorpay
* Express Validator
* CORS
* Cookie Parser

---

## Database

* MongoDB Atlas

---

## Deployment

Frontend

* Vercel

Backend

* Vercel

Database

* MongoDB Atlas

Media Storage

* Cloudinary

---

# 📂 Project Structure

```text
PharmaPlus
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── hooks
│   │   ├── redux
│   │   ├── services
│   │   ├── routes
│   │   ├── utils
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

# 🔐 Authentication Flow

```text
User Login
      │
      ▼
Validate Credentials
      │
      ▼
Generate JWT Token
      │
      ▼
Store Token
      │
      ▼
Protected Routes
```

---

# 💳 Payment Flow

```text
User Checkout
      │
      ▼
Create Order
      │
      ▼
Generate Razorpay Order
      │
      ▼
Open Razorpay Checkout
      │
      ▼
Payment Success
      │
      ▼
Verify Signature
      │
      ▼
Update Order Status
      │
      ▼
Reduce Inventory
      │
      ▼
Order Confirmed
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/Pharma-Plus.git
```

```bash
cd Pharma-Plus
```

---

## Install Frontend

```bash
cd client
```

```bash
npm install
```

---

## Install Backend

```bash
cd server
```

```bash
npm install
```

---

# 🔑 Environment Variables

## Backend (.env)

```env

MONGO_URI=

JWT_SECRET=

JWT_EXPIRE=

CLIENT_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

EMAIL_HOST=

EMAIL_PORT=

EMAIL_USER=

EMAIL_PASS=
```

---

## Frontend (.env)

```env
VITE_API_BASE_URL=
```

---

# ▶️ Run Project

## Backend

```bash
npm run dev
```

---

## Frontend

```bash
npm run dev
```

---

# 📡 API Modules

### Authentication

* Register
* Login
* Logout
* Refresh Token

### Medicines

* Get Medicines
* Add Medicine
* Update Medicine
* Delete Medicine

### Categories

* CRUD Operations

### Cart

* Add Item
* Update Quantity
* Remove Item

### Orders

* Create Order
* Verify Payment
* Get Orders
* Update Status

### Prescription

* Upload Prescription
* Verify Prescription

### Users

* Profile
* Update Profile

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing (bcrypt)
* Protected Routes
* Role-Based Access Control
* Input Validation
* CORS Protection
* Helmet Security Headers
* Secure Payment Verification
* Environment Variables
* MongoDB Injection Protection

---

# 📈 Future Improvements

* AI Medicine Recommendation
* Medicine Reminder Notifications
* Email Notifications
* SMS Notifications
* Live Order Tracking
* Pharmacy Analytics
* Wishlist
* Coupons & Offers
* Multi-Vendor Support
* Invoice Generation
* PWA Support
* Mobile Application
* Dark Mode
* Multi-language Support
* Doctor Consultation
* Chat Support

---

# 🎯 Learning Outcomes

This project demonstrates practical experience with:

* Full Stack MERN Development
* REST API Development
* Authentication & Authorization
* Redux Toolkit State Management
* MongoDB Database Design
* Payment Gateway Integration
* Cloudinary File Upload
* Secure Backend Development
* Responsive UI Design
* Deployment using Vercel & Render
* Production Environment Configuration
* Inventory Management System Design

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Commit changes.

```bash
git commit -m "Add new feature"
```

4. Push changes.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Abhishek Kumar**

* B.Tech Computer Science Engineering
* Full Stack MERN Developer
* Passionate about Web Development, System Design, and Problem Solving

---

# ⭐ Support

If you found this project helpful:

⭐ Star the repository

🍴 Fork the project

🛠️ Contribute to improve it

📢 Share it with others

---

<p align="center">
<b>💚 PharmaPlus — Your Trusted Health Partner</b>

Built with ❤️ using the MERN Stack.

</p>

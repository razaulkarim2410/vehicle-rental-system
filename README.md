🚗 Vehicle Rental System – Backend API

Live Link -  https://vehicle-rental-system-lake-five.vercel.app/
Github Link -  https://github.com/razaulkarim2410/vehicle-rental-system

Admin: 
Email- azadazad2410@gmail.com  ,  Password- 278356Azad

## 🎯 Project Overview
The **Vehicle Rental System** is a backend REST API designed to manage vehicle rentals efficiently.  
It supports vehicle inventory management, customer accounts, bookings, pricing calculation, and secure role-based authentication.

### Core Features
- 🚘 Vehicle inventory with availability tracking  
- 👤 User management (Admin & Customer roles)  
- 📅 Booking creation, cancellation, and returns  
- 🔐 Secure authentication using JWT  
- 🧮 Automatic rental price calculation  

---

## 🛠️ Technology Stack
- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **bcryptjs** – password hashing
- **jsonwebtoken (JWT)** – authentication & authorization

---

## 📁 Project Structure
The project follows a **modular, feature-based architecture** with clear separation of concerns.

src/
│
├── configs/ # Environment & database configs
├── modules/
│ ├── auth/
│ │ ├── auth.routes.ts
│ │ ├── auth.controllers.ts
│ │ ├── auth.services.ts
│ │ └── auth.middleware.ts
│ │
│ ├── users/
│ ├── vehicles/
│ └── bookings/
│
├── middlewares/
├── utils/
├── app.ts
└── server.ts

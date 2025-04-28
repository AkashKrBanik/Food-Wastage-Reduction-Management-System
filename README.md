
# Food Wastage Reduction Management System

## Overview 📄

The **Food Wastage Reduction Management System** is a full-stack web application designed to reduce food wastage by connecting donors with recipients. The platform allows users to donate surplus food, claim available food items, and generate recipes using leftover ingredients with the help of AI.

## Objective 🎯
To create a platform that connects food donors with individuals or organizations in need, aiming to reduce food wastage and promote social welfare by enabling users to donate and request surplus food efficiently.

## Features ✨

### Client (Frontend)
- **User Authentication**: Secure registration and login functionality.
- **Food Donation**: Add food items for donation, including details like quantity, location, and expiry date.
- **Food Requests**: View and manage donation requests (accept/reject).
- **Smart Recipe Suggestions**: Generate creative recipes using leftover ingredients, powered by AI.
- **Notifications**: Receive notifications for accepted/rejected requests.
- **Profile Management**: View donations, claims, and notifications in the user profile.
- **Responsive Design**: Optimized for both desktop and mobile devices.

### Server (Backend)
- **Authentication**: Secure user authentication using JWT (JSON Web Tokens).
- **Food Management**: APIs to add, fetch, and manage food items.
- **Request Management**: APIs to handle donation requests (accept/reject).
- **Notifications**: APIs to manage notifications for users.
- **AI Integration**: Generate recipes using Google Generative AI.
- **Cloudinary Integration**: Upload and manage food images.

---

## Tech Stack 🛠️

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build tooling.
- **Tailwind CSS**: For styling.
- **Axios**: For API requests.
- **React Router**: For navigation.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **MongoDB**: For database management.
- **Mongoose**: For MongoDB object modeling.
- **JWT**: For secure authentication.
- **Multer**: For file uploads.
- **Cloudinary**: For image hosting.
- **Google Generative AI**: For AI-powered recipe generation.

### Development Tools Used
- Visual Studio Code (IDE)
- Postman (API Testing)
- Git (Version Control)

---

## Platform Workflow 🔄
- **User Registration and Login** (JWT based)
- **Add Food Donation** with image upload (Cloudinary)
- **Browse Available Donations**
- **Request a Donation**
- **Donors manage requests (Accept/Reject)**
- **Smart Recipe Suggestions using AI**
- **Receive Notifications**
- **Profile Management**

---

## Project Structure 🗂️

```
Food-Wastage-Reduction-Management-System/
├── client/                     # Frontend code
│   ├── public/                 # Static assets (images, icons, etc.)
│   ├── src/                    # React components and pages
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages (e.g., Home, Profile, etc.)
│   │   ├── App.jsx             # Main React application file
│   │   ├── main.jsx            # Entry point for React
│   ├── .env                    # Environment variables for frontend
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
├── server/                     # Backend code
│   ├── models/                 # Mongoose schemas for MongoDB
│   ├── routes/                 # API routes
│   ├── middleware/             # Authentication and other middleware
│   ├── uploads/                # Temporary file uploads
│   ├── server.js               # Entry point for the backend
│   ├── .env                    # Environment variables for backend
│   └── package.json            # Backend dependencies
└── README.md                   # Project documentation
```

---

## Installation ⚙️

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Cloudinary** account (for image hosting)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/Food-Wastage-Reduction-Management-System.git
   cd Food-Wastage-Reduction-Management-System
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

   - **Create a `.env` file in the server directory with the following variables:**
   ```bash
   MONGO_URI=<your-mongodb-uri>
   GEN_API_KEY=<your-google-generative-ai-api-key>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

   - **Start the backend server:**
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

   - **Create a `.env` file in the client directory with the following variables:**
   ```bash
   VITE_DEV_URL=http://localhost:5000
   ```

   - **Start the frontend development server:**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`.

---

## API Endpoints 📡

### Authentication
- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in a user.
- **POST /auth/logout**: Log out a user.

### Food Management
- **POST /food/add**: Add a new food donation.
- **GET /food**: Fetch all available food items.
- **GET /food/getItem/:id**: Fetch details of a specific food item.

### Request Management
- **POST /food/requests**: Fetch donation requests.
- **POST /food/requestDonation**: Request a food donation.
- **POST /food/acceptReq**: Accept a donation request.
- **POST /food/rejectReq**: Reject a donation request.

### Notifications
- **GET /auth/notifications**: Fetch user notifications.
- **PUT /auth/notifications/:id**: Mark a notification as read.
- **DELETE /auth/notifications/:id**: Delete a notification.

---

## Screenshots 🖼️

- **Home Page**
  ![Home Page](path/to/home-page-screenshot.png)

- **Add Food Donation**
  ![Add Food Donation](path/to/add-food-donation-screenshot.png)

- **Smart Recipe Suggestions**
  ![Smart Recipe Suggestions](path/to/smart-recipe-suggestions-screenshot.png)

---

## Future Enhancements 🚀
- Add real-time notifications using WebSockets.
- Implement advanced search and filtering for food items.
- Add multi-language support.
- Enhance AI recipe generation with more customization options.
- Create reports of donations by users or organizations.
- Build a mobile application for broader accessibility.


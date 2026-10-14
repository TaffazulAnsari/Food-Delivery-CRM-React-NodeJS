
# 🍔 Food Delivery CRM – React & Node.js

<p align="center">
  <img src="https://img.shields.io/badge/React-2026-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

<p align="center">
  <b>A modern food delivery UI and CRM backend project built with React, Node.js, Express, and MongoDB.</b>
</p>

<p align="center">
  <a href="https://food-delivery-crm-frontend.onrender.com/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Open_Application-2ea44f?style=for-the-badge" alt="Live Demo"/>
  </a>
  <a href="https://github.com/TaffazulAnsari/Food-Delivery-CRM-React-NodeJS">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
</p>

---

## 🌐 Live Application

**Frontend:** [https://food-delivery-crm-frontend.onrender.com/](https://food-delivery-crm-frontend.onrender.com/)

**GitHub Repository:** [Food Delivery CRM – React & Node.js](https://github.com/TaffazulAnsari/Food-Delivery-CRM-React-NodeJS)

> Note: The live link points to the deployed frontend. Backend deployment and integration should be verified separately.

---

## 📸 Project Preview

<p align="center">
  <img
    src="https://github.com/TaffazulAnsari/Food-Delivery-CRM-React-NodeJS/blob/main/Screenshot%202026-10-14%20224444.png?raw=true"
    alt="Food Delivery CRM application screenshot"
    width="100%"
  />
</p>

---

## 📖 About the Project

Food Delivery CRM is a development project containing a React-based user interface and a Node.js CRM backend.

The repository includes two main components:

- **`food-delivery-ui/`** — React and Vite frontend with signup, OTP, home, and product detail screens.
- **`crm-backend/`** — REST API built with Node.js, Express.js, and MongoDB, featuring JWT authentication and lead management.

The frontend is a UI prototype, while the backend provides counselor authentication and enquiry management functionality.

---

## ✨ Key Features

### 🖥️ Frontend

- React-based user interface.
- Vite development environment.
- Mobile-first UI design.
- Signup and OTP demo screens.
- Home and product detail screens.
- Demo cart interactions.

### ⚙️ Backend

- RESTful API architecture.
- Counselor registration and login.
- JWT-based authentication.
- Password hashing using bcryptjs.
- Public enquiry submission.
- Retrieval of unclaimed enquiries.
- Atomic lead claiming.
- Retrieval of counselor-assigned leads.
- Unique, normalized counselor email addresses.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Vite | Frontend development and build tool |
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| npm | Package management |
| Render | Frontend hosting |

---

## 📁 Project Structure

```text
Food-Delivery-CRM-React-NodeJS/
│
├── crm-backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── routes/
│       ├── middleware/
│       └── models/
│
├── food-delivery-ui/
│   ├── package.json
│   ├── index.html
│   ├── public/
│   └── src/
│
├── Screenshot 2026-10-14 224444.png
└── README.md
```

> The folder tree above illustrates a typical organization. Actual subfolders may differ depending on the repository's current code.

---

## 📋 Prerequisites

Install the following before running the project locally:

- [Node.js 18 or newer](https://nodejs.org/)
- npm
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance
- Git

Check your installed versions:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/TaffazulAnsari/Food-Delivery-CRM-React-NodeJS.git
```

Navigate into the project:

```bash
cd Food-Delivery-CRM-React-NodeJS
```

### 2. Configure the Backend

```bash
cd crm-backend
npm install
```

Create a `.env` file in the `crm-backend/` directory. If `.env.example` exists, copy it and update the values.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

**Important:** Replace the example values with your actual configuration. Never commit `.env` files, database credentials, or JWT secrets to GitHub.

### 3. Start the Backend

```bash
npm run dev
```

Use `npm start` instead if that is the start command defined in your backend `package.json`.

Default local API base URL:

```text
http://localhost:5000/api
```

### 4. Start the Frontend

Open a second terminal from the repository root:

```bash
cd food-delivery-ui
npm install
npm run dev
```

Open the URL displayed by Vite, usually:

```text
http://localhost:5173
```

---

## 🔗 API Documentation

The following endpoints are included in the backend project.

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a counselor |
| POST | `/api/auth/login` | Public | Authenticate a counselor |
| GET | `/api/auth/me` | Required | Get the current counselor |
| POST | `/api/enquiries` | Public | Submit an enquiry |
| GET | `/api/enquiries/public` | Required | Get unclaimed enquiries |
| PATCH | `/api/enquiries/:id/claim` | Required | Claim an enquiry |
| GET | `/api/enquiries/my-leads` | Required | Get assigned enquiries |

### 🔐 Authentication

Protected endpoints expect a JWT token in the request header:

```http
Authorization: Bearer YOUR_TOKEN
```

### Example: Register a Counselor

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Counselor","email":"counselor@example.com","password":"StrongPass123"}'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"counselor@example.com","password":"StrongPass123"}'
```

### Example: Submit an Enquiry

```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Sharma","email":"asha@example.com","phone":"9876543210","courseInterest":"Full Stack Development","message":"Please contact me"}'
```

For protected routes, replace `YOUR_TOKEN` with the token returned by the login endpoint.

---

## 🔒 Security and Design

- Passwords are hashed with bcryptjs.
- JWT authentication middleware protects private API routes.
- Counselor emails are normalized and unique.
- Lead claiming uses a conditional MongoDB update to avoid multiple successful claims on the same lead.
- Public enquiry submission is intentionally unauthenticated.

### Recommended Production Improvements

- Rate limiting and abuse prevention.
- Email verification.
- Request validation and structured error handling.
- Restricted CORS configuration.
- Production logging and monitoring.
- Pagination for large enquiry lists.
- Privacy and data retention policies.
- HTTPS and secure secret management.

---

## ⚠️ Current Limitations

- OTP verification is a demo interaction; no SMS provider is connected.
- Cart actions are demo interactions.
- Full backend integration for the frontend UI flows is not implemented.
- The frontend live link does not, by itself, confirm that the backend is deployed or connected.

---

## 🚢 Deployment

The frontend is hosted on Render.

**Live URL:** [https://food-delivery-crm-frontend.onrender.com/](https://food-delivery-crm-frontend.onrender.com/)

Before deploying the backend, configure its MongoDB connection, JWT secret, allowed frontend origin, and production start command. Update the frontend API base URL to the deployed backend URL if integration is implemented.

---

## 👨‍💻 Author

**Taffazul Ansari**

- GitHub: [@TaffazulAnsari](https://github.com/TaffazulAnsari)
- Project Repository: [Food Delivery CRM – React & Node.js](https://github.com/TaffazulAnsari/Food-Delivery-CRM-React-NodeJS)
- Live Demo: [Open Application](https://food-delivery-crm-frontend.onrender.com/)

---

## 📄 License

No license is specified here. Add a `LICENSE` file if you intend to distribute the project under an open-source license.

---

<p align="center">
  <b>Built with React, Node.js, Express, and MongoDB.</b>
</p>

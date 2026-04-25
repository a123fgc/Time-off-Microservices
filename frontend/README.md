# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# Timeoff Microservice Implementation Plan

## Overview
A production-ready Leave Management System (TimeoffSync) built with the MERN stack (MongoDB, Express, React, Node.js). It features role-based access control, automated business logic for leave deductions, and a modern, glassmorphic UI.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons), Axios
- **Auth**: JWT (JSON Web Tokens), Bcrypt.js
- **State Management**: React Context API

## Features
### 1. Authentication & Roles
- **Registration & Login**: Secure JWT-based system.
- **Roles**: `Admin` and `Employee`.
- **Protected Routes**: Ensuring users only access pages authorized for their role.

### 2. Employee Features
- **Dashboard**: View current leave balance (default: 10 days).
- **Apply for Leave**:
  - **Annual Leave**: Deducts from balance on approval.
  - **Sick Leave**: Deducts from balance on approval.
  - **Company Leave**: Auto-approved, no deduction.
- **Leave History**: Real-time tracking of request status (Pending, Approved, Rejected).

### 3. Admin Features
- **Dashboard Overview**: Key metrics (Total requests, Pending, Holidays).
- **Request Management**: Approve or reject employee requests.
- **Company Holidays**: Add and view company-wide holidays.

## Business Logic Details
- **Balance Check**: System prevents applying for leave if the requested days exceed the current balance.
- **Deduction**: Balance is only deducted when an Admin **Approves** an 'Annual' or 'Sick' leave request.
- **Auto-Approval**: 'Company Leave' is marked as 'Approved' immediately upon submission.

## Project Structure
```text
/backend
  /config      - Database connection
  /controllers - Business logic for Auth, Leaves, Admin
  /middleware  - Auth & Admin guards
  /models      - Mongoose Schemas (User, Leave, CompanyLeave)
  /routes      - API Endpoints
  server.js    - Entry point

/frontend
  /src
    /components - Reusable UI (Header, ProtectedRoute)
    /context    - Auth state management
    /pages      - Dashboard, Login, Register
    /services   - API (Axios) configuration
    App.jsx     - Routing
```

## How to Run
### Backend
1. `cd backend`
2. `npm install`
3. Ensure MongoDB is running on `mongodb://localhost:27017/timeoff-microservice`
4. `npm run dev` (Runs on port 5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

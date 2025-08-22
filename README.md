# Leave Management System

A full-stack application for managing employee leave requests, featuring a backend built with Node.js, Express, and MongoDB, and a frontend built with React and Tailwind CSS. Employees can submit leave requests, view their leave history, and track the approval status through a visual workflow. Managers (Team Lead, Project Lead, HR, CEO) can approve or reject requests based on their role in the approval chain.

## Features

### Employee Features

- **Submit Leave Requests**: Submit leave requests with start date, end date, and reason
- **View Leave History**: View all personal leave requests in a table format
- **Track Status**: Visual workflow tracking (Employee → Team Lead → Project Lead → HR → CEO)

### Manager Features

- **Role-based Approval**: Approve or reject leave requests based on role hierarchy
- **Organization-wide View**: View all leave requests across the organization
- **Visual Workflow**: See the complete approval chain with color-coded status indicators

### Authentication & Security

- JWT-based authentication with secure cookie storage
- Role-based access control
- Secure API endpoints

### Approval Workflow

1. **Employee** → Submits leave request
2. **Team Lead** → First level approval
3. **Project Lead** → Second level approval
4. **HR** → Human Resources approval
5. **CEO** → Final approval
   Each stage must be approved before moving to the next level. Any rejection stops the workflow immediately.

## Quick Start

### Backend Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/leave-management-system.git
   cd leave-management-system/backend

   npm install

   ```

2. **Set Up Environment Variables**:
   ```bash
   PORT=7001
   MONGO_URI=mongodb://localhost:27017/leave-management
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```
3. **Run the Backend**:
   ```bash
     node server
   ```
4. **Database Seeder (Optional)**:
   ```bash
      node src/seed/userSeeder
   ```

### Frontend Setup

1. **Navigate to Frontend & Install**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

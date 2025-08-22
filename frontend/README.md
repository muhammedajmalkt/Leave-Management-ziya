# Leave Management System

A full-stack application for managing employee leave requests, featuring a backend built with Node.js, Express, and MongoDB, and a frontend built with React and Tailwind CSS. Employees can submit leave requests, view their leave history, and track the approval status through a visual workflow. Managers (Team Lead, Project Lead, HR, CEO) can approve or reject requests based on their role in the approval chain.

##  Features

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

## System Architecture

### Approval Workflow
1. **Employee** → Submits leave request
2. **Team Lead** → First level approval
3. **Project Lead** → Second level approval  
4. **HR** → Human Resources approval
5. **CEO** → Final approval
Each stage must be approved before moving to the next level. Any rejection stops the workflow immediately.


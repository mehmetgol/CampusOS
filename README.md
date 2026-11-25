# 🎓 CampusOS

CampusOS is a full-stack student management system designed to manage students, courses, and course enrollments through a modern and responsive web interface.

The project was developed as a learning and portfolio project using ASP.NET Core, React, SQL Server, Entity Framework Core, JWT Authentication, and Tailwind CSS.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Password hashing
- Role-based authorization
- Admin and Student roles
- Protected API endpoints
- Persistent login using local storage

### 👨‍🎓 Student Management

Admins can:

- Add students
- Edit student information
- Delete students
- Search students
- View all students

Student accounts have read-only access.

### 📚 Course Management

Admins can:

- Add courses
- Edit courses
- Delete courses
- Search courses
- View all courses

Each course contains information such as:

- Course name
- Course code
- Credit

### 📝 Course Enrollment

Admins can:

- Enroll students in courses
- Remove students from courses
- Search course enrollments
- View student-course relationships

Duplicate course enrollments are prevented at the database level.

### 🎯 Grades & AGNO (GPA)

- Admins enter letter grades (AA–FF, 4.00 scale) for each enrollment
- Admins link student user accounts to student profiles
- Students see their own AGNO, completed / ongoing credits and course grades
- **Target AGNO calculator:** shows the average (and minimum letter grade) needed in the remaining credits to reach a target AGNO, or tells you if it is impossible / already guaranteed
- **Grade simulation:** pick expected grades for ongoing courses and see the projected AGNO
- Grades are private: students can only see their own grades

### 📊 Dashboard

The dashboard provides an overview of the CampusOS system, including:

- Total students
- Total courses
- Total course enrollments

### 📱 Responsive Design

CampusOS is designed for both desktop and mobile devices.

The mobile interface includes:

- Responsive layouts
- Mobile navigation menu
- Hamburger menu
- Mobile-friendly student cards
- Mobile-friendly course enrollment cards

---

## 🛠️ Technologies

### Backend

- C#
- .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core
- JWT Authentication
- Swagger / OpenAPI

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS

### Database

- Microsoft SQL Server 2022
- Docker

### Development Tools

- Visual Studio Code
- Git
- Docker Desktop

---

## 🏗️ Project Structure

```text
CampusOS/
│
├── Models/
│   ├── Ogrenci.cs
│   ├── Ders.cs
│   ├── Kayit.cs
│   ├── Kullanici.cs
│   ├── LoginRequest.cs
│   └── RegisterRequest.cs
│
├── Migrations/
│
├── Program.cs
│
└── frontend/
    │
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   └── Topbar.jsx
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Ogrenciler.jsx
    │   │   ├── Dersler.jsx
    │   │   ├── Kayitlar.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    └── package.json
```

---

## 🔐 Role-Based Access

CampusOS currently supports two roles.

| Feature | Admin | Student |
|---|:---:|:---:|
| View Dashboard | ✅ | ✅ |
| View Students | ✅ | ✅ |
| Search Students | ✅ | ✅ |
| Add Student | ✅ | ❌ |
| Edit Student | ✅ | ❌ |
| Delete Student | ✅ | ❌ |
| View Courses | ✅ | ✅ |
| Add Course | ✅ | ❌ |
| Edit Course | ✅ | ❌ |
| Delete Course | ✅ | ❌ |
| View Enrollments | ✅ | ✅ |
| Create Enrollment | ✅ | ❌ |
| Remove Enrollment | ✅ | ❌ |
| Enter Grades | ✅ | ❌ |
| View AGNO | ✅ (all students) | ✅ (own only) |
| Link Account to Student | ✅ | ❌ |

Authorization is enforced by the backend API, not only by the frontend interface.

---

## 🗄️ Database

CampusOS uses Microsoft SQL Server running inside Docker.

The main database entities are:

```text
Ogrenci
   │
   │
   └──── Kayit ──── Ders

Kullanici
```

`Kayit` represents the relationship between a student and a course.

The database also includes unique constraints to prevent:

- Duplicate course codes
- Duplicate student-course enrollments
- Duplicate user email addresses

---

## 🔑 Authentication Flow

```text
User
  │
  ▼
Login / Register
  │
  ▼
ASP.NET Core API
  │
  ▼
JWT Token
  │
  ▼
Authenticated Request
  │
  ▼
Authorization
  │
  ├── Admin
  │     └── Read + Create + Update + Delete
  │
  └── Student
        └── Read
```

---

## 🚀 Running the Project

### 1. Start SQL Server

Make sure Docker Desktop is running and start the SQL Server container.

### 2. Start the Backend

From the CampusOS project directory:

```bash
dotnet run
```

The backend runs locally on:

```text
http://localhost:5070
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

---

## 🔒 Security

Sensitive configuration values such as:

- SQL Server passwords
- JWT signing keys
- Database connection strings

should not be committed to the repository.

CampusOS uses .NET User Secrets during local development for sensitive configuration.

---

## 📸 Screenshots

Screenshots of the following pages can be added here:

- Login
- Dashboard
- Student Management
- Course Management
- Course Enrollment
- Mobile Interface

---

## 🗺️ Future Improvements

Possible future improvements include:

- Allowing students to view only their own courses
- Course retakes (repeat grades)
- Attendance tracking
- Academic calendar
- Notifications
- Profile management
- Advanced dashboard statistics

---

## 🎯 Project Purpose

CampusOS was created to practice and demonstrate full-stack software development concepts including:

- REST API development
- CRUD operations
- Relational database design
- Entity Framework Core
- Authentication
- Authorization
- Role-based access control
- React component architecture
- Responsive web design
- Frontend-backend integration

---

## 👨‍💻 Developer

Developed as a full-stack software development portfolio project.

---

## 📄 License

This project is intended for educational and portfolio purposes.
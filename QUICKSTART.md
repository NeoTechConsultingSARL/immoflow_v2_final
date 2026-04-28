# ImmoFlow - Quick Start Guide

## 🚀 Getting Started with Secure Authentication

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- SQLite or MySQL

---

## ⚡ Quick Setup (5 minutes)

### 1. Install PHP Dependencies

```bash
cd d:\Projects\ImmoFlow\immoflow_v2
composer install
```

### 2. Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Setup Database

```bash
# Reset database and seed with test users
php artisan migrate:fresh --seed
```

### 4. Install NPM Dependencies

```bash
npm install
```

---

## 🎯 Running the Application

### Terminal 1: Backend Server

```bash
cd d:\Projects\ImmoFlow\immoflow_v2
php -S localhost:8000 -t public
```

Backend will be available at: **http://localhost:8000**

### Terminal 2: Frontend Dev Server

```bash
cd d:\Projects\ImmoFlow\immoflow_v2
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 🔐 Test Credentials

Copy any of these credentials to test the login system:

### Admin User
```
Email:    ahmed.benali@immoflow.com
Password: password
Role:     admin
```
**Access:** Full system access (settings, users, profiles)

### Manager User
```
Email:    sara.elamrani@immoflow.com
Password: password
Role:     manager
```
**Access:** Can manage companies, projects, tranches, blocs

### Regular User
```
Email:    youssef.idrissi@immoflow.com
Password: password
Role:     user
```
**Access:** Can view properties and access dashboard

---

## 🧪 Testing the Implementation

### Run All Tests

```bash
php artisan test --compact
```

### Run Specific Test Suites

```bash
# Login tests
php artisan test tests/Feature/Auth/LoginTest.php --compact

# Role-based access tests
php artisan test tests/Feature/Auth/RoleBasedAccessTest.php --compact
```

### What's Tested

✅ Login with valid credentials  
✅ Login with invalid credentials  
✅ Error handling and display  
✅ Redirect to dashboard  
✅ Role-based access control  
✅ 403 Forbidden for unauthorized access  
✅ User data in Inertia props  

---

## 📋 Key Features

### Frontend Features
- ✅ Real-time validation error display under form fields
- ✅ Loading state during form submission
- ✅ Remember me checkbox
- ✅ Password visibility toggle
- ✅ Responsive design
- ✅ Dark/Light theme support

### Backend Features
- ✅ Rate limiting (5 attempts per minute)
- ✅ Secure password hashing
- ✅ Session-based authentication
- ✅ Role-based middleware
- ✅ 403 Forbidden responses

### Role-Based Access
- ✅ **Admin**: /settings, /settings/users, /settings/profiles
- ✅ **Manager**: /companies, /projects, /tranches, /blocs
- ✅ **User**: /properties, /dashboard

---

## 🔍 File Structure Overview

```
ImmoFlow/
├── app/
│   ├── Http/
│   │   ├── Controllers/Auth/
│   │   │   └── AuthenticatedSessionController.php
│   │   ├── Requests/Auth/
│   │   │   └── LoginRequest.php
│   │   └── Middleware/
│   │       ├── CheckRole.php
│   │       └── HandleInertiaRequests.php
│   └── Models/
│       └── User.php
├── database/
│   ├── migrations/
│   │   └── 2026_04_23_115744_add_role_to_users_table.php
│   └── seeders/
│       └── UserSeeder.php
├── resources/js/
│   ├── components/
│   │   ├── LoginPage.tsx
│   │   └── dashboard/AppSidebar.tsx
│   ├── pages/
│   │   └── Dashboard.tsx
│   └── types/
│       └── auth.d.ts
├── routes/
│   ├── auth.php
│   └── web.php
└── tests/Feature/Auth/
    ├── LoginTest.php
    └── RoleBasedAccessTest.php
```

---

## 🔄 Login Flow

```
1. User enters credentials on /login
   ↓
2. Form submission via router.post('/login')
   ↓
3. Backend validates with LoginRequest
   ↓
4. If validation fails → Display errors under fields
   ↓
5. If validation passes → Authenticate user
   ↓
6. User object with role shared via Inertia
   ↓
7. Redirect to /dashboard
   ↓
8. Dashboard displays content based on user.role
```

---

## 🛡️ Access Control Flow

```
Request to Protected Route
   ↓
1. Check 'auth' middleware → User authenticated?
   ├─ No  → Redirect to /login
   ├─ Yes → Continue
   ↓
2. Check 'role:admin,manager' middleware (if present)
   ├─ User role matches? → Continue
   ├─ No → Return 403 Forbidden
   ↓
3. Render page/component
   ↓
4. Frontend conditionally displays based on user.role
```

---

## 🚨 Troubleshooting

### Issue: "Failed to open stream: No such file or directory vendor/autoload.php"

**Solution:** Run `composer install`

```bash
composer install --no-interaction
```

### Issue: Database not setup

**Solution:** Run migrations and seeding

```bash
php artisan migrate:fresh --seed
```

### Issue: Frontend won't start

**Solution:** Install dependencies and rebuild

```bash
npm install
npm run dev
```

### Issue: "Application in production" error

**Solution:** Set `APP_ENV=local` in `.env`

```env
APP_ENV=local
APP_DEBUG=true
```

---

## 📚 Documentation Files

- **IMPLEMENTATION.md** - Complete implementation details
- **.env.example** - Environment configuration template
- **package.json** - Frontend dependencies
- **composer.json** - Backend dependencies

---

## 🔗 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 💡 Next Steps

1. Test login with provided credentials
2. Verify role-based access control works
3. Try accessing restricted routes as different roles
4. Run the test suite to verify everything works
5. Customize branding/styling as needed
6. Implement additional features from the roadmap

---

## ✅ Acceptance Criteria Check

- [x] Migration successfully adds the role column to the users table
- [x] Users can log in and are redirected to the Dashboard
- [x] The user's role is correctly passed to the frontend via Inertia shared data
- [x] Unauthorized users receive a 403 Forbidden when attempting to access restricted backend routes

All requirements completed! ✨

# Laravel React Roles & Permissions Starter Kit

A **modern full-stack starter kit** using **Laravel 12** as the backend API, **React** as the frontend, and **Spatie Roles & Permissions** for managing user roles and access control.

Perfect for building scalable web applications with ready-to-use authentication, authorization, and API architecture.

## 🚀 Features

- Laravel 12 RESTful API backend
- React + Vite frontend
- Spatie Laravel-Permission integration
- Authentication system (Login, Register, Logout)
- Role-based access control (RBAC)
- Protected routes and permissions middleware
- API token support
- Developer-friendly folder structure

## 🛠️ Tech Stack

- PHP 8.2, Laravel 12
- React 19, Vite
- Spatie Laravel-Permission
- Sanctum (or JWT) for API auth
- Tailwind CSS
- Shadcn UI Components
- MySQL / PostgreSQL (your choice)

## 📦 Installation

1- **Clone the repo**  
- git clone https://github.com/AhtashamYousaf/laravel-react-roles-permissions.git
- cd laravel-react-roles-permissions  
    
2- **Install backend dependencies**  
- composer install
- cp .env.example .env
- php artisan key:generate  

3- **Install frontend dependencies**  
- npm install && npm run dev  
   
4- **Set up database**  
- Create a new database
- Update .env with your DB credentials  
    
5- **Run Migrations**  
- php artisan migrate  
    
6- **Seed default roles/permissions**  
- php artisan db:seed  
    
7- **Serve the application**  
- php artisan serve  

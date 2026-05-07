# ImmoFlow Project Setup Guide

This guide provides instructions to quickly set up and run the ImmoFlow application in your local development environment. This project uses **Laravel 13**, **Inertia.js**, and **React** on the frontend.

## Prerequisites

Before getting started, make sure you have the following tools installed on your local machine:

- **PHP** (>= 8.3)
- **Composer** (Dependency Manager for PHP)
- **Node.js** and **NPM**
- **SQLite** or your preferred database engine (MySQL/PostgreSQL)

## Getting the Repository

### Setting up SSH for GitHub (If needed)

If you don't already have an SSH key set up for your GitHub account to access private repositories, generate one using:

```bash
# Generate a new SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Start the ssh-agent in the background
eval "$(ssh-agent -s)"

# Add your SSH private key to the ssh-agent
ssh-add ~/.ssh/id_ed25519

# Display your public key to copy it
cat ~/.ssh/id_ed25519.pub
```

Go to your **[GitHub Settings > SSH and GPG keys > New SSH key](https://github.com/settings/keys)**, and paste your copied public key.

### Cloning the Project

Once your SSH key is set up, clone the repository and navigate into the project directory:

```bash
git clone git@github.com:NeoTechConsultingSARL/immoflow-release.git
cd immoflow-release
```

## Installation & Setup

We have streamlined the setup process using Composer scripts. 

### 1. Automated Setup

From the root directory of the project, simply run the following command to bootstrap everything:

```bash
composer run setup
```

Behind the scenes, this command automates everything you need:
1. Installs PHP dependencies (`composer install`)
2. Creates your `.env` file by copying the template (`.env.example`)
3. Generates the Laravel application key (`php artisan key:generate`)
4. Runs the database migrations (`php artisan migrate --force`)
5. Installs the NPM dependencies (`npm install --ignore-scripts`)
6. Builds the frontend assets (`npm run build`)

### 2. Manual Setup (Alternative)

If you prefer to run the setup manually, here are the step-by-step commands:

```bash
# 1. Install PHP dependencies
composer install

# 2. Setup your .env file
cp .env.example .env

# 3. Generate your application key
php artisan key:generate

# 4. Migrate your database
# Ensure you configure your database connection in .env first
php artisan migrate

# 5. Install frontend dependencies
npm install

# 6. Build assets
npm run build
```

## Running the Application Locally

Rather than opening multiple terminal windows to run Laravel and Vite separately, we have a convenient dev script!

Start your local backend and frontend development servers by running:

```bash
composer run dev
```

This single command will run:
- The backend web server (`php artisan serve`)
- The Vite frontend hot-reloading dev server (`npm run dev`)
- A queue listener for background jobs (`php artisan queue:listen`)
- Log streaming via Laravel Pail (`php artisan pail`)

You can now visit your application in the browser at **http://localhost:8000** or **http://127.0.0.1:8000**.

> **Note on Vue vs React:** You might have expected Vue natively, but please note that the `package.json` for this specific repository includes the `@inertiajs/react` and React libraries! The setup commands remain exactly the same for Inertia.

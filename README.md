# Laravel Licensing System

A modern, full-stack licensing management system built with Laravel 12, React 19, and Inertia.js. This application provides comprehensive license management capabilities for software vendors, including license generation, machine registration, client management, and API endpoints for license validation.

## 🚀 Features

### Core Functionality
- **License Management**: Create, edit, and manage software licenses with automatic key generation
- **Client Management**: Track clients and their associated licenses
- **Machine Registration**: Register and track machines using unique fingerprints
- **Package Management**: Organize software packages with metadata support
- **API Integration**: RESTful API endpoints for license validation and machine registration
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

### License Types
- **Per-User**: Licenses tied to individual users
- **Per-Machine**: Licenses tied to specific machines

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup
```bash
# Run migrations
php artisan migrate
```

### 4. Install Passport
```bash
# Install Passport keys
php artisan passport:install
```

### 5. Build Assets
```bash
# Build for development
npm run dev

# Or build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
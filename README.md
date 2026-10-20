# E-Commerce Project Structure

Proyek aplikasi E-Commerce yang terbagi menjadi **frontend** (React Native Expo) dan **backend** (PHP REST API Feature-Based Architecture).

## 📁 Struktur Folder Utama

```
ecommerce/
├── frontend/               # React Native (Expo Router) App
│   ├── app.json
│   ├── package.json
│   ├── src/
│   │   ├── app/            # Expo Router Pages & Routes
│   │   ├── modules/        # Feature Modules (auth, product, cart, orders, profile, dll)
│   │   └── shared/         # Services (API Client), Theme, Context
│   └── ...
└── backend/                # PHP REST API (Feature-Based Architecture)
    ├── public/             # Entry Point index.php
    ├── config/             # Config & CORS
    ├── src/
    │   ├── Core/           # Router, Request, Response
    │   └── Features/       # Feature Modules (Auth, Products, Categories, Cart, Orders, Profile)
    └── serve.sh            # Script jalankan backend server
```

## 🚀 Cara Menjalankan Project

### 1. Menjalankan Backend (PHP API)
```bash
cd backend
./serve.sh
# Server akan berjalan pada http://localhost:8000/api
```

### 2. Menjalankan Frontend (React Native Expo)
```bash
cd frontend
npm start
# Atau: npx expo start
```

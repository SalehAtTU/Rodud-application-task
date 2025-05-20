# 📦 Rodud Application Task

This is a simple truck-ordering application built with:

- **Backend**: Laravel API (PHP) — `rodud-backend/`
- **Mobile Frontend**: React Native + Expo — `rodud-mobile/`

Users can register/login, request new shipments, and track them. Administrators can view all orders and update their statuses. The app supports **English**, **Arabic**, and **Urdu** using `i18n-js`, and sends **in-app notifications** to admins when a new shipment is placed.

---

## 🛠️ Tech Stack

| Layer           | Technology                     |
|----------------|---------------------------------|
| Backend API     | Laravel 10, Sanctum, MySQL      |
| Frontend App    | React Native, Expo, i18n-js     |
| Notifications   | Simple in-app alert simulation  |
| Storage         | AsyncStorage (tokens/settings)  |

---

## 📁 Repository Structure

### `rodud-backend/`
├─ app/ # Controllers, Models, Notifications
├─ database/ # Migrations & Seeders
├─ routes/api.php # API Route Definitions
└─ .env # DB Credentials, Sanctum Settings

shell


### `rodud-mobile/`
├─ src/
│ ├─ api/ # Axios instance
│ ├─ i18n/ # Localization files & helpers
│ ├─ screens/ # All app screens
│ ├─ components/ # CustomDrawerContent, shared UI
│ └─ navigation/ # React Navigation setup
├─ .env # API URL override
└─ app.json # Expo configuration

yaml

---

## 🔧 Prerequisites

### Backend
- PHP ≥ 8.1
- Composer
- MySQL
- Laragon (Windows) or equivalent LEMP/LAMP stack

### Mobile
- Node.js ≥ 16
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- Android/iOS Emulator or **Expo Go** on mobile device

---

## 🚀 Setup & Run

### 1. Backend (Laravel)

Start services using Laragon, then:

```bash
cd rodud-backend
composer install
cp .env.example .env
Update .env with your MySQL DB credentials, then:

bash

php artisan migrate
php artisan db:seed
php artisan serve --host=0.0.0.0 --port=8000
Get your machine's local IP:

powershell

ipconfig
Use the IPv4 address (e.g. 192.168.8.177).

2. Mobile (React Native + Expo)
bash

cd rodud-mobile
yarn install
# or: npm install
Create .env with:

env

API_URL=http://<YOUR_MACHINE_IP>:8000/api
Then run:

bash

npx expo start -c
Scan QR code with Expo Go or run in emulator.

📱 App Screens & Flow
Auth
Login / Register (email or phone)

Resets navigation on success

User Flow
My Shipments: List current & past

New Shipment: Choose pickup/dropoff via map, select cargo/truck

Shipment Details: Status timeline, route, cargo info

Profile: Change app language

Admin Flow
All Orders: View & filter by status

Order Details: Update shipment status

Shared
Contact Support: Sends email stub to saleh.aljohani.cs@gmail.com

In-App Notifications: Alert on new order to admins

🔗 API Endpoints
Method	Endpoint	Auth	Description
POST	/api/register	Public	Create new user
POST	/api/login	Public	User login & token retrieval
GET	/api/shipments	User	Get user shipments
POST	/api/shipments	User	Create new shipment
GET	/api/shipments/{id}	User	Shipment details
GET	/api/admin/shipments	Admin	All shipments
PUT	/api/shipments/{id}	Admin	Update shipment status
POST	/api/support	User	Send support email (stub)

🌐 Internationalization (i18n)
Translations in rodud-mobile/src/i18n/locales/{en, ar, ur}.json

Uses helper t(key, vars) for fallback + interpolation

Users can switch languages at runtime via Profile screen

🧪 Testing & Quality
Manual testing across dev & prod builds

Cleared cache with expo start -c on every update

RTL verified for Arabic

Success/failure alerts confirmed

Internal docs: "How to add languages" + "How to integrate real push notifications"

🚧 Future Improvements
🔔 Push Notifications: Integrate Firebase or Pusher Channels

❗ Error Handling: Show retry options and network feedback

💬 Admin Messaging: Replace email with real-time chat

✅ E2E Testing: With Detox or Appium

🔁 CI/CD: GitHub Actions for linting, testing, and building artifacts
---


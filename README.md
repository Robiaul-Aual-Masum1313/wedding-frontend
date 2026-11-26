# WedPlan – Wedding Planning Platform

WedPlan is a modern wedding planning platform designed to make wedding planning easier and more organized. It connects customers with wedding service providers, allowing customers to explore services and manage bookings while vendors can manage their businesses, services, and subscriptions.

The frontend is built with Next.js, TypeScript, and Tailwind CSS, providing a responsive and user-friendly experience.

## 🌐 Live Website

[Visit WedPlan](https://wedding-frontend-murex.vercel.app/)

## ✨ Key Features

- **User Authentication:** Register and log in using email and password or Google authentication.
- **Role-Based Dashboards:** Separate dashboards for Customers, Vendors, and Administrators.
- **Service Discovery:** Browse wedding services, explore service details, and discover different service categories.
- **Booking Management:** Customers can book services, view their bookings, and cancel bookings.
- **Vendor Service Management:** Vendors can create, edit, delete, and manage the availability of their services.
- **Vendor Dashboard:** View business information, booking requests, and service statistics.
- **Subscription System:** Vendors can upgrade from the Free plan to Premium through Stripe Checkout.
- **Premium Benefits:** Premium vendors can enjoy unlimited active service listings.
- **Profile Management:** Customers and vendors can update their personal and business information.
- **Admin Dashboard:** Administrators can manage users, approve or reject services, and monitor transactions.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Lucide React | Icons |
| Better Auth | Authentication |
| Stripe | Subscription payments |
| React Toastify | Notifications |
| Swiper.js | Interactive sliders |

## 📦 Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Robiaul-Aual-Masum1313/wedding-frontend.git
```

### 2. Navigate to the Project Directory

```bash
cd wedding-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app
BETTER_AUTH_MONGODB_CONNECTION_STRING =
NEXT_PUBLIC_IMGBB_API_KEY=
```

Make sure the backend server is running and the API URL points to the correct backend address.

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🚀 Build for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🔗 Project Repositories

- **Frontend Repository:** [WedPlan Frontend](https://github.com/Robiaul-Aual-Masum1313/wedding-frontend)
- **Backend Repository:** [WedPlan Backend](https://github.com/Robiaul-Aual-Masum1313/wedding-backend)

## 👨‍💻 Project Information

**Project Name:** WedPlan – Wedding Planning Platform

**Live Website:** https://wedding-frontend-murex.vercel.app/


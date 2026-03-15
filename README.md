# DevMark Pro

DevMark is a premium marketplace for developers to buy and sell source code, templates, and digital assets. Built with Next.js and Supabase.

## 🚀 Getting Started

1.  **Environment Setup**:
    Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🛠 Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS
- **Backend**: Pure Supabase Architecture
- **Auth**: Supabase Auth (Email, Google, GitHub)
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage
- **Payments**: Stripe (Integrated)

## 📌 Project Versions & Major Changes

### v1.3.0 - Monetization & Professional Branding (Current)
- **Stripe Integration**: Link payment gateway for one-time purchases and subscriptions.
- **Pricing Page**: New high-conversion pricing plans page.
- **Professional Onboarding**: Users now choose their Field and Tech Stack upon account creation.
- **Onboarding Notifications**: Smart alerts for existing users to complete missing professional data.

### v1.2.0 - Pure Supabase Transition
- **Architecture**: Removed local NestJS backend in favor of direct Supabase integration.
- **Database Logic**: Migrated all tables and business logic to Supabase SQL & RLS.
- **OAuth Integration**: Added Google and GitHub sign-in support.
- **Live Sync**: Implemented `AuthListener` for real-time session management.

### v1.1.0 - Core Marketplace Features
- **Project Upload**: Full S3-compatible storage integration for assets.
- **Dashboard Realization**: Replaced all mock analytics with live database queries.
- **Messaging**: Initial implementation of the messaging infrastructure.

### v1.0.0 - Foundation
- **Initial Setup**: Next.js boilerplate with project architecture.
- **UI Design**: Modern, glassmorphism-based design system.
- **Mock Data**: Prototype pages for Dashboard, Explore, and Profile.

---

## 📄 License
Commercial - All rights reserved by DevMark.

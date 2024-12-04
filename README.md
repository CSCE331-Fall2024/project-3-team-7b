![Local Picture](/my-app/public/logo.png "Panda Express")
# Panda Express POS Project
A self-service kiosk and inventory management system for Panda Express.

## Description
This project is a streamlined solution for managing orders, inventory, and employee data. It includes a customer-facing kiosk, cashier and manager interfaces, and a centralized database for seamless communication between components.

## Features
- **Customer View (Kiosk):** Self-service interface for placing orders and payments.
- **Cashier View:** Point-of-sales system for handling transactions.
- **Manager View:** Tools for inventory and employee management, and sales reports.
- **Menu Board:** Displays real-time item availability and pricing.
- **Database:** Stores and manages all system data.

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/CSCE331-Fall2024/project-3-team-7b.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   - make sure to install in the my-app and backend directories
3. Start the application:
   ```bash
   npm run dev
   ```
## Architecture Overview
![Local Picture](/my-app/public/high-level.png "High Level Design")
#
The system is composed of:
- **Frontend:** Customer, Cashier, and Manager Views built with [technology stack].
- **Backend:** Database and API services for data management and communication.
- **External APIs:** Authentication and accessibility features.

## Usage
- Deploy the system in Panda Express to manage sales, orders, and inventory.
- Use the self-service kiosk to reduce customer wait times.

# Madina Goods Transport Company, Chiniot - Brokerage Management System ("Munshi Portal")

A modern, responsive, full-stack Web-based **Brokerage & Transport Management System** engineered for the Munshis and Administrators at **Madina Goods Transport Company, Chiniot, Punjab, Pakistan**.

---

## 🚚 System Architecture & Key Capabilities

1. **Shared Live Inventory Engine**:
   - **Main-Broker**: Primary owner of master stock (Wheat, Basmati Rice, Refined Sugar, Raw Cotton Bales, Sona Urea Fertilizer) with live total bags, weight in Maunds (من) and Metric Tons, and live valuation in PKR.
   - **Co-Brokers**: Associated brokers (*Tariq Chinioti Brokery, Bilal Gujjar & Co., Malik Irfan Grain Traders*) with allocated stock quotas and real-time sold vs. remaining trackers.
   - When any Co-Broker dispatches stock, the Main-Broker's available godown stock and grand totals update in real-time.

2. **Munshi Central Dispatch Table**:
   - Desktop & tablet-optimized Excel-style data table with header hover effects and sticky columns.
   - Instant multi-field Search (by Sr No, Truck Number, Driver Name, formatted CNIC `XXXXX-XXXXXXX-X`, Shop Name, City, and Material).
   - Instant **Quick-Toggle** button directly in each table row to switch Rent Status between **PAID** (Green) and **PENDING** (Amber/Red).
   - Print Pakistani Goods Transport Bilty (بلٹی) receipts with custom print stylesheet.

3. **Role-Based Access Control (RBAC)**:
   - **Single Admin**: Full authority to create, edit, delete dispatches, restock inward inventory, and manage master IRN commodities.
   - **5 Munshi Employees**: Daily operations access (New Dispatch entries, Stock Inward, Rent toggles, Bilty Printing, and Excel export). Deletion and master stock resets are strictly restricted to Admin.
   - No public sign-up — only developer/admin provisioned accounts.

4. **Posting IRN & Master Commodities**:
   - Admins can register standard commodities, bag weights, and base prices in PKR, eliminating repetitive typing for booking Munshis.

5. **Dedicated Graphical Analytics Page (`/analytics`)**:
   - Interactive charts for Commodity Stock Distribution, Rent Collection Health, Co-Broker Quota Utilization, and Destination City Frequencies.

6. **Excel Export (`.xlsx`)**:
   - 1-click export of the complete dispatch registry with auto-fitted columns, totals, and metadata.

---

## 🔐 Authorized User Accounts (Pre-configured)

| Role | Name | Username / Email | Default Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Haji Abdul Rehman | `admin` / `admin@madinagoods.com` | `MadinaAdmin@2026!` | Full Master Control (Add, Edit, Delete, IRN, Restock) |
| **Munshi 1** | Munshi Muhammad Aslam | `munshi1` / `aslam@madinagoods.com` | `MunshiPass@2026` | Dispatch, Inward, Toggle Rent, Print Bilty, Export Excel |
| **Munshi 2** | Munshi Tariq Mehmood | `munshi2` / `tariq@madinagoods.com` | `MunshiPass@2026` | Dispatch, Inward, Toggle Rent, Print Bilty, Export Excel |
| **Munshi 3** | Munshi Imran Zafar | `munshi3` / `imran@madinagoods.com` | `MunshiPass@2026` | Dispatch, Inward, Toggle Rent, Print Bilty, Export Excel |
| **Munshi 4** | Munshi Bilal Gujjar | `munshi4` / `bilal@madinagoods.com` | `MunshiPass@2026` | Dispatch, Inward, Toggle Rent, Print Bilty, Export Excel |
| **Munshi 5** | Munshi Waqas Ahmed | `munshi5` / `waqas@madinagoods.com` | `MunshiPass@2026` | Dispatch, Inward, Toggle Rent, Print Bilty, Export Excel |

*Note: One-click Quick-Fill buttons are conveniently provided on the `/login` page for seamless testing.*

---

## 🛠️ Stack & Technology

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Chart.js / React-Chartjs-2
- **Backend**: Next.js API Routes, TypeScript, JWT Cookies & Bearer Tokens, Bcryptjs
- **Database / ORM**: Prisma ORM with dual-engine persistence (PostgreSQL / MongoDB Atlas / Local SQLite)
- **Excel & Print**: SheetJS (`xlsx`) and Custom Print CSS Media queries

---

## 🚀 Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Database & Seed Data**:
   ```bash
   npx prisma db push
   npm run seed
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your desktop or tablet browser.

---

## 🌐 Deploying to Vercel & Render

### Deploying to Vercel
1. Import the repository into your Vercel dashboard.
2. Ensure Environment Variables are set (`DATABASE_URL`, `JWT_SECRET`).
3. Click **Deploy**. Vercel will automatically use `vercel.json` to build and launch the app.

### Deploying to Render
1. Connect this repository to Render.
2. Select **Web Service** or use the included `render.yaml` Blueprint.
3. Build Command: `npm install && npx prisma generate && npm run build`
4. Start Command: `npm run start`

---

## 📜 Copyright Notice
All reserved by **WebRace Co.** © 2026.
Madina Goods Transport Company, Chiniot, Punjab, Pakistan.

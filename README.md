# E-commerce Admin CRM Dashboard

A complete full-stack e-commerce admin dashboard with campaign automation, customer management, and analytics.

## Features

### 🔐 Authentication & Security
- Admin login with JWT authentication
- Protected API routes with middleware
- Role-based access control

### 📊 Analytics Dashboard
- Real-time sales analytics
- Customer growth tracking
- Revenue charts and metrics
- Order status distribution

### 🛍️ Product Management
- Add, edit, delete products
- Category management
- Stock tracking
- Image upload support

### 👥 Customer Management
- Customer profiles and contact info
- Order history tracking
- Purchase analytics per customer

### 🎯 Campaign Automation
- Create discount campaigns with conditions
- Automatic trigger detection
- Coupon code generation
- Customer notification system

### 📈 Triggered Discounts
- Real-time campaign triggers
- Customer contact tracking
- Discount usage monitoring
- Status management (pending/contacted/used)

### 📦 Order Management
- Order creation and tracking
- Invoice generation
- Payment method tracking
- Automatic campaign trigger checking

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **TanStack Query** for data fetching
- **Recharts** for analytics visualization

### Backend
- **Next.js API Routes** for REST API
- **Drizzle ORM** for database operations
- **PostgreSQL** for data storage
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database Schema
- Products, Categories, Customers
- Orders and Order Items
- Campaigns and Triggered Discounts
- Admin Users and Coupons

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ecommerce-admin-crm
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database URL and JWT secret:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_crm"
JWT_SECRET="your-super-secret-jwt-key"
```

4. **Set up the database:**
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Access the application:**
- Open [http://localhost:3000](http://localhost:3000)
- Login with: `admin@example.com` / `password123`

## Database Management

### Drizzle Studio
View and edit your database with Drizzle Studio:
```bash
npm run db:studio
```

### Migrations
Generate new migrations after schema changes:
```bash
npm run db:generate
npm run db:migrate
```

## Campaign System

### How It Works
1. **Create Campaign**: Set discount conditions (quantity/amount thresholds)
2. **Order Processing**: When orders are created, the system checks all active campaigns
3. **Automatic Triggers**: If conditions are met, discounts are automatically triggered
4. **Customer Notification**: Triggered discounts are logged for follow-up
5. **Status Tracking**: Track contact attempts and coupon usage

### Example Campaign
- **Condition**: Customer buys 10+ items
- **Action**: Generate 15% discount coupon
- **Result**: Customer gets notified with unique coupon code

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Products
- `GET /api/products` - List products with pagination
- `POST /api/products` - Create new product

### Customers
- `GET /api/customers` - List customers with pagination
- `POST /api/customers` - Create new customer

### Orders
- `GET /api/orders` - List orders with pagination
- `POST /api/orders` - Create new order (triggers campaign checks)

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create new campaign

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics

### Triggered Discounts
- `GET /api/triggered-discounts` - List triggered discounts
- `PATCH /api/triggered-discounts` - Update discount status

## Future Enhancements

### Phase 2 Features
- **Chatbot Integration**: AI-powered customer support
- **Social Media Webhooks**: Instagram/WhatsApp integration
- **SMS/Email Automation**: Twilio integration for notifications
- **Advanced Analytics**: Customer segmentation and behavior analysis
- **Multi-channel Marketing**: Broadcast campaigns across platforms

### Planned Integrations
- **Twilio**: SMS notifications for triggered discounts
- **OpenAI**: Chatbot for customer queries
- **Meta Business API**: Social media campaign management
- **Email Services**: Automated email marketing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support, please open an issue in the repository or contact the development team.
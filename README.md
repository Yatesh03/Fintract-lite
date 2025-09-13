# 💰 FinTract-Lite

A modern, comprehensive personal finance management application designed to help individuals take control of their financial future. FinTract-Lite combines intuitive expense tracking, smart savings automation, AI-powered financial advice, and beautiful data visualizations to make financial management effortless and engaging.

## 🌟 Key Highlights

- **🎯 Smart Round-Up Savings**: Automatically saves spare change from every transaction
- **🤖 AI Financial Advisor**: Get personalized financial insights and recommendations
- **📊 Advanced Analytics**: Beautiful charts and comprehensive financial breakdowns
- **💡 Intelligent Budgeting**: Set and track budgets with real-time insights
- **🔐 Bank-Level Security**: JWT authentication with secure cookie management

---

## ✨ Features

### 💰 **Financial Tracking**
- **Income & Expense Management**: Categorized transaction tracking with detailed history
- **Real-Time Balance**: Live calculation of financial position
- **Category Analytics**: Detailed breakdown of spending patterns
- **Monthly/Yearly Trends**: Visual representation of financial trends

### 🎯 **Smart Savings**
- **Automatic Round-Up**: Every expense is rounded up to the nearest ₹10, with spare change saved
- **Savings Goals**: Set and track monthly savings targets
- **Progress Tracking**: Visual progress indicators for savings goals
- **Withdrawal Management**: Easy access to saved funds when needed

### 📊 **Budget Management**
- **Category Budgets**: Set spending limits for different expense categories
- **Budget Monitoring**: Real-time tracking of budget utilization
- **Overspending Alerts**: Visual indicators when approaching budget limits
- **Budget Analytics**: Compare actual vs planned spending

### 🤖 **AI Financial Advisor**
- **Personalized Insights**: AI analyzes your spending patterns and financial health
- **Smart Recommendations**: Get advice on savings, budgeting, and financial optimization
- **Spending Analysis**: Detailed breakdown of expenses with optimization suggestions
- **Financial Goal Planning**: Strategic advice for short-term and long-term financial goals
- **Interactive Chat**: Ask questions and get instant financial guidance

### 📱 **User Experience**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Intuitive Dashboard**: Clean, modern interface with key financial metrics
- **Real-Time Updates**: Instant reflection of financial changes
- **Skeleton Loading**: Smooth loading states for better user experience
- **Toast Notifications**: Instant feedback for all user actions

### 🔐 **Security & Authentication**
- **JWT Authentication**: Secure token-based authentication system
- **HTTP-Only Cookies**: Enhanced security with secure cookie management
- **Password Hashing**: bcrypt encryption for user password protection
- **Protected Routes**: Secure access to financial data

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.0 with modern hooks
- **Build Tool**: Vite 6.3.5 for lightning-fast development
- **Styling**: Tailwind CSS 4.1.10 for utility-first styling
- **Routing**: React Router DOM 7.6.2 for seamless navigation
- **HTTP Client**: Axios 1.10.0 for efficient API communication
- **Charts**: Recharts 2.15.3 for beautiful data visualizations
- **Icons**: Lucide React 0.515.0 for modern iconography
- **Notifications**: React Hot Toast 2.5.2 for user feedback
- **State Management**: React Context API for global state

### Backend
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js 5.1.0 for robust API development
- **Database**: MongoDB with Mongoose 8.15.2 ODM
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.2)
- **Security**: bcryptjs 3.0.2 for password hashing
- **Environment**: dotenv 16.5.0 for configuration management
- **CORS**: CORS 2.8.5 for cross-origin resource sharing
- **Cookies**: cookie-parser 1.4.7 for cookie handling

### Development Tools
- **Linting**: ESLint with React hooks plugin
- **Development Server**: Nodemon for auto-restart
- **Deployment**: Vercel configuration included

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fintract-lite.git
   cd fintract-lite
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

5. **Environment Configuration**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fintract-lite
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=development
   ```

6. **Start the application**
   
   **Option 1: Run both frontend and backend separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```
   
   **Option 2: If you have a root start script**
   ```bash
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 💻 Usage Guide

### 1. **Getting Started**
- Create an account or log in with existing credentials
- Set up your profile and financial preferences

### 2. **Adding Transactions**
- Navigate to "Add Transactions" 
- Enter amount, select category, type (Income/Expense), and description
- Watch as round-up savings are automatically calculated for expenses

### 3. **Budget Management**
- Go to "Set Budgets" to create category-wise spending limits
- Monitor your budget utilization in the "Budgets" section
- Receive visual alerts when approaching limits

### 4. **Savings Tracking**
- Visit "Savings Wallet" to see your accumulated savings
- Set monthly savings goals and track progress
- Withdraw savings when needed

### 5. **AI Financial Advisor**
- Chat with the AI advisor for personalized financial insights
- Ask about spending patterns, budget optimization, or financial goals
- Get actionable recommendations based on your financial data

### 6. **Dashboard Analytics**
- View comprehensive financial overview
- Analyze spending trends with interactive charts
- Monitor financial health with key metrics

---

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
GET /api/auth/me - Get current user
```

### Transaction Endpoints
```
GET /api/transactions - Get all transactions
POST /api/transactions - Add new transaction
GET /api/transactions/stats - Get transaction statistics
```

### Budget Endpoints
```
GET /api/budgets - Get all budgets
POST /api/budgets - Create new budget
PUT /api/budgets/:id - Update budget
DELETE /api/budgets/:id - Delete budget
```

### Savings Endpoints
```
GET /api/savings - Get savings data
POST /api/savings/goal - Set savings goal
POST /api/savings/withdraw - Withdraw from savings
```

---

## 🎯 Unique Features

### Smart Round-Up Savings
FinTract-Lite automatically rounds up every expense to the nearest ₹10 and saves the difference. For example, if you spend ₹47, it's rounded up to ₹50, and ₹3 is automatically added to your savings.

### AI Financial Advisor
Our AI advisor analyzes your spending patterns and provides:
- Personalized spending insights
- Budget optimization suggestions
- Savings strategies
- Financial goal planning
- Investment guidance

### Advanced Analytics
- Real-time financial health scoring
- Category-wise expense breakdown
- Monthly and yearly trend analysis
- Budget vs actual spending comparisons

---

## 🏗️ Project Structure

```
fintract-lite/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context providers
│   │   ├── pages/          # Main page layouts
│   │   ├── sections/       # Feature-specific sections
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route definitions
│   └── index.js            # Server entry point
├── README.md               # Project documentation
└── package.json            # Root dependencies
```

---

## 🤝 Contributing

We welcome contributions to FinTract-Lite! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the installation instructions above
4. Make your changes and test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- Follow ESLint configuration for code style
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design for new UI components
- Test all functionality before submitting

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Provide detailed reproduction steps for bugs
- Include screenshots for UI-related issues

---

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - Initial work - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape FinTract-Lite
- Inspiration from modern fintech applications
- Open source community for amazing tools and libraries

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Contact us at support@fintract-lite.com
- Check out our documentation for troubleshooting

---

**Made with ❤️ for better financial management**

# 🛍️ OmiSeller - AI-Powered E-commerce Assistant

OmiSeller is an intelligent e-commerce management platform that helps sellers optimize their online business operations using AI technology.

## ✨ Features

- 📊 **Dashboard Analytics** - Real-time sales and performance tracking
- 🔍 **Smart Product Search** - AI-powered product discovery and management
- 📦 **Inventory Management** - Keep track of your stock levels
- 📝 **Order Processing** - Streamlined order management system
- 📧 **Email Integration** - Automated customer communication
- 💰 **Price Calculator** - Smart pricing recommendations
- 📈 **Sales Analytics** - Detailed insights and trends
- 🎯 **Target Tracking** - Set and monitor business goals
- 🌙 **Dark Mode** - Eye-friendly interface options

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/omiseller.git
cd omiseller
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Gemini API key:
```bash
GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API
- **Backend**: Express.js, Node.js
- **Database**: SQLite (better-sqlite3)
- **Build Tool**: Vite
- **Data Processing**: XLSX (Excel file handling)

## 📁 Project Structure

```
omiseller/
├── src/
│   ├── components/     # React components
│   ├── services/       # API and business logic
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── types.ts        # TypeScript type definitions
├── server.ts           # Express backend server
├── package.json        # Project dependencies
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── .env.example        # Environment variables template
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Remove build files

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

To get your Gemini API key:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Generate a new API key
4. Copy and paste it into your `.env.local` file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)

## 🙏 Acknowledgments

- Built with Google Gemini AI
- UI components inspired by modern e-commerce platforms
- Icons by Lucide

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for e-commerce sellers worldwide

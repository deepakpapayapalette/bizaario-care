# Bizaario Care

A comprehensive healthcare management platform built with React and Vite. This application provides multi-role dashboards and features for healthcare providers, administrators, doctors, and hospitals.

## 🚀 Features

### Core Features
- **Multi-Role Authentication**: Secure login and signup for different user types
- **Admin Dashboard**: Complete administrative control panel
- **Doctor Portal**: Dedicated interface for healthcare professionals
- **Hospital Management**: Hospital-specific features and management
- **Responsive Design**: Mobile-first approach using TailwindCSS
- **Modern UI**: Built with Material-UI (MUI) components
- **Data Visualization**: Interactive charts using Recharts
- **Form Management**: Robust form handling with Formik and Yup validation
- **Toast Notifications**: User-friendly notifications with React Toastify
- **Smooth Animations**: Enhanced UX with Framer Motion

### Tech Stack
- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.x
- **Styling**: TailwindCSS + Material-UI
- **Routing**: React Router DOM v7
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Form Handling**: Formik + Yup
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons, MUI Icons
- **Animations**: Framer Motion
- **Carousel**: React Slick, React Multi Carousel

## 📁 Project Structure

```
bizaario-care/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   ├── doctor/      # Doctor-specific components
│   │   ├── hospital/    # Hospital-specific components
│   │   ├── website/     # Public website components
│   │   ├── common/      # Shared components
│   │   ├── UI/          # UI components
│   │   ├── Utils/       # Utility components
│   │   └── header-footer/ # Layout components
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ErrorPage.jsx
│   ├── routes/          # Route configurations
│   │   ├── WebsiteRoutes.jsx
│   │   └── AdminRoutes.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── .gitignore
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # TailwindCSS configuration
└── vite.config.js       # Vite configuration
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd bizaario-care
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables (if needed):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit:
```
http://localhost:5173
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## 🔐 Authentication Routes

- `/login` - User login page
- `/signup` - User registration page

## 🎨 Styling

This project uses a combination of:
- **TailwindCSS**: Utility-first CSS framework
- **Material-UI**: Pre-built React components
- **Custom CSS**: Additional custom styling in `index.css`

## 🧩 Key Dependencies

| Package | Purpose |
|---------|--------|
| `react` | Core framework |
| `react-router-dom` | Routing |
| `@mui/material` | UI components |
| `axios` | HTTP requests |
| `formik` | Form management |
| `yup` | Schema validation |
| `recharts` | Data visualization |
| `framer-motion` | Animations |
| `react-toastify` | Notifications |
| `sweetalert2` | Beautiful alerts |
| `tailwindcss` | Utility CSS |

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

- Your Team/Name

## 🐛 Bug Reports

If you find a bug, please open an issue with detailed information about the problem.

## 📧 Contact

For questions or support, please contact: [your-email@example.com]

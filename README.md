# ME-IN Platform
## MiddleEast Influencer Network

ME-IN is a comprehensive platform that connects Korean brands with Middle Eastern influencers through AI-powered matching and analytics.

## 🌟 Features

### Core Functionality
- **AI-Powered Matching**: Smart algorithm matches brands with influencers based on content similarity, audience overlap, and performance history
- **Multi-language Support**: Full support for Korean, English, and Arabic
- **Real-time Analytics**: Track campaign performance with detailed metrics and insights
- **Secure Authentication**: Role-based access control for brands and influencers

### For Brands
- **Campaign Management**: Create, manage, and track influencer campaigns
- **Influencer Discovery**: Find the perfect content creators for your brand
- **Performance Dashboard**: Monitor ROI, reach, and engagement metrics
- **Budget Management**: Set and track campaign budgets efficiently

### For Influencers
- **Opportunity Discovery**: Find brand partnerships that match your content style
- **Earnings Tracking**: Monitor your income and performance metrics
- **Portfolio Management**: Showcase your best content and achievements
- **Campaign Collaboration**: Seamless workflow with brands

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Custom JWT-based system
- **Internationalization**: Custom i18n implementation
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/josephstore/ME-IN.git
cd ME-IN
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
ME-IN/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layout/            # Layout components
│   ├── sections/          # Page sections
│   └── ui/                # UI components
├── lib/                   # Utility libraries
│   ├── types/             # TypeScript type definitions
│   ├── AuthContext.tsx    # Authentication context
│   ├── LanguageContext.tsx # Internationalization context
│   ├── i18n.ts            # Translation definitions
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🌐 Internationalization

ME-IN supports three languages:
- **Korean (ko)**: 한국어
- **English (en)**: English  
- **Arabic (ar)**: العربية

The platform automatically detects the user's preferred language and provides seamless language switching.

## 🔐 Authentication System

The platform features a comprehensive authentication system with:
- User registration and login
- Role-based access (Brand/Influencer)
- JWT-based session management
- Secure password handling

## 📊 Dashboard Features

### Brand Dashboard
- Campaign overview and management
- Influencer discovery and matching
- Performance analytics
- ROI tracking

### Influencer Dashboard
- Earnings and performance metrics
- Campaign opportunities
- Content portfolio management
- Brand collaboration tools

## 🎨 Design System

ME-IN uses a modern, responsive design system built with:
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Custom color palette optimized for Middle Eastern markets

## 🔄 Development Status

### Completed Features ✅
- [x] Basic platform setup and configuration
- [x] Multi-language support system
- [x] User authentication system
- [x] Brand and Influencer dashboards
- [x] Login/Registration pages
- [x] Responsive design implementation

### In Progress 🔄
- [ ] Profile management system
- [ ] Advanced search and filtering
- [ ] Campaign creation and management
- [ ] AI matching algorithm implementation

### Planned Features 📋
- [ ] Real-time notifications
- [ ] Payment system integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development

## 🤝 Contributing

We welcome contributions to the ME-IN platform! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact:
- Email: developer@me-in.com
- GitHub: [josephstore/ME-IN](https://github.com/josephstore/ME-IN)

---

Built with ❤️ for connecting Korean brands with Middle Eastern influencers

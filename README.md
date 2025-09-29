# ChenPilot Client

A modern, responsive web client for **ChenPilot** - a Starknet-based crypto wallet management system with AI agent capabilities. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **AI-Powered Agent Interface**: Natural language interface for complex DeFi operations
- **Cross-Chain Operations**: Seamless Bitcoin to Starknet asset swaps
- **Wallet Management**: Secure Starknet wallet operations and balance tracking
- **Contact Management**: Add, edit, and organize your contacts
- **Real-time Chat**: Interactive AI agent with message history

### Technical Features
- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **State Management**: Redux Toolkit for predictable state management
- **Form Validation**: Zod schema validation with React Hook Form
- **API Integration**: Axios-based service layer with error handling
- **Authentication**: JWT-based auth with protected routes

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Package Manager**: pnpm

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Main dashboard
│   ├── chat/              # AI agent chat interface
│   ├── contacts/          # Contact management
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── providers/        # Context providers
├── services/             # API service layer
├── store/                # Redux store and slices
│   └── slices/           # Redux slices
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── constants/            # Application constants
└── config/               # Configuration files
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chenpilot-client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:2333
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_APP_NAME=ChenPilot
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests (when implemented)

## UI Components

### Core Components
- **Button**: Primary, secondary, ghost, and danger variants
- **Input**: Form inputs with validation and error states
- **Card**: Content containers with optional headers and actions
- **Modal**: Overlay modals with backdrop and escape key handling

### Layout Components
- **Header**: Navigation header with theme toggle
- **Sidebar**: Collapsible navigation sidebar
- **Footer**: Application footer with links

## Authentication

The application implements a complete authentication system:

### Features
- User registration and login
- JWT token management
- Protected routes
- Password validation
- Google OAuth integration (ready for implementation)

### Protected Routes
- `/dashboard` - Main user dashboard
- `/chat` - AI agent interface
- `/contacts` - Contact management
- `/settings` - User settings

## AI Agent Integration

### Supported Operations
- **Meta Operations**: "What is your name?", "What can you do?"
- **Wallet Operations**: Balance queries, address display
- **Contact Management**: Create, list, and manage contacts
- **Trading Operations**: Token swaps and DeFi operations
- **QA Functionality**: Help and guidance

### Chat Interface
- Real-time messaging with typing indicators
- Message history persistence
- Copy-to-clipboard functionality
- Transaction status tracking

## Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Theme Support

- Light and dark theme support
- System preference detection
- Persistent theme selection
- Smooth theme transitions

## API Integration

### Endpoints
- **Authentication**: `/auth/*` - Login, register, profile management
- **Account**: `/auth/starknet/*` - Wallet operations and status
- **Contacts**: `/contacts` - Contact CRUD operations
- **Agent**: `/query` - AI agent interactions

### Error Handling
- Comprehensive error handling with user-friendly messages
- Automatic token refresh
- Network error recovery
- Loading states and feedback

## Testing

Testing framework setup (to be implemented):
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright
- API integration tests

## Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Vercel
```bash
pnpm vercel
```

### Environment Variables for Production
Ensure all required environment variables are set in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## Roadmap

### Upcoming Features
- [ ] Advanced DeFi operations
- [ ] Multi-wallet support
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Social features
- [ ] Plugin system

### Technical Improvements
- [ ] Performance optimization
- [ ] Advanced caching
- [ ] Offline support
- [ ] PWA capabilities
- [ ] Advanced security features

---

Built with love by the ChenPilot Team
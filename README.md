# ChenPilot Client

A modern, responsive web client for **ChenPilot** - a crypto wallet management system with AI agent capabilities. Built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- ChenPilot Experimental Backend (see [AGENT_INTEGRATION.md](./AGENT_INTEGRATION.md))

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

4. **Start the experimental backend** (required for full functionality)
   ```bash
   cd ../chenpilot-experimental
   npm install
   npm run dev
   ```

5. **Start the development server**
   ```bash
   cd ../chenpilot-client
   pnpm dev
   ```

6. **Test the integration**
   ```bash
   node test-integration.js
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests (when implemented)

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

---

Built with love by the ChenPilot Team

# Modern Ticketing System

A full-stack ticketing system built with React.js, Node.js, and PostgreSQL, featuring Azure AD authentication and OAuth 2.0 email integration.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: Microsoft Azure AD
- **Email Handling**: Nodemailer with OAuth 2.0

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express.js API
- `/docs` - Project documentation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- Azure AD account for SSO
- SMTP server access with OAuth 2.0 credentials

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ticket2
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Configure environment variables:
   - Create `.env` file in the server directory
   - Create `.env` file in the client directory
   (See documentation for required variables)

4. Start development servers:
   ```bash
   npm run dev
   ```

## Documentation

Detailed documentation for API endpoints, database schema, and configuration guides can be found in the `/docs` directory.

## Deployment

See [Production Deployment Guide](docs/PRODUCTION.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
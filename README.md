# Modern Ticketing System

A comprehensive ticketing system with Microsoft SSO integration, modern email handling, and a sleek user interface.

## Features

- Microsoft Single Sign-On (SSO) using OAuth 2.0 and OpenID Connect
- Role-based access control (RBAC) for Admins, Support Agents, and Users
- Modern SMTP email integration with OAuth 2.0 authentication
- Automatic ticket creation from incoming emails
- Web interface for ticket management
- Comprehensive admin panel with customization options
- Real-time dashboard with ticket analytics
- Dark mode support
- Webhook integrations (Slack, Microsoft Teams)
- RESTful API for third-party integrations

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: Microsoft Azure AD
- **Email Handling**: Nodemailer with OAuth 2.0

## Getting Started

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Configure environment variables (create .env files in both client and server directories)

3. Start development servers:
   ```bash
   npm run dev
   ```

## Microsoft Azure AD Configuration

1. Register your application in Azure AD
2. Configure OAuth 2.0 and OpenID Connect settings
3. Add redirect URIs for authentication flow
4. Note down Client ID and Client Secret

## Email Configuration (OAuth 2.0)

1. Register your application for Microsoft Graph API
2. Configure SMTP settings with OAuth 2.0
3. Set up email polling service

## Documentation

Detailed documentation for API endpoints, database schema, and configuration guides can be found in the `/docs` directory.

## License

MIT License#   r e n t i c k e t s  
 #   r e n t i c k e t s  
 
# Digital Signage Backend

A robust, scalable digital signage backend built with NestJS, TypeScript, and PostgreSQL. This backend provides comprehensive content management, real-time updates, and secure device management for digital signage systems.

## 🚀 Features

### Core Functionality
- **Content Management**: Upload, organize, and manage media content (images, videos, documents)
- **Playlist Management**: Create and manage dynamic playlists with scheduling capabilities
- **Screen Management**: Monitor and control digital signage displays in real-time
- **Scheduling System**: Advanced scheduling with time-based content delivery
- **Real-time Updates**: WebSocket integration for instant content updates to displays
- **User Management**: Role-based access control with audit logging

### Technical Features
- **Type-safe Development**: Full TypeScript implementation
- **Database Management**: PostgreSQL with Prisma ORM for type-safe database operations
- **Cloud Storage**: Cloudflare R2 integration for scalable media storage
- **Authentication**: Clerk integration with custom JWT implementation
- **Real-time Communication**: Socket.IO for WebSocket connections
- **API Documentation**: RESTful APIs with comprehensive error handling
- **Containerized Deployment**: Docker and Docker Compose support

## 🛠 Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk + Custom JWT
- **Storage**: Cloudflare R2 (S3-compatible)
- **Real-time**: Socket.IO
- **Containerization**: Docker
- **Package Manager**: npm

## 📋 Prerequisites

Before running the application, ensure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- Docker (optional, for containerized deployment)
- Cloudflare R2 account for storage
- Clerk account for authentication

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Nithish-kumar-18-JS/digital-signage-backend.git
cd digital-signage-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/digital_signage"

# Authentication
CLERK_SECRET_KEY="your_clerk_secret_key"
CLERK_ISSUER="your_clerk_issuer_url"

# Storage
CLOUDFLARE_R2_ACCOUNT_ID="your_r2_account_id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_r2_access_key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_r2_secret_key"
CLOUDFLARE_R2_BUCKET_NAME="your_bucket_name"

# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Optional: Seed database with sample data
npx prisma db seed
```

### 5. Development Server
```bash
# Start in development mode
npm run start:dev

# Or start in production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

### Manual Docker Build
```bash
# Build the Docker image
docker build -t digital-signage-backend .

# Run the container
docker run -p 3000:3000 --env-file .env digital-signage-backend
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Media Management
- `GET /api/media` - Get all media files
- `POST /api/media` - Upload media file
- `PUT /api/media/:id` - Update media file
- `DELETE /api/media/:id` - Delete media file

### Playlist Management
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Screen Management
- `GET /api/screens` - Get all screens
- `POST /api/screens` - Register new screen
- `PUT /api/screens/:id` - Update screen
- `DELETE /api/screens/:id` - Remove screen

### Scheduling
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics data

## 🔧 Development

### Project Structure
```
src/
├── auth/                 # Authentication module
├── common/              # Shared utilities and filters
│   ├── filters/         # Exception filters
│   └── logger/          # Logging utilities
├── dashboard/           # Dashboard analytics
├── lib/                 # Helper libraries
├── media/               # Media management
├── playlists/           # Playlist operations
├── schedule/            # Scheduling system
├── screens/             # Screen management
├── types/               # TypeScript type definitions
├── upload/              # File upload handling
├── user/                # User management
├── webplayer/           # WebSocket gateway
├── app.module.ts        # Main application module
├── main.ts              # Application bootstrap
└── prisma.service.ts    # Prisma database service
```

### Available Scripts
```bash
# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start with debugging

# Production
npm run build           # Build the application
npm run start:prod      # Start production server

# Database
npx prisma studio       # Open Prisma Studio
npx prisma migrate dev  # Create and apply migration
npx prisma db push      # Push schema changes

# Testing
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage
```

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Request rate limiting
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Audit logging for sensitive operations
- Secure file upload handling

## 📊 Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User**: User management with authentication
- **Media**: Media file metadata and storage references
- **Playlist**: Content playlists with ordering
- **Screen**: Digital signage device registration
- **Schedule**: Time-based content scheduling
- **AuditLog**: System audit trail

## 🔄 Real-time Features

WebSocket connections handle:
- Live content updates to displays
- Screen status monitoring
- Real-time playlist changes
- System notifications
- Device heartbeat tracking

## 🚀 Deployment

### Production Environment Variables
```bash
NODE_ENV=production
DATABASE_URL="your_production_database_url"
CLERK_SECRET_KEY="your_production_clerk_key"
CLOUDFLARE_R2_ACCOUNT_ID="your_production_r2_account"
# ... other production credentials
```

### Recommended Production Setup
- Use environment-specific configuration
- Enable HTTPS with SSL certificates
- Implement proper backup strategies
- Set up monitoring and alerting
- Use process managers like PM2
- Configure reverse proxy (Nginx)

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check database connection
npx prisma db pull

# Reset database (development only)
npx prisma migrate reset
```

**WebSocket Connection Problems**
- Verify CORS configuration in `main.ts`
- Check firewall and proxy settings
- Ensure WebSocket protocols are supported

**File Upload Issues**
- Verify R2 credentials and bucket permissions
- Check file size limits
- Ensure proper MIME type handling

## 📝 API Documentation

After starting the server, access the API documentation:
- Swagger UI: `http://localhost:3000/api/docs` (if configured)
- Postman Collection: Import the `postman.json` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Digital Signage Frontend](https://github.com/Nithish-kumar-18-JS/digital-signage-frontend-v1) - React frontend application
- [Digital Signage Player](https://github.com/Nithish-kumar-18-JS/digital) - Display player application

## 📞 Support

For support, email nithishkumar@example.com or create an issue in this repository.

---

Built with ❤️ using NestJS and TypeScript
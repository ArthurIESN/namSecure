# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

namSecure is a security reporting platform backend built with Node.js, Express, TypeScript, and PostgreSQL. The application uses Prisma as an ORM and implements JWT-based authentication with email validation, 2FA support, and ID verification workflows.

## Common Commands

### Development
```bash
npm run build           # Compile TypeScript to JavaScript
npm start               # Build and start the server with nodemon
npm run dev             # Start server from pre-built dist/ (requires prior build)
npm run watch           # Watch mode for TypeScript compilation
npm run clean           # Remove dist/ directory
npm run createDB        # Initialize database from DBScript/CreateDB.sql
```

### Database
```bash
npx prisma generate     # Generate Prisma Client from schema
npx prisma migrate dev  # Create and apply migration
npx prisma studio       # Open Prisma Studio database GUI
npx prisma db push      # Push schema changes without migration
```

## Architecture

### Project Structure

This codebase follows a **layered MVC-like architecture** with clear separation between routes, controllers, models, and middleware:

```
routes/           → Define API endpoints and route handlers (thin layer)
  └─ {resource}/  → Each resource has its own router (member, auth, team, etc.)
controllers/      → Handle HTTP requests/responses and orchestrate business logic
  └─ {resource}/  → Controllers for each resource domain
models/           → Database operations and business logic using Prisma
  └─ {resource}/  → Data access layer for each resource
middlewares/      → Request processing (auth, validation, upload)
  ├─ auth/        → Authentication and authorization middleware
  └─ validation/  → VineJS schema validation middleware
```

### Key Architectural Patterns

**1. Modular Resource Organization**
Each resource (member, team, auth, etc.) has its own directory in routes/, controllers/, models/, and middlewares/validation/. This keeps related code together.

**2. Middleware-First Approach**
Routes are heavily middleware-driven:
- **Validation middleware**: Uses VineJS (@vinejs/vine) for request validation. Validated data is attached to `req.validated`
- **Authentication middleware**: JWT-based auth attaches user data to `req.user` and `req.member`
- **Upload middleware**: Multer configuration in middlewares/upload/

**3. Custom Express Request Types**
The Express Request object is extended (see types/express/express.ts) to include:
- `req.user`: Decoded JWT payload
- `req.member`: Database member object with role and validation states
- `req.validated`: Validated request data from VineJS

**4. Database Layer**
- **Prisma Client**: Single instance exported from database/databasePrisma.ts
- **Shared Types**: Uses a monorepo package `@namSecure/shared` (from ../shared) for shared type definitions
- **Schema Location**: prisma/schema.prisma (configured via prisma.config.ts)

**5. Authentication Flow**
Multi-stage authentication system:
- Initial registration creates member with unverified email
- Email validation using validation_code table with expiring hashed codes
- Optional 2FA via member_2fa table
- Optional ID verification via member_id_check table
- JWT tokens refresh automatically when expiring within 5 days (see middlewares/auth/isAuthenticated.ts)
- Password changes invalidate all existing tokens by comparing password_last_update with JWT iat

**6. Security Features**
- Passwords hashed with Argon2 (utils/hash/)
- Pepper from environment variable PEPPER
- JWT secret from JWT_SECRET env var
- Automatic token refresh in authentication middleware
- Member roles for authorization (member_role table)

### Module Interconnections

**Route → Controller → Model Flow:**
1. Router defines endpoint (e.g., routes/member/member.ts)
2. Applies validation middleware (middlewares/validation/validation.ts)
3. Applies auth middleware if needed (middlewares/auth/isAuthenticated.ts)
4. Controller receives validated request (controllers/member/member.ts)
5. Model performs database operations (models/member/member.ts)
6. Controller sends response

**Validation Pattern:**
Validation schemas are defined in middlewares/validation/{resource}.ts using VineJS, then wrapped in middleware functions in middlewares/validation/validation.ts. The middleware attaches validated data to req.validated.

## Database Schema Notes

Key relationships:
- **member** is central: has role, 2FA config, ID check status, and validation code
- **team** has an admin (member) and can be associated with a report
- **team_member** links members to teams with acceptance status
- **report** belongs to a member and type_danger, can be assigned to a team
- **validation_code** tracks email verification codes with expiration and attempt limits

## Environment Configuration

Copy example.env to .env and configure:
- Database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)
- DATABASE_URL for Prisma (PostgreSQL connection string)
- SMTP settings for email validation
- SERVER_PORT (default 3000)
- PEPPER for password hashing
- JWT_SECRET for token signing
- FILE_UPLOAD_SIZE_LIMIT (default 10MB)

## Important Implementation Details

- **ES Modules**: Project uses `"type": "module"` in package.json. All imports must use .js extensions even for .ts files
- **Prisma Generated Types**: Prisma client is generated to node_modules/@prisma/client
- **TypeScript Strict Mode**: Enabled with additional strict flags (noImplicitReturns, noUnusedLocals, etc.)
- **Enhanced Logging**: Custom logging utility in utils/logs/enhancedLogs.js (imported in server.ts)
- **CORS Configuration**: Currently hardcoded to localhost:3000 and localhost:5173 - marked as TODO for production
- **File Uploads**: Handled via Multer, stored in uploads/ directory, with Sharp for image processing

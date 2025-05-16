# Al-Ameri Baloot Tournament Platform

A comprehensive platform for managing Baloot card game tournaments in the Gulf region. This application streamlines the entire tournament process from team registration to match scheduling and results tracking, with special focus on providing a seamless experience for both organizers and players.

## Core Features

- **Tournament Management**:

  - Create tournaments with customizable team counts (supports 2-32 teams for small tournaments)
  - Support for large tournaments with automatic division into groups (any multiple of 32 teams)
  - Configurable table counts for venue management
  - Location tracking and registration deadline settings

- **Advanced Match Scheduling**:

  - Automatic generation of tournament brackets based on team count
  - Intelligent scheduling that respects common tournament days (Thursday/Friday/Saturday)
  - Support for multiple time slots throughout tournament days (18:00, 19:30, 21:00, 22:30, etc.)
  - Table assignment to maximize venue utilization

- **Team Registration System**:

  - Public registration forms with validation for player details
  - Automatic detection of duplicate registrations (by civil ID)
  - Backup team handling when tournaments reach capacity
  - Registration confirmation and match tracking for players

- **Tournament Progression**:

  - Group-based preliminary rounds with automatic advancement
  - Finals bracket creation for multi-group tournaments
  - Real-time results tracking and bracket updates
  - Comprehensive UI for both players and organizers

- **User Interface**:
  - Full Arabic language support with RTL text direction
  - Responsive design that works on mobile devices and desktops
  - Dark/Light mode for user comfort
  - Animated success confirmations for improved user experience

## Technical Details

### Technology Stack

- **Framework**: Next.js 15 with App Router architecture
- **Language**: TypeScript with strict type checking
- **Database**: PostgreSQL with Prisma ORM for type-safe queries
- **Frontend**:
  - TailwindCSS for styling
  - Shadcn/ui for consistent, accessible components
  - React Hook Form for form handling
  - Zod for robust schema validation
- **Authentication**: NextAuth.js with secure credential storage
- **Deployment**: Optimized for Vercel deployment

### Database Schema

The application uses the following core data models:

- **Tournament**:

  - Core tournament details (name, dates, location)
  - Team capacity configuration
  - Table count for physical space planning
  - Registration tracking and deadlines

- **Team**:

  - Two-player teams with personal details
  - Civil ID validation to prevent duplicate registrations
  - Phone numbers for communication
  - Backup status indicator
  - Group assignment tracking

- **Match**:

  - Complete match tracking system
  - Round and match number organization
  - Team pairing and winner recording
  - Scheduling information (date, time, table)
  - Group code for tournament phase tracking

- **User**:
  - Administrator accounts for tournament management
  - Secure password storage
  - Session management

## Application Workflow

### Tournament Creation and Management

1. Administrators create a new tournament with:

   - Name, location, start date, and registration deadline
   - Total team count (any power of 2 from 2-32, or multiples of 32)
   - Table count for venue management

2. The system automatically:
   - Generates appropriate bracket structures
   - Creates multi-day schedules if needed
   - Plans matches for optimal venue usage
   - Prepares finals brackets for large tournaments

### Team Registration Process

1. Players access the tournament registration link
2. They complete the registration form with:

   - Names of both team members
   - Civil IDs for verification
   - Contact phone numbers

3. Upon successful registration:
   - Teams receive confirmation with their team number
   - The system assigns them to appropriate matches
   - Teams joining after capacity receive backup status

### Match Management

1. Matches are automatically scheduled with:

   - Date and specific time slots
   - Table assignments
   - Round and bracket positioning

2. As matches progress:

   - Results are recorded
   - Winners advance to next rounds
   - Bracket displays update in real-time

3. For large tournaments:
   - Group winners advance to finals
   - Finals are scheduled on optimal days (typically Saturdays)

## Getting Started

### Prerequisites

- Node.js (version 18.0.0 or later)
- PostgreSQL database
- Required environment variables (see below)

### Environment Setup

Create a `.env.local` file in the root directory with:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation

```bash
# Install dependencies
npm install

# Set up the database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

This application is optimized for deployment on Vercel:

```bash
npm run build
```

The build process includes:

- Prisma schema generation
- Database schema push
- Next.js optimization

## Project Structure

```
dawrat-al3ameri/
├── src/
│   ├── actions/        # Server actions for data operations
│   │   ├── tournament.ts  # Tournament management
│   │   ├── teams.ts       # Team registration and management
│   │   ├── matches.ts     # Match scheduling and results
│   │   └── auth.ts        # Authentication
│   ├── app/            # Next.js App Router components
│   │   ├── (protected)/   # Admin routes requiring authentication
│   │   ├── (public)/      # Public routes for registration
│   │   └── (auth)/        # Authentication routes
│   ├── components/     # Reusable UI components
│   ├── hooks/          # React custom hooks
│   ├── lib/            # Core business logic
│   │   ├── auth/          # Authentication configuration
│   │   ├── db/            # Database models and schema
│   │   ├── scheemas/      # Zod validation schemas
│   │   └── *              # Tournament scheduling utilities
│   └── styles/         # CSS styles
├── public/             # Static files
├── prisma/             # Prisma configuration
└── next.config.ts      # Next.js configuration
```

## License

This project is licensed under the [MIT License](LICENSE).

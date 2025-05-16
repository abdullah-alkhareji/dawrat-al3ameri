# Al-Ameri Baloot Tournament Guide

## Overview

The "Al-Ameri Tournaments" platform is an integrated system for managing Baloot tournaments (a popular card game in Gulf Arab countries) developed to simplify and automate all aspects of organizing and managing tournaments. The platform is designed to meet the needs of tournament organizers and players, providing a smooth and efficient experience for everyone.

## Target Audience

- **Tournament Organizers**: Officials responsible for organizing Baloot tournaments in Kuwait and the Gulf region
- **Players**: Those wishing to participate in tournaments
- **Spectators**: Those interested in following tournament results and proceedings

## Key Features

### 1. Tournament Management

- **Tournament Creation**: Ability to create new tournaments with all details:

  - Tournament name
  - Start date
  - Location
  - Number of teams allowed
  - Number of available tables
  - Registration deadline

- **Tournament Display**: User-friendly interface showing a list of current and upcoming tournaments
- **Tournament Details**: Dedicated page for each tournament displaying all related information

### 2. Team Management

- **Team Registration**: Easy-to-use form for players to register in tournaments:

  - Registration of a team consisting of two players
  - Entering personal data (name, civil ID, phone number)
  - Receiving registration confirmation

- **Registered Teams Display**: For organizers, a list of all teams registered in the tournament
- **Group System**: Ability to divide teams into groups (groupCode)

### 3. Match Management

- **Match Scheduling**: Automatic creation of a match schedule based on the number of participating teams
- **Results Tracking**: Recording match results and updating subsequent rounds
- **Match Schedule Display**: Clear presentation of match schedule and results
- **Game Table Assignment**: Allocating tables for matches to organize tournament flow

### 4. Security and Authentication

- **Login System**: Secure authentication for users responsible for tournament management
- **Personal Data Protection**: Encryption and protection of player data
- **Multiple Permissions**: Separation between what regular users and administrators can see

## Technologies Used

- **Framework**: Next.js with App Router
- **Programming Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **User Interface**:
  - Tailwind CSS for design
  - Shadcn/ui for UI components
  - React Hook Form for forms
  - Zod for data validation
- **Authentication**: NextAuth.js for authentication and session management

## Application Workflow

### 1. Organizer Workflow

1. Log in to the system
2. Create a new tournament and set its criteria
3. Obtain registration link and share it with potential participants
4. Monitor team registrations
5. Manage matches and update results
6. Follow tournament progress until determining the winner

### 2. Player Workflow

1. Access the tournament registration link
2. Fill out the registration form with team information (two players)
3. Receive registration confirmation
4. Follow match schedule and results

## Database Structure

### Tournament

- `id`: Unique tournament identifier
- `name`: Tournament name
- `teamCount`: Total number of teams
- `tableCount`: Number of available tables
- `location`: Tournament location (optional)
- `startDate`: Tournament start date
- `lastRegDate`: Registration deadline

### Team

- `id`: Unique team identifier
- `teamNumber`: Team number
- `tournamentId`: Associated tournament ID
- `name1`: First player's name
- `name2`: Second player's name
- `civilId1`: First player's civil ID
- `civilId2`: Second player's civil ID
- `phone1`: First player's phone number
- `phone2`: Second player's phone number
- `backup`: Indicator determining if the team is a backup
- `groupCode`: Group code (optional)

### Match

- `id`: Unique match identifier
- `tournamentId`: Associated tournament ID
- `round`: Round number
- `matchNumber`: Match number within the round
- `team1Id`: First team ID
- `team2Id`: Second team ID
- `winnerId`: Winner team ID
- `startTime`: Match start time
- `tableNumber`: Table number
- `groupCode`: Group code (e.g., "Day1-A", "Day2-B", "Finals")
- `matchDate`: Match date

### User

- `id`: Unique user identifier
- `name`: User name
- `email`: Email
- `password`: Password (encrypted)

## Additional Features

- **Responsive Design**: Works on all screen sizes from mobile devices to desktops
- **Arabic Language Support**: Complete Arabic interface with RTL support
- **Easy Sharing**: Ability to share registration links via social media
- **Instant Notifications**: Notifications for users about important updates
- **Dark/Light Mode**: The application supports both modes for user comfort

## Benefits and Value

- **Simplifying Tournament Organization**: Automation of tedious manual tasks that used to take a long time
- **Improving Player Experience**: Facilitating the registration process and match tracking
- **Enhancing Transparency**: Clear and understandable display of match schedules and results
- **Reducing Errors**: Automatic data validation and organized match management
- **Saving Time and Effort**: For both organizers and players

## Future Development

- **Advanced Points System**: Tracking player performance across multiple tournaments
- **Payment Integration**: Adding electronic payment methods for tournament registration
- **Advanced Statistics**: More in-depth insights and analytics about team performance
- **Live Streaming**: Ability to connect the platform with live streaming services for matches
- **Mobile Applications**: Releasing dedicated applications for mobile platforms (iOS/Android)

## Conclusion

The "Al-Ameri Tournaments" platform represents a comprehensive and integrated solution for managing Baloot tournaments, providing an easy-to-use and effective platform for both tournament organizers and players. By automating various aspects of tournament organization, the application helps improve efficiency and enhance user experience, allowing everyone to focus on enjoying the game itself rather than administrative procedures.

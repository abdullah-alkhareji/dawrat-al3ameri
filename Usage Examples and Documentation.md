# **Usage Examples and Documentation**

## **Table of Contents**

1. [Creating a Tournament](https://claude.ai/chat/438c3b7a-5c93-4bde-80d7-6ba31966eab3#creating-a-tournament)
2. [Team Registration](https://claude.ai/chat/438c3b7a-5c93-4bde-80d7-6ba31966eab3#team-registration)
3. [Match Management](https://claude.ai/chat/438c3b7a-5c93-4bde-80d7-6ba31966eab3#match-management)
4. [API Usage Examples](https://claude.ai/chat/438c3b7a-5c93-4bde-80d7-6ba31966eab3#api-usage-examples)
5. [Component Usage](https://claude.ai/chat/438c3b7a-5c93-4bde-80d7-6ba31966eab3#component-usage)
6. [Common Workflows](https://claude.ai/chat/438c3b7a-5c93-4bde-80d7-6ba31966eab3#common-workflows)
7. [Troubleshooting](https://claude.ai/chat/438c3b7a-5c93-4bde-80d7-6ba31966eab3#troubleshooting)

## **Creating a Tournament**

### **Admin Flow**

```tsx

typescript
// 1. Navigate to /add-tournament// 2. Fill the form with tournament details

const tournamentData = {
  name: "بطولة الصيف 2025",
  teamCount: 64,
  startDate: new Date("2025-06-01"),
  endDate: new Date("2025-06-10"),
  lastRegDate: new Date("2025-05-25"),
  location: "https://maps.google.com/..."
};

// 3. Form validation occurs automatically// 4. Tournament is created with auto-generated brackets// 5. Registration link is generated

```

### **Tournament Structure**

- **32 teams per group**: Each group runs as an independent tournament
- **Multiple groups**: For tournaments with 64+ teams
- **Auto-scheduling**: Matches are automatically scheduled on Thursdays and Fridays
- **Finals on Saturday**: Championship matches scheduled for weekends

## **Team Registration**

### **Public Registration Flow**

```tsx

typescript
// 1. Teams access registration via /apply?id=TOURNAMENT_ID// 2. Fill team registration form

const teamData = {
  name1: "أحمد علي محمد",
  civilId1: "123456789012",
  phone1: "12345678",
  name2: "محمد أحمد علي",
  civilId2: "098765432109",
  phone2: "87654321"
};

// 3. Automatic validation and duplicate checking// 4. Team assigned to group automatically// 5. Confirmation page with team number

```

### **Validation Rules**

- **Civil ID**: Exactly 12 digits, unique per tournament
- **Phone**: Exactly 8 digits
- **Names**: Required for both players
- **Duplicate Prevention**: Same civil ID cannot be used twice

## **Match Management**

### **Marking Winners**

```tsx

typescript
// Admin can mark match winners
const markWinner = async (matchId: string, teamId: string) => {
  await prisma.match.update({
    where: { id: matchId },
    data: { winnerId: teamId }
  });

// Automatically propagates winner to next round
  await propagateWinner(matchId);
};

```

### **Match Display**

```tsx

typescript
// Matches are grouped by day and round
const groupedMatches = {
  "الجمعة 01/06/2025": {
    "Day1-A": {
      5: [/* Round 5 matches */],
      4: [/* Round 4 matches */],
// ...
    }
  }
};

```

## **API Usage Examples**

### **Server Actions Usage**

### **Create Tournament**

```tsx

typescript
import { createTournament } from "@/actions/tournament";

const result = await createTournament({
  name: "البطولة الجديدة",
  teamCount: 32,
  startDate: new Date(),
  endDate: new Date(),
  lastRegDate: new Date(),
  location: "الكويت"
});

if (result.success) {
// Tournament created successfully
  const tournament = result.data;
} else {
// Handle error
  console.error(result.error);
}

```

### **Team Registration**

```tsx

typescript
import { createTeam } from "@/actions/teams";

const result = await createTeam(teamData, tournamentId);

if (result.success) {
// Team registered successfully
  const team = result.data;
  const groupCode = result.groupCode;// Which group they're in
}

```

### **Database Queries**

```tsx

typescript
// Get tournament with teams
const tournament = await prisma.tournament.findUnique({
  where: { id: tournamentId },
  include: {
    teams: true,
    matches: {
      include: {
        team1: true,
        team2: true,
        winner: true
      }
    }
  }
});

// Get matches for a specific day
const dayMatches = await prisma.match.findMany({
  where: {
    tournamentId,
    matchDate: {
      gte: startOfDay,
      lte: endOfDay
    }
  },
  include: {
    team1: true,
    team2: true
  },
  orderBy: [
    { round: 'desc' },
    { matchNumber: 'asc' }
  ]
});

```

## **Component Usage**

### **Form Components**

```tsx

typescript
// Application Form
<ApplicationForm
  teamsCount={existingTeamsCount}
  tournamentId={tournamentId}
/>

// Add Tournament Form
<AddTournamentForm />

// Edit Team Form
<EditTeamForm teamId={teamId} />

```

### **Data Display Components**

```tsx

typescript
// Tournament List
<TournamentList />

// Matches List with grouping
<MatchesList matches={matches} />

// Teams Data Table
<DataTable
  columns={teamsColumns}
  data={teams}
  filterKey="teamNumber"
  placeholder="رقم الفريق"
/>

```

### **UI Components**

```tsx

typescript
// Date Picker with Arabic locale
<DatePicker
  date={selectedDate}
  onDateChange={setSelectedDate}
  locale={ar}
  disabled={(date) => date < new Date()}
/>

// Select Button for team count
<SelectButtonRoot value={teamCount} onValueChange={setTeamCount}>
  <SelectButtonItem value={32}>32</SelectButtonItem>
  <SelectButtonItem value={64}>64</SelectButtonItem>
</SelectButtonRoot>

```

## **Common Workflows**

### **1. Complete Tournament Setup**

```tsx

typescript
// Step 1: Create tournament
const tournament = await createTournament(tournamentData);

// Step 2: Share registration link
const registrationLink = `${baseUrl}/apply?id=${tournament.id}`;

// Step 3: Teams register automatically// Step 4: Brackets and matches are auto-generated// Step 5: Admin manages matches via dashboard

```

### **2. Team Registration Process**

```tsx

typescript
// Step 1: Access registration link// Step 2: Fill registration form// Step 3: System validates and assigns to group// Step 4: Team receives confirmation with team number// Step 5: Team can check details via review link

```

### **3. Match Day Operations**

```tsx

typescript
// Step 1: View matches by day/group// Step 2: Mark winners as matches complete// Step 3: System automatically advances winners// Step 4: Continue until tournament completion

```

## **Troubleshooting**

### **Common Issues**

### **Registration Problems**

```tsx

typescript
// Duplicate player error
"اللاعب مسجل مع فريق ثاني"
// Solution: Check if civil ID already used// Tournament full
"البطولة مكتملة"
// Solution: Team is added as backup

```

### **Match Scheduling Issues**

```tsx

typescript
// Invalid tournament day// Solution: Matches only scheduled on Thu/Fri/Sat// Table conflicts// Solution: System automatically assigns available tables

```

### **Data Validation Errors**

```tsx

typescript
// Civil ID validation
/^\d{12}$/// Must be exactly 12 digits// Phone validation
/^\d{8}$/// Must be exactly 8 digits// Date validation
lastRegDate < startDate < endDate// Logical date order

```

### **Debugging Tips**

### **Check Database State**

```tsx

typescript
// Verify tournament creation
const tournament = await prisma.tournament.findUnique({
  where: { id },
  include: { _count: { select: { teams: true, matches: true } } }
});

// Check team assignments
const teams = await prisma.team.findMany({
  where: { tournamentId },
  include: {
    matchesAsTeam1: true,
    matchesAsTeam2: true
  }
});

```

### **Match Progression Issues**

```tsx

typescript
// Verify winner propagation
const nextMatch = await prisma.match.findFirst({
  where: {
    round: currentRound - 1,
    OR: [
      { team1Id: winnerId },
      { team2Id: winnerId }
    ]
  }
});

```

### **Performance Considerations**

### **Database Optimization**

```tsx

typescript
// Use includes efficiently
const matches = await prisma.match.findMany({
  where: { tournamentId },
  include: {
    team1: { select: { teamNumber: true } },
    team2: { select: { teamNumber: true } }
  }
});

// Index important fields// - Tournament.id// - Team.tournamentId// - Match.tournamentId// - Team.civilId1, Team.civilId2

```

### **Client-Side Optimization**

```tsx

typescript
// Use React.memo for expensive components
const MatchCard = React.memo(({ match }) => {
// Component implementation
});

// Implement proper loading states
const [isLoading, setIsLoading] = useState(false);

// Cache data with SWR or React Query
const { data: tournament } = useSWR(
  `/api/tournaments/${id}`,
  fetcher
);

```

### **Error Handling Patterns**

### **Server Actions**

```tsx

typescript
export async function createTeam(data, tournamentId) {
  try {
// Validation
    const validatedData = applicationFormSchema.parse(data);

// Business logic
    const team = await prisma.team.create({ data: validatedData });

    return { success: true, data: team };
  } catch (error) {
    console.error('[TEAM_CREATE]', error);
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

```

### **Client Error Handling**

```tsx

typescript
const handleSubmit = async (data) => {
  try {
    setIsLoading(true);
    const result = await createTeam(data, tournamentId);

    if (!result.success) {
      throw new Error(result.error);
    }

    toast.success("تم التسجيل بنجاح");
    router.push(`/review?id=${result.data.id}`);
  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};

```

## **Best Practices**

### **Code Organization**

1. **Server Actions**: Keep in `/actions` directory
2. **Components**: Organize by feature in `/components`
3. **Types**: Define in `/lib/types.ts`
4. **Utilities**: Keep in `/lib` directory

### **Security**

1. **Input Validation**: Always validate on server-side
2. **Authentication**: Protected routes require auth
3. **Authorization**: Check user permissions
4. **Data Sanitization**: Clean user inputs

### **Performance**

1. **Database Queries**: Use selective includes
2. **Component Rendering**: Implement proper memoization
3. **Bundle Size**: Import only needed components
4. **Image Optimization**: Use Next.js Image component

### **Accessibility**

1. **RTL Support**: Proper Arabic text direction
2. **Keyboard Navigation**: Tab order and focus management
3. **Screen Readers**: Semantic HTML and ARIA labels
4. **Color Contrast**: Ensure sufficient contrast ratios
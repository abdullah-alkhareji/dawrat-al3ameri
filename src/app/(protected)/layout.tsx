import Navbar from "@/components/navbar";
import MobileNav from "@/components/mobile-nav";
import AddTournamentButton from "@/components/add-tournament-button";
import { auth } from "@/lib/auth";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar session={session} />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 pt-4 pb-20 lg:pb-4">
        {children}
      </main>
      <MobileNav />
      <AddTournamentButton />
    </div>
  );
};

export default ProtectedLayout;

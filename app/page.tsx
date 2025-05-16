import { Leaderboard } from "@/components/leaderboard"
import { GameScores } from "@/components/game-scores"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e6ebf9] px-2 py-4 sm:p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#182659] sm:mb-8 sm:text-3xl md:text-4xl">
          2025 Season Leaderboard
        </h1>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2 sm:mb-6">
            <TabsTrigger value="leaderboard">Standings</TabsTrigger>
            <TabsTrigger value="schedule">Game Scores</TabsTrigger>
          </TabsList>
          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>
          <TabsContent value="schedule">
            <GameScores />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

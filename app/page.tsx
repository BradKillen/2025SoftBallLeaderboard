import { Leaderboard } from "@/components/leaderboard"
import { GameScores } from "@/components/game-scores"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e6ebf9] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-[#182659] md:text-4xl">2025 Season Leaderboard</h1>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
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

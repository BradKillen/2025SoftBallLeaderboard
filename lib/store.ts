import { create } from "zustand"
import { supabase, type Team, type GameResult } from "./supabase"

type TeamStore = {
  teams: Team[]
  gameResults: GameResult[]
  loading: boolean
  error: string | null
  loadData: () => Promise<void>
  updateGameScore: (
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number,
    week: string,
    gameIndex: number,
  ) => Promise<void>
  sortTeams: () => void
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  gameResults: [],
  loading: false,
  error: null,

  loadData: async () => {
    try {
      set({ loading: true, error: null })

      // Load teams
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .order("wins", { ascending: false })
        .order("differential", { ascending: false })

      if (teamsError) throw new Error(`Error loading teams: ${teamsError.message}`)

      // Load game results
      const { data: resultsData, error: resultsError } = await supabase.from("game_results").select("*")

      if (resultsError) throw new Error(`Error loading game results: ${resultsError.message}`)

      set({
        teams: teamsData || [],
        gameResults: resultsData || [],
        loading: false,
      })
    } catch (error) {
      console.error("Error loading data:", error)
      set({
        error: error instanceof Error ? error.message : "Unknown error loading data",
        loading: false,
      })
    }
  },

  updateGameScore: async (homeTeam, awayTeam, homeScore, awayScore, week, gameIndex) => {
    try {
      set({ loading: true, error: null })

      // Check if this game was already recorded
      const { data: existingGame } = await supabase
        .from("game_results")
        .select("*")
        .eq("week", week)
        .eq("game_index", gameIndex)
        .maybeSingle()

      // Calculate point differential changes
      const homeDiff = homeScore - awayScore
      const awayDiff = awayScore - homeScore

      // Start a transaction using RPC (stored procedure)
      if (existingGame) {
        // Get previous scores to calculate differential adjustment
        const prevHomeDiff = existingGame.home_score - existingGame.away_score
        const prevAwayDiff = existingGame.away_score - existingGame.home_score

        // Update game result
        const { error: updateGameError } = await supabase
          .from("game_results")
          .update({
            home_score: homeScore,
            away_score: awayScore,
          })
          .eq("id", existingGame.id)

        if (updateGameError) throw new Error(`Error updating game: ${updateGameError.message}`)

        // Update home team stats
        const { error: updateHomeError } = await supabase.rpc("update_team_stats", {
          team_name: homeTeam,
          diff_change: homeDiff - prevHomeDiff,
          win_change:
            homeScore > awayScore
              ? existingGame.home_score > existingGame.away_score
                ? 0
                : 1
              : existingGame.home_score > existingGame.away_score
                ? -1
                : 0,
          loss_change:
            homeScore < awayScore
              ? existingGame.home_score < existingGame.away_score
                ? 0
                : 1
              : existingGame.home_score < existingGame.away_score
                ? -1
                : 0,
        })

        if (updateHomeError) throw new Error(`Error updating home team: ${updateHomeError.message}`)

        // Update away team stats
        const { error: updateAwayError } = await supabase.rpc("update_team_stats", {
          team_name: awayTeam,
          diff_change: awayDiff - prevAwayDiff,
          win_change:
            awayScore > homeScore
              ? existingGame.away_score > existingGame.home_score
                ? 0
                : 1
              : existingGame.away_score > existingGame.home_score
                ? -1
                : 0,
          loss_change:
            awayScore < homeScore
              ? existingGame.away_score < existingGame.home_score
                ? 0
                : 1
              : existingGame.away_score < existingGame.home_score
                ? -1
                : 0,
        })

        if (updateAwayError) throw new Error(`Error updating away team: ${updateAwayError.message}`)
      } else {
        // Insert new game result
        const { error: insertGameError } = await supabase.from("game_results").insert({
          home_team: homeTeam,
          away_team: awayTeam,
          home_score: homeScore,
          away_score: awayScore,
          week,
          game_index: gameIndex,
        })

        if (insertGameError) throw new Error(`Error inserting game: ${insertGameError.message}`)

        // Update home team stats
        const { error: updateHomeError } = await supabase.rpc("update_team_stats", {
          team_name: homeTeam,
          diff_change: homeDiff,
          win_change: homeScore > awayScore ? 1 : 0,
          loss_change: homeScore < awayScore ? 1 : 0,
        })

        if (updateHomeError) throw new Error(`Error updating home team: ${updateHomeError.message}`)

        // Update away team stats
        const { error: updateAwayError } = await supabase.rpc("update_team_stats", {
          team_name: awayTeam,
          diff_change: awayDiff,
          win_change: awayScore > homeScore ? 1 : 0,
          loss_change: awayScore < homeScore ? 1 : 0,
        })

        if (updateAwayError) throw new Error(`Error updating away team: ${updateAwayError.message}`)
      }

      // Reload data to get updated state
      await get().loadData()
    } catch (error) {
      console.error("Error updating game score:", error)
      set({
        error: error instanceof Error ? error.message : "Unknown error updating score",
        loading: false,
      })
    }
  },

  sortTeams: () => {
    const { teams } = get()
    const sortedTeams = [...teams].sort((a, b) => {
      // First sort by wins
      if (b.wins !== a.wins) {
        return b.wins - a.wins
      }
      // Then by differential
      return b.differential - a.differential
    })

    set({ teams: sortedTeams })
  },
}))

import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export type Team = {
  id?: number
  name: string
  wins: number
  losses: number
  differential: number
}

export type GameResult = {
  id?: number
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  week: string
  game_index: number
}

"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Unlock, Save, Crown, Loader2 } from "lucide-react"
import { useTeamStore } from "@/lib/store"
import { weeks } from "@/lib/schedule-data"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"

export function GameScores() {
  const { updateGameScore, gameResults, loadData, loading, error } = useTeamStore()
  const [editableRows, setEditableRows] = useState<Record<string, boolean>>({})
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({})
  const [savingRow, setSavingRow] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUnlock = (gameId: string) => {
    // In a real app, you would check the password here
    const password = prompt("Enter password to edit score:")
    if (password === "0814") {
      setEditableRows((prev) => ({ ...prev, [gameId]: true }))
    }
  }

  const handleScoreChange = (gameId: string, team: "home" | "away", value: string) => {
    setScores((prev) => ({
      ...prev,
      [gameId]: {
        ...(prev[gameId] || { home: "", away: "" }),
        [team]: value,
      },
    }))
  }

  const handleSave = async (gameId: string, homeTeam: string, awayTeam: string, week: string, gameIndex: number) => {
    const gameScores = scores[gameId] || { home: "", away: "" }
    const homeScore = Number.parseInt(gameScores.home)
    const awayScore = Number.parseInt(gameScores.away)

    if (isNaN(homeScore) || isNaN(awayScore)) {
      alert("Please enter valid scores for both teams")
      return
    }

    setSavingRow(gameId)
    try {
      await updateGameScore(homeTeam, awayTeam, homeScore, awayScore, week, gameIndex)
      setEditableRows((prev) => ({ ...prev, [gameId]: false }))
    } finally {
      setSavingRow(null)
    }
  }

  // Function to find game result
  const findGameResult = (week: string, gameIndex: number) => {
    return gameResults.find((result) => result.week === week && result.game_index === gameIndex)
  }

  if (error) {
    return (
      <Card className="p-4 sm:p-6 text-center">
        <p className="text-red-500">Error loading data: {error}</p>
        <button onClick={() => loadData()} className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Retry
        </button>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm hidden sm:table-cell">
                Date
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm">
                Home Team
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm w-16 sm:w-auto">
                H
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm w-16 sm:w-auto">
                A
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm">
                Away Team
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // Loading skeleton for weeks
                Array(3)
                  .fill(0)
                  .map((_, weekIndex) => (
                    <>
                      <TableRow key={`week-${weekIndex}`}>
                        <TableCell
                          colSpan={6}
                          className="border-l-4 border-[#182659] bg-[#d0defd] font-bold text-left text-xs sm:text-sm py-2 sm:py-3"
                        >
                          <Skeleton className="h-5 w-32 sm:h-6 sm:w-48" />
                        </TableCell>
                      </TableRow>
                      {Array(3)
                        .fill(0)
                        .map((_, gameIndex) => (
                          <TableRow key={`game-${weekIndex}-${gameIndex}`} className="text-center">
                            <TableCell className="hidden sm:table-cell py-2 sm:py-3">
                              <Skeleton className="mx-auto h-5 w-10 sm:h-6 sm:w-12" />
                            </TableCell>
                            <TableCell className="py-2 sm:py-3">
                              <Skeleton className="mx-auto h-5 w-20 sm:h-6 sm:w-32" />
                            </TableCell>
                            <TableCell className="py-2 sm:py-3">
                              <Skeleton className="mx-auto h-5 w-12 sm:h-6 sm:w-20" />
                            </TableCell>
                            <TableCell className="py-2 sm:py-3">
                              <Skeleton className="mx-auto h-5 w-12 sm:h-6 sm:w-20" />
                            </TableCell>
                            <TableCell className="py-2 sm:py-3">
                              <Skeleton className="mx-auto h-5 w-20 sm:h-6 sm:w-32" />
                            </TableCell>
                            <TableCell className="py-2 sm:py-3">
                              <Skeleton className="mx-auto h-8 w-20 sm:h-9 sm:w-24" />
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))
              : weeks.map((week) => (
                  <>
                    <TableRow key={week.name}>
                      <TableCell
                        colSpan={6}
                        className="border-l-4 border-[#182659] bg-[#d0defd] font-bold text-left text-xs sm:text-sm py-2 sm:py-3"
                      >
                        {week.name} - {week.date}
                      </TableCell>
                    </TableRow>
                    {week.games.map((game, gameIndex) => {
                      const gameId = `${week.name}-${gameIndex}`
                      const isEditable = editableRows[gameId]
                      const isSaving = savingRow === gameId
                      const gameScores = scores[gameId] || { home: "", away: "" }
                      const gameResult = findGameResult(week.name, gameIndex)

                      // Determine winner and loser
                      let homeWinner = false
                      let awayWinner = false
                      let tie = false

                      if (gameResult) {
                        if (gameResult.home_score > gameResult.away_score) {
                          homeWinner = true
                        } else if (gameResult.away_score > gameResult.home_score) {
                          awayWinner = true
                        } else {
                          tie = true
                        }
                      }

                      return (
                        <TableRow key={gameId} className="text-center uppercase">
                          <TableCell className="hidden sm:table-cell py-2 sm:py-3"></TableCell>
                          <TableCell className="py-2 sm:py-3">
                            <div className="flex items-center justify-center gap-1 text-xs sm:text-sm">
                              <span className="truncate max-w-[80px] sm:max-w-full">{game.homeTeam}</span>
                              {homeWinner && <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />}
                              {awayWinner && (
                                <span className="font-bold text-red-500 text-xs sm:text-sm flex-shrink-0">L</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-2 sm:py-3">
                            <Input
                              type="number"
                              min={0}
                              className="mx-auto w-12 sm:w-20 text-center text-xs sm:text-sm h-8 sm:h-10"
                              disabled={!isEditable || isSaving}
                              value={gameScores.home || (gameResult ? gameResult.home_score : "")}
                              onChange={(e) => handleScoreChange(gameId, "home", e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="py-2 sm:py-3">
                            <Input
                              type="number"
                              min={0}
                              className="mx-auto w-12 sm:w-20 text-center text-xs sm:text-sm h-8 sm:h-10"
                              disabled={!isEditable || isSaving}
                              value={gameScores.away || (gameResult ? gameResult.away_score : "")}
                              onChange={(e) => handleScoreChange(gameId, "away", e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="py-2 sm:py-3">
                            <div className="flex items-center justify-center gap-1 text-xs sm:text-sm">
                              <span className="truncate max-w-[80px] sm:max-w-full">{game.awayTeam}</span>
                              {awayWinner && <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />}
                              {homeWinner && (
                                <span className="font-bold text-red-500 text-xs sm:text-sm flex-shrink-0">L</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-2 sm:py-3">
                            {isEditable ? (
                              <Button
                                variant="default"
                                size={isMobile ? "sm" : "default"}
                                className="bg-[#182659] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                                disabled={isSaving}
                                onClick={() => handleSave(gameId, game.homeTeam, game.awayTeam, week.name, gameIndex)}
                              >
                                {isSaving ? (
                                  <>
                                    <Loader2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                    <span className="hidden sm:inline">Saving...</span>
                                    <span className="sm:hidden">...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Save</span>
                                    <span className="sm:hidden">Save</span>
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size={isMobile ? "sm" : "default"}
                                className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                                onClick={() => handleUnlock(gameId)}
                              >
                                <Unlock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Edit Score</span>
                                <span className="sm:hidden">Edit</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </>
                ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

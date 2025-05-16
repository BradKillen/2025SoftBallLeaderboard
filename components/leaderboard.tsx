"use client"

import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { useTeamStore } from "@/lib/store"
import { Trophy, Medal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"

export function Leaderboard() {
  const { teams, sortTeams, loadData, loading, error } = useTeamStore()
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    loadData()
  }, [loadData])

  // Function to render position indicator
  const renderPosition = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="flex items-center justify-center">
            <Trophy className="mr-1 h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            <span className="font-bold text-yellow-500 text-sm sm:text-base">1st</span>
          </div>
        )
      case 2:
        return (
          <div className="flex items-center justify-center">
            <Medal className="mr-1 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <span className="font-bold text-gray-500 text-sm sm:text-base">2nd</span>
          </div>
        )
      case 3:
        return (
          <div className="flex items-center justify-center">
            <Medal className="mr-1 h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
            <span className="font-bold text-amber-700 text-sm sm:text-base">3rd</span>
          </div>
        )
      default:
        return <span className="font-medium text-gray-600 text-sm sm:text-base">{position}th</span>
    }
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
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm w-12 sm:w-auto">
                Pos
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm">
                Team
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm w-12 sm:w-auto">
                W
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm w-12 sm:w-auto">
                L
              </TableHead>
              <TableHead className="bg-[#eede03] text-center font-bold text-[#182659] text-xs sm:text-sm w-12 sm:w-auto">
                +/-
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // Loading skeleton
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i} className="text-center">
                      <TableCell className="py-2 sm:py-3">
                        <Skeleton className="mx-auto h-5 w-10 sm:h-6 sm:w-12" />
                      </TableCell>
                      <TableCell className="py-2 sm:py-3">
                        <Skeleton className="mx-auto h-5 w-24 sm:h-6 sm:w-32" />
                      </TableCell>
                      <TableCell className="py-2 sm:py-3">
                        <Skeleton className="mx-auto h-5 w-6 sm:h-6 sm:w-8" />
                      </TableCell>
                      <TableCell className="py-2 sm:py-3">
                        <Skeleton className="mx-auto h-5 w-6 sm:h-6 sm:w-8" />
                      </TableCell>
                      <TableCell className="py-2 sm:py-3">
                        <Skeleton className="mx-auto h-5 w-6 sm:h-6 sm:w-8" />
                      </TableCell>
                    </TableRow>
                  ))
              : teams.map((team, index) => (
                  <TableRow key={team.name} className="text-center uppercase">
                    <TableCell className="py-2 sm:py-3">{renderPosition(index + 1)}</TableCell>
                    <TableCell className="py-2 sm:py-3 font-medium text-xs sm:text-sm">{team.name}</TableCell>
                    <TableCell className="py-2 sm:py-3 text-xs sm:text-sm">{team.wins}</TableCell>
                    <TableCell className="py-2 sm:py-3 text-xs sm:text-sm">{team.losses}</TableCell>
                    <TableCell className="py-2 sm:py-3 text-xs sm:text-sm">{team.differential}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

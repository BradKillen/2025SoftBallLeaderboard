"use client"

import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { useTeamStore } from "@/lib/store"
import { Trophy, Medal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function Leaderboard() {
  const { teams, sortTeams, loadData, loading, error } = useTeamStore()

  useEffect(() => {
    loadData()
  }, [loadData])

  // Function to render position indicator
  const renderPosition = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="flex items-center justify-center">
            <Trophy className="mr-1 h-5 w-5 text-yellow-500" />
            <span className="font-bold text-yellow-500">1st</span>
          </div>
        )
      case 2:
        return (
          <div className="flex items-center justify-center">
            <Medal className="mr-1 h-5 w-5 text-gray-400" />
            <span className="font-bold text-gray-500">2nd</span>
          </div>
        )
      case 3:
        return (
          <div className="flex items-center justify-center">
            <Medal className="mr-1 h-5 w-5 text-amber-700" />
            <span className="font-bold text-amber-700">3rd</span>
          </div>
        )
      default:
        return <span className="font-medium text-gray-600">{position}th</span>
    }
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500">Error loading data: {error}</p>
        <button onClick={() => loadData()} className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Retry
        </button>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-[#eede03] text-center font-bold text-[#182659]">Pos</TableHead>
            <TableHead className="bg-[#eede03] text-center font-bold text-[#182659]">Team</TableHead>
            <TableHead className="bg-[#eede03] text-center font-bold text-[#182659]">Wins</TableHead>
            <TableHead className="bg-[#eede03] text-center font-bold text-[#182659]">Losses</TableHead>
            <TableHead className="bg-[#eede03] text-center font-bold text-[#182659]">+ / -</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? // Loading skeleton
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i} className="text-center">
                    <TableCell>
                      <Skeleton className="mx-auto h-6 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mx-auto h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mx-auto h-6 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mx-auto h-6 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mx-auto h-6 w-8" />
                    </TableCell>
                  </TableRow>
                ))
            : teams.map((team, index) => (
                <TableRow key={team.name} className="text-center uppercase">
                  <TableCell className="py-3">{renderPosition(index + 1)}</TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.wins}</TableCell>
                  <TableCell>{team.losses}</TableCell>
                  <TableCell>{team.differential}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </Card>
  )
}

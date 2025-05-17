"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { loadJsonData } from "@/lib/data-service"

interface RejectData {
  Result: {
    status: string
    data: {
      rejection_reason: string
    }
    message: string
  }
}

export default function RejectedResult() {
  const [data, setData] = useState<RejectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const jsonData = await loadJsonData<RejectData>("reject")

        if (!jsonData) {
          throw new Error("Failed to load data")
        }

        setData(jsonData)
        setError(null)
      } catch (err) {
        console.error("Error in RejectedResult:", err)
        setError("Failed to load rejection data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fallback content for loading state
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Fallback content for error state
  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <Card className="border-red-300">
          <CardContent className="pt-6">
            <div className="text-red-500 mb-4">{error || "Unable to load data"}</div>
            <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700 text-white">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Safely access the rejection reason with fallback
  const rejectionReason = data.Result?.data?.rejection_reason || "No reason provided"

  return (
    <div className="space-y-6">
      <Card className="border-red-500 border-2">
        <CardHeader className="bg-red-50 flex flex-row items-center gap-3">
          <XCircle className="h-8 w-8 text-red-500" />
          <h2 className="text-3xl font-bold text-red-700">Rejected</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <p className="text-xl font-medium">Better luck next time</p>

            <div>
              <h3 className="text-lg font-semibold mb-2">Rejection Reason</h3>
              <div className="p-4 bg-red-50 rounded-lg text-gray-800">{rejectionReason}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

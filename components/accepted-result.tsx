"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { generatePDF } from "@/lib/pdf-generator"
import { loadJsonData } from "@/lib/data-service"

interface AcceptData {
  report: {
    project_summary: {
      tech_stack: string[]
    }
    hidevs_score: {
      score: number
    }
  }
}

export default function AcceptedResult() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [data, setData] = useState<AcceptData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const jsonData = await loadJsonData<AcceptData>("accept")

        if (!jsonData) {
          throw new Error("Failed to load data")
        }

        setData(jsonData)
        setError(null)
      } catch (err) {
        console.error("Error in AcceptedResult:", err)
        setError("Failed to load acceptance data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownloadReport = async () => {
    if (!data) return

    setIsGenerating(true)
    try {
      await generatePDF(data)
    } catch (err) {
      console.error("Error generating PDF:", err)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

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

  // Default score and tech stack if data is malformed
  const score = data.report?.hidevs_score?.score ?? 0
  const techStack = data.report?.project_summary?.tech_stack ?? []

  return (
    <div className="space-y-6">
      <Card className="border-green-500 border-2">
        <CardHeader className="bg-green-50 flex flex-row items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h2 className="text-3xl font-bold text-green-700">Accepted</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <p className="text-xl font-medium">Congratulations for successfully completing the course!!</p>

            <div>
              <h3 className="text-lg font-semibold mb-2">Score</h3>
              <div className="flex items-center gap-2">
                <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{score}</span>
                </div>
                <span className="text-lg font-medium">out of 100</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Skills Gained</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.length > 0 ? (
                  techStack.map((skill, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No skills data available</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleDownloadReport}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Your Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

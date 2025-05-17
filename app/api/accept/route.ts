import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Get the absolute path to the JSON file
    const filePath = path.join(process.cwd(), "app/data/accept.json")

    // Read the file
    const fileContents = fs.readFileSync(filePath, "utf8")

    // Parse the JSON
    const data = JSON.parse(fileContents)

    // Return the data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading accept.json:", error)
    return NextResponse.json({ error: "Failed to load acceptance data" }, { status: 500 })
  }
}

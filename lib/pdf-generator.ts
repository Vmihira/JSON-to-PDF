import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export async function generatePDF(data: any) {
  try {
    // Create a new PDF document
    const doc = new jsPDF()

    // Extract data from the JSON
    const { report } = data

    if (!report) {
      throw new Error("Invalid report data structure")
    }

    const { project_summary, evaluation_criteria, skill_ratings, hidevs_score } = report

    // Add title
    doc.setFontSize(20)
    doc.setTextColor(128, 0, 128) // Purple color
    doc.text("Project Evaluation Report", 105, 15, { align: "center" })

    // Project summary
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Project Summary", 14, 30)

    // Safely access project summary data with fallbacks
    const projectName = project_summary?.Project || "N/A"
    const repository = project_summary?.repository || "N/A"
    const purpose = project_summary?.purpose_and_functionality || "N/A"
    const techStack = project_summary?.tech_stack?.join(", ") || "N/A"

    autoTable(doc, {
      startY: 35,
      head: [["Project", projectName]],
      body: [
        ["Repository", repository],
        ["Purpose", purpose],
        ["Tech Stack", techStack],
      ],
      theme: "grid",
      headStyles: { fillColor: [128, 0, 128] },
    })

    // Evaluation criteria
    if (evaluation_criteria && evaluation_criteria.length > 0) {
      const currentY = (doc as any).lastAutoTable.finalY + 10
      doc.setFontSize(16)
      doc.text("Evaluation Criteria", 14, currentY)

      const criteriaRows = evaluation_criteria.map((criterion: any) => [
        criterion.criterion_name || "N/A",
        criterion.score || "N/A",
        criterion.score_guide || "N/A",
      ])

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Criterion", "Score", "Assessment"]],
        body: criteriaRows,
        theme: "grid",
        headStyles: { fillColor: [128, 0, 128] },
      })
    }

    // Skill ratings
    if (skill_ratings) {
      const currentY2 = (doc as any).lastAutoTable.finalY + 10
      doc.setFontSize(16)
      doc.text("Skill Ratings", 14, currentY2)

      const skillRows = Object.entries(skill_ratings).map(([skill, details]: [string, any]) => [
        skill,
        details.rating || "N/A",
      ])

      autoTable(doc, {
        startY: currentY2 + 5,
        head: [["Skill", "Rating"]],
        body: skillRows,
        theme: "grid",
        headStyles: { fillColor: [128, 0, 128] },
      })
    }

    // Final score
    const currentY3 = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(16)
    doc.text("Final Score", 14, currentY3)

    autoTable(doc, {
      startY: currentY3 + 5,
      body: [["Overall Score", `${hidevs_score?.score || "N/A"}/100`]],
      theme: "grid",
      bodyStyles: { fillColor: [230, 230, 250], textColor: [128, 0, 128], fontStyle: "bold" },
    })

    // Save the PDF
    doc.save("project_evaluation_report.pdf")

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

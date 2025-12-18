export interface AllotmentNotification {
  userEmail: string
  ipoName: string
  isAllotted: boolean
  panCard: string
  checkDate: string
}

export interface BatchAllotmentResult {
  ipoName: string
  isAllotted: boolean
}

export class NotificationService {
  static async sendAllotmentNotification(data: AllotmentNotification): Promise<boolean> {
    try {
      const subject = data.isAllotted
        ? `✅ IPO Allotment Success - ${data.ipoName}`
        : `ℹ️ IPO Allotment Status - ${data.ipoName}`

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: ${data.isAllotted ? "#10b981" : "#6b7280"}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .status { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .details { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>IPO Allotment Update</h1>
              </div>
              <div class="content">
                <div class="status">${data.isAllotted ? "🎉 Congratulations!" : "📋 Allotment Status"}</div>
                <p>${
                  data.isAllotted
                    ? `You have been allotted shares in ${data.ipoName}!`
                    : `Unfortunately, you were not allotted shares in ${data.ipoName}.`
                }</p>
                
                <div class="details">
                  <div class="detail-row">
                    <span><strong>IPO Name:</strong></span>
                    <span>${data.ipoName}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>PAN Card:</strong></span>
                    <span>${data.panCard}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Check Date:</strong></span>
                    <span>${new Date(data.checkDate).toLocaleString()}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Status:</strong></span>
                    <span style="color: ${data.isAllotted ? "#10b981" : "#6b7280"}; font-weight: bold;">
                      ${data.isAllotted ? "ALLOTTED" : "NOT ALLOTTED"}
                    </span>
                  </div>
                </div>

                ${
                  data.isAllotted
                    ? '<p style="margin-top: 20px;">Next steps: Watch for listing date and demat credit.</p>'
                    : '<p style="margin-top: 20px;">Better luck with the next IPO!</p>'
                }
              </div>
              <div class="footer">
                <p>This is an automated notification from IPO Tracker</p>
                <p>Your data is secure and never shared with third parties</p>
              </div>
            </div>
          </body>
        </html>
      `

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.userEmail,
          subject,
          html,
        }),
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error("[v0] Failed to send allotment notification:", error)
      return false
    }
  }

  static async sendBatchAllotmentResults(userEmail: string, results: BatchAllotmentResult[]): Promise<boolean> {
    try {
      const allottedCount = results.filter((r) => r.isAllotted).length
      const totalCount = results.length

      const subject = `📊 Batch Allotment Check Complete - ${allottedCount}/${totalCount} Allotted`

      const resultsHTML = results
        .map(
          (result) => `
          <div class="detail-row">
            <span>${result.ipoName}</span>
            <span style="color: ${result.isAllotted ? "#10b981" : "#6b7280"}; font-weight: bold;">
              ${result.isAllotted ? "✅ ALLOTTED" : "❌ NOT ALLOTTED"}
            </span>
          </div>
        `,
        )
        .join("")

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
              .summary-number { font-size: 48px; font-weight: bold; color: #10b981; }
              .details { background: white; padding: 20px; border-radius: 8px; }
              .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-row:last-child { border-bottom: none; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Batch Allotment Check Summary</h1>
              </div>
              <div class="content">
                <div class="summary">
                  <div class="summary-number">${allottedCount}/${totalCount}</div>
                  <p style="color: #6b7280; margin-top: 10px;">IPO Allotments Found</p>
                </div>

                <h3 style="margin-bottom: 15px;">Detailed Results:</h3>
                <div class="details">
                  ${resultsHTML}
                </div>

                <p style="margin-top: 20px; text-align: center; color: #6b7280;">
                  ${allottedCount > 0 ? "🎉 Congratulations on your allotments!" : "Keep trying! Better luck next time."}
                </p>
              </div>
              <div class="footer">
                <p>This is an automated notification from IPO Tracker</p>
                <p>Check your dashboard for more details</p>
              </div>
            </div>
          </body>
        </html>
      `

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail,
          subject,
          html,
        }),
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error("[v0] Failed to send batch allotment results:", error)
      return false
    }
  }
}

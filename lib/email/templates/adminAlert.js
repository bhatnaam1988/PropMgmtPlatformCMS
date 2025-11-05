/**
 * Generate HTML for admin alert emails
 * @param {Object} options
 * @param {string} options.title - Alert title
 * @param {string} options.message - Alert message
 * @param {string} options.severity - Alert severity (info, warning, error, critical)
 * @param {Object} options.metadata - Additional data to include
 * @returns {string} HTML email content
 */
export function generateAdminAlertEmail({ title, message, severity = 'info', metadata = {} }) {
  // Color mapping for severity levels
  const severityColors = {
    info: '#2196F3',
    warning: '#FF9800',
    error: '#F44336',
    critical: '#9C27B0'
  };
  
  const color = severityColors[severity] || severityColors.info;
  
  // Format metadata as a table if provided
  let metadataHtml = '';
  if (Object.keys(metadata).length > 0) {
    metadataHtml = `
      <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        <h3 style="font-size: 16px; margin-bottom: 10px;">Additional Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${Object.entries(metadata).map(([key, value]) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">${key}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; word-break: break-all;">${
                  typeof value === 'object' ? JSON.stringify(value, null, 2) : value
                }</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${color}; color: white; padding: 15px; border-radius: 4px 4px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">${severity.toUpperCase()} ALERT</h1>
        </div>
        
        <div style="border: 1px solid #ddd; border-top: none; padding: 20px; border-radius: 0 0 4px 4px;">
          <h2 style="margin-top: 0; font-size: 18px;">${title}</h2>
          <div style="margin: 20px 0;">
            ${message}
          </div>
          
          ${metadataHtml}
          
          <div style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
            <p>This is an automated alert from Swiss Alpine Journey booking system.</p>
            <p>Time: ${new Date().toISOString()}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

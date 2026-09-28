import { TicketData } from '../types';

/**
 * Generates an SVG ticket and initiates an automatic client-side download (.pdf or formatted ticket).
 * Matches requirements from Phase 8.
 */
export function downloadTicketClientSide(ticket: TicketData) {
  // Generate a modern printable HTML ticket that downloads as HTML file / trigger print
  const ticketHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GIT Club Participation Ticket - ${ticket.ticketId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #07090e; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .ticket-container {
      width: 100%; max-width: 680px; background: linear-gradient(145deg, #111827 0%, #0d121f 100%);
      border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 20px; overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15);
      position: relative;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 24px 30px; display: flex; justify-content: space-between; align-items: center;
    }
    .brand-title { font-size: 20px; font-weight: 900; letter-spacing: 1px; color: #ffffff; }
    .ticket-badge { background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .body-content { padding: 30px; }
    .event-title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 20px; line-height: 1.3; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .detail-item { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); padding: 12px 16px; border-radius: 12px; }
    .detail-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 4px; }
    .detail-value { font-size: 14px; font-weight: 700; color: #f8fafc; }
    .barcode-section {
      border-top: 2px dashed rgba(255, 255, 255, 0.12); padding: 20px 30px; background: rgba(0, 0, 0, 0.3);
      display: flex; justify-content: space-between; align-items: center;
    }
    .ticket-id { font-family: monospace; font-size: 15px; font-weight: 800; color: #818cf8; letter-spacing: 1.5px; }
    .status-pill { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
    .qr-box { width: 68px; height: 68px; background: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    @media print {
      body { background: white; color: black; }
      .ticket-container { border: 2px solid #000; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="ticket-container">
    <div class="header">
      <div>
        <div class="brand-title">GIT CLUB</div>
        <div style="font-size: 11px; opacity: 0.85; margin-top: 2px;">Campus Technical Club Operating System</div>
      </div>
      <div class="ticket-badge">Participation Pass</div>
    </div>
    
    <div class="body-content">
      <div class="event-title">${ticket.eventName}</div>
      
      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">Participant</div>
          <div class="detail-value">${ticket.participantName}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Email</div>
          <div class="detail-value">${ticket.participantEmail}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Date & Time</div>
          <div class="detail-value">${ticket.eventDate} • ${ticket.eventTime}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Venue</div>
          <div class="detail-value">${ticket.eventVenue}</div>
        </div>
      </div>
    </div>

    <div class="barcode-section">
      <div>
        <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Ticket Identifier</div>
        <div class="ticket-id">${ticket.ticketId}</div>
      </div>
      <div style="text-align: center;">
        <span class="status-pill">${ticket.status.toUpperCase()}</span>
        <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Present at Entry</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Trigger download as HTML ticket (cleanly readable, openable, and printable to PDF with Ctrl+P)
  const blob = new Blob([ticketHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GIT-Club-Participation-Ticket-${ticket.ticketId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

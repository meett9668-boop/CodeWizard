import { TicketData } from '../types';

/**
 * Generates an event participation pass conforming to the visual standards and style
 * of https://gitclub-charusat-events.netlify.app/ while maintaining GIT Club branding.
 * Manual client-side generation without auto-download.
 */
export function generateTicketHtml(ticket: TicketData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GIT Club Event Pass - ${ticket.ticketId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    body {
      background: #090d16;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .pass-card {
      width: 100%;
      max-width: 640px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 50px rgba(99, 102, 241, 0.15);
      position: relative;
    }
    /* Reference banner styling */
    .pass-header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      background: #ffffff;
      color: #4f46e5;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-sub {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.85);
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.5px;
    }
    .badge {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .pass-body {
      padding: 32px;
    }
    .event-heading {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
      margin-bottom: 24px;
    }
    .grid-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }
    .info-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px 18px;
    }
    .info-label {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 14px;
      font-weight: 700;
      color: #f8fafc;
    }
    /* Ticket notch effect */
    .notch-container {
      position: relative;
      border-top: 2px dashed rgba(255, 255, 255, 0.15);
      padding: 24px 32px;
      background: rgba(15, 23, 42, 0.8);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .notch-left, .notch-right {
      position: absolute;
      top: -16px;
      width: 32px;
      height: 32px;
      background: #090d16;
      border-radius: 50%;
    }
    .notch-left { left: -16px; }
    .notch-right { right: -16px; }
    .ticket-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .ticket-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 800;
      color: #818cf8;
      letter-spacing: 1px;
    }
    .qr-badge {
      width: 76px;
      height: 76px;
      background: #ffffff;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }
    .qr-badge svg {
      width: 100%;
      height: 100%;
    }
    .status-confirmed {
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      display: inline-block;
      width: fit-content;
    }
    .status-waitlisted {
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      display: inline-block;
      width: fit-content;
    }
    @media (max-width: 500px) {
      body { padding: 12px; }
      .pass-header { padding: 16px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
      .pass-body { padding: 20px; }
      .grid-info { grid-template-columns: 1fr; gap: 12px; }
      .notch-container { padding: 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
      .qr-badge { align-self: center; }
      .event-heading { font-size: 18px; margin-bottom: 16px; }
    }
    @media print {
      @page { size: auto; margin: 15mm; }
      body { background: #ffffff !important; color: #000000 !important; padding: 0 !important; display: block !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pass-card { border: 1.5px solid #1e293b !important; box-shadow: none !important; max-width: 100% !important; margin: 0 auto !important; page-break-inside: avoid; }
      .notch-left, .notch-right { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="pass-card">
    <div class="pass-header">
      <div class="brand">
        <div class="brand-logo">G</div>
        <div>
          <div class="brand-title">GIT CLUB</div>
          <div class="brand-sub">STUDENT TECHNICAL COUNCIL</div>
        </div>
      </div>
      <div class="badge">Participation Pass</div>
    </div>

    <div class="pass-body">
      <div class="event-heading">${ticket.eventName}</div>

      <div class="grid-info">
        <div class="info-box">
          <div class="info-label">
            <svg style="width:12px;height:12px;display:inline-block;vertical-align:-1px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Participant
          </div>
          <div class="info-value">${ticket.participantName}</div>
        </div>
        <div class="info-box">
          <div class="info-label">
            <svg style="width:12px;height:12px;display:inline-block;vertical-align:-1px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg>
            Student / Enrollment ID
          </div>
          <div class="info-value">${ticket.studentId || 'GIT-ENROLL-VERIFIED'}</div>
        </div>
        <div class="info-box">
          <div class="info-label">
            <svg style="width:12px;height:12px;display:inline-block;vertical-align:-1px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Date &amp; Time
          </div>
          <div class="info-value">${ticket.eventDate} &bull; ${ticket.eventTime}</div>
        </div>
        <div class="info-box">
          <div class="info-label">
            <svg style="width:12px;height:12px;display:inline-block;vertical-align:-1px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Official Venue
          </div>
          <div class="info-value">${ticket.eventVenue}</div>
        </div>
      </div>

      <div class="${ticket.status === 'Confirmed' ? 'status-confirmed' : 'status-waitlisted'}">
        ? ${ticket.status.toUpperCase()} SEAT
      </div>
    </div>

    <div class="notch-container">
      <div class="notch-left"></div>
      <div class="notch-right"></div>
      <div class="ticket-meta">
        <div class="info-label">Pass Identification Code</div>
        <div class="ticket-code">${ticket.ticketId}</div>
        <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">
          Registered: ${ticket.registrationDate} &bull; RegID: ${ticket.registrationId}
        </div>
      </div>
      <div class="qr-badge" title="Entry Scan Passcode">
        <!-- Digital QR Matrix Illustration -->
        <svg viewBox="0 0 100 100" fill="#090d16">
          <rect x="10" y="10" width="30" height="30" rx="4" fill="#090d16" />
          <rect x="18" y="18" width="14" height="14" fill="#ffffff" />
          <rect x="22" y="22" width="6" height="6" fill="#090d16" />
          <rect x="60" y="10" width="30" height="30" rx="4" fill="#090d16" />
          <rect x="68" y="18" width="14" height="14" fill="#ffffff" />
          <rect x="72" y="22" width="6" height="6" fill="#090d16" />
          <rect x="10" y="60" width="30" height="30" rx="4" fill="#090d16" />
          <rect x="18" y="68" width="14" height="14" fill="#ffffff" />
          <rect x="22" y="72" width="6" height="6" fill="#090d16" />
          <rect x="50" y="50" width="10" height="10" fill="#090d16" />
          <rect x="70" y="60" width="8" height="15" fill="#090d16" />
          <rect x="65" y="80" width="20" height="10" fill="#090d16" />
          <rect x="50" y="70" width="10" height="15" fill="#090d16" />
        </svg>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Explicit manual download triggered only when participant clicks 'DOWNLOAD TICKET'
 */
export function manualDownloadTicket(ticket: TicketData) {
  const ticketHtml = generateTicketHtml(ticket);
  const blob = new Blob([ticketHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GIT-Club-Participation-Ticket-${ticket.ticketId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print dialog window for saving as PDF or printing
 */
export function printTicketPass(ticket: TicketData) {
  const ticketHtml = generateTicketHtml(ticket);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(ticketHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  }
}

/**
 * Generates an .ics file for calendar export
 */
export function generateIcsCalendar(ticket: TicketData): void {
  // Format Date (Assume UTC or standard format YYYYMMDD)
  const cleanDate = ticket.eventDate.replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GIT Club//Event Attendance System//EN',
    'BEGIN:VEVENT',
    `UID:${ticket.ticketId}@gitclub.git.edu`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${cleanDate}T090000Z`,
    `DTEND:${cleanDate}T170000Z`,
    `SUMMARY:${ticket.eventName}`,
    `DESCRIPTION:Participant: ${ticket.participantName}\\nTicket ID: ${ticket.ticketId}\\nVenue: ${ticket.eventVenue}`,
    `LOCATION:${ticket.eventVenue}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ticket.eventName.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Creates Google Calendar URL
 */
export function createGoogleCalendarUrl(ticket: TicketData): string {
  const title = encodeURIComponent(ticket.eventName);
  const details = encodeURIComponent(
    `GIT Club Event Participation Pass\nParticipant: ${ticket.participantName}\nTicket ID: ${ticket.ticketId}\nStatus: ${ticket.status}`
  );
  const location = encodeURIComponent(ticket.eventVenue);
  const cleanDate = ticket.eventDate.replace(/-/g, '');
  const dates = `${cleanDate}T090000Z/${cleanDate}T170000Z`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

export const downloadTicketClientSide = manualDownloadTicket;

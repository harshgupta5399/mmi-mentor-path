// Brand constants
const NAVY = "#1B3A6B";
const GOLD = "#C9A84C";
const LIGHT_BG = "#F8F9FC";

// Resolved at runtime from env — falls back to Supabase public URL
const LOGO_URL =
  (typeof process !== "undefined" && process.env.LOGO_URL) ||
  "https://slgdbiovneibvxtsguni.supabase.co/storage/v1/object/public/assets/mmi-logo.png";

function header() {
  return `
    <tr>
      <td style="background:${NAVY};padding:32px 40px;text-align:center">
        <img src="${LOGO_URL}" alt="MMI Educator" width="64" height="64"
          style="border-radius:12px;display:inline-block;margin-bottom:16px" />
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">
          MMI Educator
        </div>
        <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin-top:4px;font-family:Arial,sans-serif">
          Vijay Narwani
        </div>
      </td>
    </tr>`;
}

function footer() {
  return `
    <tr>
      <td style="background:${NAVY};padding:24px 40px;text-align:center">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.6)">
          India · Qatar · Global
        </p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.4)">
          © ${new Date().getFullYear()} MMI Educator. All rights reserved.
        </p>
      </td>
    </tr>`;
}

function divider() {
  return `<tr><td style="padding:0 40px"><div style="height:1px;background:#e8ecf4"></div></td></tr>`;
}

function wrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#e8ecf4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8ecf4;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(27,58,107,0.12)">
        ${content}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Confirmation email to the enquirer ──────────────────────────────────────
export function confirmationEmail(data: {
  name: string;
  program?: string;
  message?: string;
}) {
  const body = `
    ${header()}
    <tr>
      <td style="padding:40px 40px 24px;background:${LIGHT_BG}">
        <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;font-weight:700;color:${NAVY}">
          Thank you, ${data.name}!
        </h1>
        <p style="margin:0;font-size:15px;color:#5a6a8a;line-height:1.6">
          We've received your enquiry and Vijay Narwani will get back to you within <strong style="color:${NAVY}">24 hours</strong>.
        </p>
      </td>
    </tr>
    ${divider()}
    <tr>
      <td style="padding:32px 40px">
        ${data.program ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
          <tr>
            <td style="padding:16px 20px;background:${LIGHT_BG};border-radius:10px;border-left:4px solid ${GOLD}">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a9ab5;margin-bottom:4px">Program of Interest</div>
              <div style="font-size:16px;font-weight:600;color:${NAVY}">${data.program}</div>
            </td>
          </tr>
        </table>` : ""}
        ${data.message ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
          <tr>
            <td style="padding:16px 20px;background:${LIGHT_BG};border-radius:10px">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a9ab5;margin-bottom:6px">Your Message</div>
              <div style="font-size:14px;color:#4a5a7a;line-height:1.6">${data.message}</div>
            </td>
          </tr>
        </table>` : ""}
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:20px;background:linear-gradient(135deg,${NAVY},#2a4f8f);border-radius:12px;text-align:center">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:16px;font-style:italic;color:rgba(255,255,255,0.9)">
                "Let's shape the future of finance together."
              </p>
              <p style="margin:0;font-size:12px;color:${GOLD}">— Vijay Narwani</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${divider()}
    <tr>
      <td style="padding:24px 40px 32px">
        <p style="margin:0 0 16px;font-size:13px;color:#8a9ab5;text-align:center">Get in touch directly</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding-right:8px">
              <a href="mailto:vijayknarwani@yahoo.com" style="display:block;padding:12px;background:${LIGHT_BG};border-radius:8px;text-align:center;text-decoration:none;font-size:13px;color:${NAVY};font-weight:600">
                ✉ vijayknarwani@yahoo.com
              </a>
            </td>
            <td width="50%" style="padding-left:8px">
              <a href="tel:+917048456589" style="display:block;padding:12px;background:${LIGHT_BG};border-radius:8px;text-align:center;text-decoration:none;font-size:13px;color:${NAVY};font-weight:600">
                📞 +91 70484 56589
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${footer()}`;

  return wrapper(body);
}

// ── Admin notification email ─────────────────────────────────────────────────
export function adminNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  program?: string;
  message?: string;
}) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone ?? "—"],
    ["Program", data.program ?? "—"],
    ["Message", data.message ?? "—"],
  ];

  const body = `
    ${header()}
    <tr>
      <td style="padding:32px 40px 16px;background:${LIGHT_BG}">
        <div style="display:inline-block;padding:6px 14px;background:${GOLD};border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${NAVY};margin-bottom:12px">
          New Enquiry
        </div>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:700;color:${NAVY}">
          ${data.name} wants to connect
        </h1>
      </td>
    </tr>
    ${divider()}
    <tr>
      <td style="padding:32px 40px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e8ecf4">
          ${rows.map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#ffffff" : LIGHT_BG}">
            <td style="padding:14px 20px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#8a9ab5;font-weight:600;width:120px;white-space:nowrap">
              ${label}
            </td>
            <td style="padding:14px 20px;font-size:14px;color:${NAVY};font-weight:${label === "Name" ? "700" : "400"}">
              ${label === "Email"
                ? `<a href="mailto:${value}" style="color:${GOLD};text-decoration:none">${value}</a>`
                : label === "Phone" && value !== "—"
                ? `<a href="tel:${value}" style="color:${GOLD};text-decoration:none">${value}</a>`
                : value}
            </td>
          </tr>`).join("")}
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px">
          <tr>
            <td style="text-align:center">
              <a href="mailto:${data.email}" style="display:inline-block;padding:14px 32px;background:${GOLD};border-radius:8px;font-size:14px;font-weight:700;color:${NAVY};text-decoration:none;letter-spacing:0.3px">
                Reply to ${data.name}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${footer()}`;

  return wrapper(body);
}

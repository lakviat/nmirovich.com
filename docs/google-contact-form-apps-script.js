const RECIPIENT_EMAIL = "lakviat@gmail.com";

function doPost(e) {
  const data = e.parameter || {};

  // Honeypot spam guard. Real visitors never fill this field.
  if (data.website) {
    return jsonResponse({ ok: true, skipped: true });
  }

  const firstName = clean(data.first_name);
  const lastName = clean(data.last_name);
  const senderEmail = clean(data.email);
  const message = clean(data.message);
  const source = clean(data.source || "nmirovich.info");

  const subject = `New portfolio contact from ${firstName} ${lastName}`.trim();
  const body = [
    "New contact form submission",
    "",
    `Name: ${firstName} ${lastName}`,
    `Email: ${senderEmail}`,
    `Source: ${source}`,
    "",
    "Message:",
    message || "No message provided.",
  ].join("\n");

  MailApp.sendEmail({
    to: RECIPIENT_EMAIL,
    subject,
    body,
    replyTo: senderEmail,
  });

  return jsonResponse({ ok: true });
}

function doGet() {
  return jsonResponse({ ok: true, service: "nmirovich-contact-form" });
}

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

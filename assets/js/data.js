/* Makani County incident console - evidence data.  MOCK SITE FOR TRAINING.
 * Every person, address, IP and record below is fictional. IP addresses use the
 * documentation ranges (192.0.2.x, 198.51.100.x, 203.0.113.x), which are never real hosts.
 * Times are Hawaii Standard Time.
 */

window.MC = window.MC || {};

MC.DATA = {

  countyNetwork: "198.51.100.",   // county office and plant network (documented in the IT notes)

  users: [
    { user: "nkahale",    name: "Noelani Kahale",  role: "editor",    dept: "Public Works, Customer Service", created: "2021-03-02", createdBy: "ekim",    lastLogin: "2026-09-20 02:03", lastIp: "203.0.113.57",  mfa: false, status: "active",   note: "" },
    { user: "rtorres",    name: "Ray Torres",      role: "editor",    dept: "Water Operations",              created: "2019-08-14", createdBy: "ekim",    lastLogin: "2026-09-19 15:10", lastIp: "198.51.100.41", mfa: false, status: "active",   note: "" },
    { user: "ekim",       name: "Esther Kim",      role: "admin",     dept: "Information Technology",        created: "2018-01-09", createdBy: "setup",   lastLogin: "2026-09-20 06:32", lastIp: "198.51.100.12", mfa: true,  status: "active",   note: "IT administrator" },
    { user: "plant_ops",  name: "Treatment plant console (shared)", role: "operator", dept: "Water Operations", created: "2018-01-09", createdBy: "setup", lastLogin: "2026-09-19 22:00", lastIp: "198.51.100.77", mfa: true, status: "active", note: "Only account allowed on Plant controls" },
    { user: "svc_backup", name: "Backup service",  role: "admin",     dept: "(none)",                        created: "2026-09-20 02:07", createdBy: "nkahale", lastLogin: "2026-09-20 02:09", lastIp: "203.0.113.57", mfa: false, status: "active", note: "Automated nightly backup account. flag{new-admin-at-2am}" },
    { user: "responder",  name: "Incident responder (you)", role: "read-only", dept: "IT (temporary)",       created: "2026-09-20 06:35", createdBy: "ekim", lastLogin: "(this session)", lastIp: "198.51.100.12", mfa: false, status: "active", note: "Temporary read-only access for incident IR-2026-014" }
  ],

  // Audit log: every action the portal records.
  audit: [
    { t: "2026-09-19 15:10:04", user: "rtorres",    ip: "198.51.100.41", action: "login",          detail: "Success", ok: true },
    { t: "2026-09-19 15:12:37", user: "rtorres",    ip: "198.51.100.41", action: "edit content",   detail: "Water service status (revision 39)", ok: true },
    { t: "2026-09-19 15:20:02", user: "rtorres",    ip: "198.51.100.41", action: "logout",         detail: "", ok: true },
    { t: "2026-09-19 16:55:48", user: "nkahale",    ip: "198.51.100.23", action: "login",          detail: "Success", ok: true },
    { t: "2026-09-19 17:03:11", user: "nkahale",    ip: "198.51.100.23", action: "edit content",   detail: "News: Kalani Road closure (revision 40)", ok: true },
    { t: "2026-09-19 17:30:26", user: "nkahale",    ip: "198.51.100.23", action: "logout",         detail: "", ok: true },
    { t: "2026-09-19 22:00:15", user: "plant_ops",  ip: "198.51.100.77", action: "login",          detail: "Success (MFA verified)", ok: true },
    { t: "2026-09-19 22:01:02", user: "plant_ops",  ip: "198.51.100.77", action: "view controls",  detail: "Plant controls opened (MFA verified)", ok: true },
    { t: "2026-09-19 22:06:40", user: "plant_ops",  ip: "198.51.100.77", action: "logout",         detail: "", ok: true },
    { t: "2026-09-20 01:00:00", user: "system",     ip: "127.0.0.1",     action: "task run",       detail: "Nightly database backup: OK", ok: true },
    { t: "2026-09-20 01:58:19", user: "admin",      ip: "203.0.113.57",  action: "login",          detail: "FAILED: unknown username", ok: false },
    { t: "2026-09-20 02:00:03", user: "admin",      ip: "203.0.113.57",  action: "login",          detail: "FAILED: unknown username", ok: false },
    { t: "2026-09-20 02:02:41", user: "administrator", ip: "203.0.113.57", action: "login",        detail: "FAILED: unknown username", ok: false },
    { t: "2026-09-20 02:03:11", user: "nkahale",    ip: "203.0.113.57",  action: "login",          detail: "Success (new device, no MFA on this account)", ok: true },
    { t: "2026-09-20 02:05:30", user: "nkahale",    ip: "203.0.113.57",  action: "view",           detail: "Accounts page", ok: true },
    { t: "2026-09-20 02:07:52", user: "nkahale",    ip: "203.0.113.57",  action: "create account", detail: "svc_backup (role: admin)", ok: true },
    { t: "2026-09-20 02:08:40", user: "nkahale",    ip: "203.0.113.57",  action: "logout",         detail: "", ok: true },
    { t: "2026-09-20 02:09:05", user: "svc_backup", ip: "203.0.113.57",  action: "login",          detail: "Success (new device)", ok: true },
    { t: "2026-09-20 02:12:40", user: "svc_backup", ip: "203.0.113.57",  action: "edit content",   detail: "Home page alert banner (revision 41)", ok: true },
    { t: "2026-09-20 02:15:18", user: "svc_backup", ip: "203.0.113.57",  action: "edit content",   detail: "Emergency contacts (revision 42)", ok: true },
    { t: "2026-09-20 02:19:57", user: "svc_backup", ip: "203.0.113.57",  action: "upload file",    detail: "verify.html (4 KB) to site root", ok: true },
    { t: "2026-09-20 02:21:33", user: "svc_backup", ip: "203.0.113.57",  action: "edit content",   detail: "Pay your bill (revision 43)", ok: true },
    { t: "2026-09-20 02:26:09", user: "svc_backup", ip: "203.0.113.57",  action: "create task",    detail: "Nightly contact sync (daily 02:30)", ok: true },
    { t: "2026-09-20 02:31:00", user: "system",     ip: "127.0.0.1",     action: "task run",       detail: "Nightly contact sync: OK, 1,204 records sent to 203.0.113.57", ok: true },
    { t: "2026-09-20 02:34:12", user: "svc_backup", ip: "203.0.113.57",  action: "view controls",  detail: "DENIED: Plant controls require MFA", ok: false },
    { t: "2026-09-20 02:35:01", user: "svc_backup", ip: "203.0.113.57",  action: "view controls",  detail: "DENIED: Plant controls require MFA", ok: false },
    { t: "2026-09-20 02:36:27", user: "svc_backup", ip: "203.0.113.57",  action: "view controls",  detail: "DENIED: Plant controls require MFA", ok: false },
    { t: "2026-09-20 02:38:50", user: "svc_backup", ip: "203.0.113.57",  action: "delete log",     detail: "DENIED: audit log deletion needs a second administrator", ok: false },
    { t: "2026-09-20 02:40:14", user: "svc_backup", ip: "203.0.113.57",  action: "logout",         detail: "", ok: true },
    { t: "2026-09-20 06:10:33", user: "system",     ip: "127.0.0.1",     action: "ticket",         detail: "Ticket #4471 opened by Customer Service: resident reports the website tells them to call 808-555-0199", ok: true },
    { t: "2026-09-20 06:32:08", user: "ekim",       ip: "198.51.100.12", action: "login",          detail: "Success (MFA verified)", ok: true },
    { t: "2026-09-20 06:35:44", user: "ekim",       ip: "198.51.100.12", action: "create account", detail: "responder (role: read-only)", ok: true },
    { t: "2026-09-20 06:36:20", user: "ekim",       ip: "198.51.100.12", action: "note",           detail: "Incident IR-2026-014 opened. Site left unchanged so evidence is preserved.", ok: true }
  ],

  // Content revision history. "before" is the text as it was, "after" is the text after the edit.
  revisions: [
    { id: 38, t: "2026-09-18 09:05", user: "rtorres", page: "Home page alert banner", note: "advisory lifted",
      before: "ADVISORY: Boil water advisory in effect for the Upper Makani service area. Boil tap water for one minute before drinking or cooking. Updates at 808-555-0150.",
      after:  "ADVISORY: The boil water advisory for the Upper Makani service area was lifted on September 18. Tap water is safe to drink. Thank you for your patience." },
    { id: 39, t: "2026-09-19 15:12", user: "rtorres", page: "Water service status", note: "flushing schedule",
      before: "Hydrant flushing: Kalani Road area, September 15 to 19, 8 AM to 3 PM. Water may look cloudy for a short time.",
      after:  "Hydrant flushing: Makai Village area, September 22 to 26, 8 AM to 3 PM. Water may look cloudy for a short time." },
    { id: 40, t: "2026-09-19 17:03", user: "nkahale", page: "News: Kalani Road closure", note: "new item",
      before: "",
      after:  "Kalani Road will be closed between Mile 3 and Mile 4 on September 23 for a water main repair. Use Ridge Road as a detour." },
    { id: 41, t: "2026-09-20 02:12", user: "svc_backup", page: "Home page alert banner", note: "minor wording fix",
      before: "ADVISORY: The boil water advisory for the Upper Makani service area was lifted on September 18. Tap water is safe to drink. Thank you for your patience.",
      after:  "URGENT: Water service to your address will be SHUT OFF unless your account is verified within 24 hours. Call 808-555-0199 now and have your account number and payment card ready." },
    { id: 42, t: "2026-09-20 02:15", user: "svc_backup", page: "Emergency contacts", note: "updated phone",
      before: "Water emergencies, 24 hours: 808-555-0150. Main break or no water: 808-555-0150. Billing questions (weekdays): 808-555-0160.",
      after:  "Water emergencies, 24 hours: 808-555-0199. Main break or no water: 808-555-0199. Billing questions (weekdays): 808-555-0160." },
    { id: 43, t: "2026-09-20 02:21", user: "svc_backup", page: "Pay your bill", note: "link fix",
      before: "Pay online through the county billing portal (link: billing portal). You will need your account number from your paper bill.",
      after:  "Before paying, all customers must verify their account (link: verify.html). You will need your account number, online password and payment card." }
  ],

  // Noelani Kahale's mailbox export (last two days).
  emails: [
    { id: 1, t: "2026-09-19 09:12", from: "Ray Torres <rtorres@makanicounty.example>", replyTo: "", to: "nkahale@makanicounty.example",
      subject: "Flushing schedule for next week",
      body: "Hi Noelani,\n\nHydrant flushing moves to Makai Village next week (Sep 22 to 26). I will update the water status page this afternoon. Can you put a line in the news section too?\n\nThanks,\nRay",
      links: [] },
    { id: 2, t: "2026-09-19 11:40", from: "Esther Kim <ekim@makanicounty.example>", replyTo: "", to: "all-staff@makanicounty.example",
      subject: "Reminder: IT will never email you a link to reset your password",
      body: "All,\n\nQuick reminder from IT. We will never send you an email asking you to click a link and enter your password. If your password really is expiring, you will see a message inside the portal after you sign in.\n\nIf you get an email like that, forward it to it-security@makanicounty.example and delete it.\n\nEsther",
      links: [] },
    { id: 3, t: "2026-09-19 16:42", from: "IT Support <it-support@makanicounty-portal.example>", replyTo: "helpdesk@mail-relay-services.example", to: "nkahale@makanicounty.example",
      subject: "Action required: your portal password expires today",
      body: "Dear Employee,\n\nOur records show that the password for your Public Works Portal account expires TODAY at 5:00 PM. If you do not verify your account before then, you will lose access to the portal and your pending work will be deleted.\n\nVerify your account here:\nhttps://portal.makanicounty.example/reset\n\nThis takes less than one minute. Do not reply to this message.\n\nMakani County IT Helpdesk",
      links: [ { text: "https://portal.makanicounty.example/reset", href: "https://makanicounty-portal.example/reset?ref=flag{hover-before-you-click}" } ] },
    { id: 4, t: "2026-09-19 16:58", from: "Makani County Portal <no-reply@makanicounty-portal.example>", replyTo: "", to: "nkahale@makanicounty.example",
      subject: "Your password has been verified",
      body: "Thank you. Your account nkahale has been verified and your password will remain active.\n\nNo further action is needed.",
      links: [] },
    { id: 5, t: "2026-09-20 06:15", from: "Customer Service queue <cs-queue@makanicounty.example>", replyTo: "", to: "nkahale@makanicounty.example",
      subject: "Ticket #4471: resident says our website tells them to call 808-555-0199",
      body: "New ticket assigned to Public Works.\n\nCaller (Makai Village) says the county website shows an urgent red banner saying their water will be shut off unless they call 808-555-0199 and give a payment card. Caller did not call the number. Please check the website.\n\nOpened 06:10 by the overnight answering service.",
      links: [] },
    { id: 6, t: "2026-09-20 06:40", from: "Esther Kim <ekim@makanicounty.example>", replyTo: "", to: "nkahale@makanicounty.example",
      subject: "Incident IR-2026-014: do not change anything on the portal",
      body: "Noelani,\n\nSomething is wrong with the public site and I have opened an incident. Please do not log in to the portal or change anything until the responder has finished. We will talk this morning.\n\nEsther",
      links: [] }
  ],

  // Scheduled tasks configured in the portal.
  tasks: [
    { name: "Nightly database backup", created: "2019-08-14", createdBy: "ekim", schedule: "Daily 01:00", action: "Copy the portal database to backup-01 (county network)", lastRun: "2026-09-20 01:00", lastResult: "OK", desc: "Standard backup to the county backup server." },
    { name: "Weekly water quality report", created: "2020-02-03", createdBy: "rtorres", schedule: "Mondays 07:00", action: "Publish the lab results table to the Water service status page", lastRun: "2026-09-15 07:00", lastResult: "OK", desc: "Publishes the state-required weekly sample results." },
    { name: "Nightly contact sync", created: "2026-09-20 02:26", createdBy: "svc_backup", schedule: "Daily 02:30", action: "Export the resident contact list (name, service address, phone, account number) to sftp://203.0.113.57/incoming/", lastRun: "2026-09-20 02:31", lastResult: "OK, 1,204 records sent", desc: "Sync contacts to the county backup provider. flag{persistence-hides-in-schedules}" },
    { name: "Session cleanup", created: "2018-01-09", createdBy: "setup", schedule: "Hourly", action: "Remove expired sign-in sessions", lastRun: "2026-09-20 06:00", lastResult: "OK", desc: "Housekeeping." }
  ],

  uploads: [
    { file: "flushing-schedule-sep.pdf", t: "2026-09-19 15:14", user: "rtorres", size: "112 KB", where: "documents/" },
    { file: "verify.html", t: "2026-09-20 02:19", user: "svc_backup", size: "4 KB", where: "site root (public)" }
  ],

  // Plant controls access attempts (the control system keeps its own log).
  controlAttempts: [
    { t: "2026-09-19 22:01:02", user: "plant_ops",  ip: "198.51.100.77", result: "Allowed (MFA verified)" },
    { t: "2026-09-20 02:34:12", user: "svc_backup", ip: "203.0.113.57",  result: "Denied: MFA required, no enrolled device" },
    { t: "2026-09-20 02:35:01", user: "svc_backup", ip: "203.0.113.57",  result: "Denied: MFA required, no enrolled device" },
    { t: "2026-09-20 02:36:27", user: "svc_backup", ip: "203.0.113.57",  result: "Denied: MFA required, no enrolled device. flag{mfa-held-the-line}" }
  ]
};

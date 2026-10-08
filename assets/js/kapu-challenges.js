/* Field Notebook catalog - MOCK SITE FOR TRAINING. Generated.
 * Flags are XOR-encrypted under each challenge's answer; nothing here is a plain flag. */
window.KAPU_CHALLENGES = {
 "meta": {
  "accent": "#1d4e89",
  "panelBg": "#0e2748",
  "panelCard": "#163c6a",
  "panelLine": "#2b5080",
  "panelInk": "#f6f4ee",
  "panelMuted": "#a9bbd0",
  "title": "Makani County Public Works",
  "slug": "makani-county-incident"
 },
 "items": [
  {
   "id": "hover-before-you-click",
   "code": "MC-01",
   "title": "Triage the phishing email",
   "diff": "Easy",
   "objective": "Open the phishing email. Enter the lookalike domain its link really goes to.",
   "learned": "A link's text and its real destination differ. Always check where a link actually goes.",
   "h": "f81ada15",
   "f": "2b2d2a2615010c19101c591b48160000114c154110550201190f0e10"
  },
  {
   "id": "defacement-can-be-quiet",
   "code": "MC-02",
   "title": "The quiet defacement",
   "diff": "Easy",
   "objective": "View the home page source. Enter the account that changed the banner.",
   "learned": "The page records who changed it and when: content history is first-class evidence.",
   "h": "f61538c0",
   "f": "353a22181905060d1413161b0631164c000a1b5d11134e2e1708061f08"
  },
  {
   "id": "unusual-ip-unusual-hour",
   "code": "MC-03",
   "title": "Correlate the off-hours sign-in",
   "diff": "Medium",
   "objective": "Read the authentication log. Enter the outside IP the clerk's account signed in from at 02:03.",
   "learned": "An off-hours sign-in from a new device, outside the network, with no MFA is the intrusion.",
   "h": "ba93e923",
   "f": "747c72694b5b5f44405b545b1f59430345404442464f591a5a5f465c4d"
  },
  {
   "id": "new-admin-at-2am",
   "code": "MC-04",
   "title": "Find the persistence account",
   "diff": "Medium",
   "objective": "Review the accounts. Enter the admin account created at 02:07.",
   "learned": "Creating a new admin account is how an intruder keeps access (create-account persistence).",
   "h": "f61538c0",
   "f": "353a2218190f061c5811171b0a314f00174647111e0b"
  },
  {
   "id": "persistence-hides-in-schedules",
   "code": "MC-05",
   "title": "Scheduled-task persistence and exfil",
   "diff": "Medium",
   "objective": "Review the scheduled tasks. Enter the name of the task that exports resident data.",
   "learned": "A scheduled task is both persistence and exfiltration: read what each job actually does.",
   "h": "5193e5e1",
   "f": "2825262f0f1c1c5210061d00040d17455e1107070b1a4a011a410a430b0a0a010d06075d"
  },
  {
   "id": "mfa-held-the-line",
   "code": "MC-06",
   "title": "Confirm the control system held",
   "diff": "Medium",
   "objective": "Check the plant control record. Enter the control (three letters) that blocked the attacker.",
   "learned": "MFA on the control system stopped lateral movement to the plant: the one control that held.",
   "h": "eeafd341",
   "f": "2b2a202a1d0c0b074c05030d094b1505034c010f0f081b"
  },
  {
   "id": "read-to-the-end",
   "code": "MC-07",
   "title": "Read the web log to the end",
   "diff": "Medium",
   "objective": "Read the web access log to the end. Enter the page residents were sent to that the audit log never saw.",
   "learned": "Different log layers record different events. Read to the end; the console's audit log is not the whole story.",
   "h": "5208f723",
   "f": "3029332e1d0b4b091040181948060103544b061010"
  },
  {
   "id": "lockout-stops-guessing",
   "code": "MC-08",
   "title": "Reconstruct the login-guessing run",
   "diff": "Hard",
   "objective": "Read the top of the authentication log. Enter the non-existent admin username the attacker guessed.",
   "learned": "Credential guessing from one address (T1110); account lockout or rate limiting stops it.",
   "h": "cebf258a",
   "f": "27282c2e15051c17190e011b5f121002191d441401171207061c0619"
  },
  {
   "id": "restore-from-known-good",
   "code": "MC-09",
   "title": "Scope and restore the defacement",
   "diff": "Hard",
   "objective": "Compare the content revisions. Enter the correct 24-hour emergency number to restore.",
   "learned": "Eradicate by restoring from a known-good revision, not by hand-editing the live page.",
   "h": "23f55510",
   "f": "7e7c796a4e47505e445e475515564a4258185e435f465b1d5f5f574948"
  },
  {
   "id": "assume-the-data-is-already-gone",
   "code": "MC-10",
   "title": "Recover the attacker's dropped config",
   "diff": "Hard",
   "objective": "Base64-decode the attacker's dropped config in verify.html and enter the decoded value.",
   "learned": "Because the export already ran, treat the resident data as exfiltrated and notify: disabling the task is not enough.",
   "h": "4fbe12c5",
   "f": "2334272e174c071c585f551e5958481c555259541a0c0b4b08005f110e494b1d54425e484c"
  },
  {
   "id": "tamper-evident-logs-win",
   "code": "MC-11",
   "title": "The log they could not erase",
   "diff": "Hard",
   "objective": "Filter the audit log to denied actions. Enter the action the attacker was denied against the log.",
   "learned": "A second-administrator control on log deletion kept the evidence intact: tamper-evident logging wins.",
   "h": "58a52534",
   "f": "22292d220f1141011f02164809131d0145021b4a080a0b165912490212"
  },
  {
   "id": "contain-then-recover",
   "code": "MC-12",
   "title": "Contain, then recover",
   "diff": "Hard",
   "objective": "Build a correct response plan (five essential actions, none harmful). Enter the number of essential actions.",
   "learned": "Order matters: preserve, contain, eradicate, recover, communicate. Close every foothold before cleaning up.",
   "h": "300ca0d0",
   "f": "737974724e565a5b41545c5b18415d505b184750565a43504748"
  }
 ]
};

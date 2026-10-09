export type ProjectImage = {
  src: string
  alt: string
  caption: string
  title: string
  description: string
  step?: string
  tool?: string
  width: number
  height: number
}
export type AutomationProject = {
  id: string
  title: string
  shortTitle: string
  platform: 'Make.com' | 'Zapier'
  featured?: boolean
  disclaimer?: string
  type: string
  overview: string
  cardOverview?: string
  troubleshooting?: string
  galleryLayout?: 'featured-first'
  simpleLightbox?: boolean
  video?: { url: string; embedUrl: string; description: string }
  problem: string
  workflow: string
  implementation: string
  safeguards: string
  value: string
  steps: string[]
  tools: string[]
  images: ProjectImage[]
}
export const projects: AutomationProject[] = [
  {
    "id": "dental-appointment",
    "title": "Automated Appointment Approval & Status Sync",
    "shortTitle": "Automated Appointment Approval & Status Sync",
    "platform": "Make.com",
    "type": "Self-built portfolio project",
    "overview": "Calendly intake, centralized records, approval routing, patient communication, and appointment-status synchronization.",
    "problem": "Manual scheduling work and inconsistently updated appointment records create administrative overhead for dental practices.",
    "workflow": "A new Calendly booking triggers the workflow, which captures the patient's appointment into a centralized Google Sheets tracker and notifies the dentist with a simple approve/decline action.",
    "implementation": "Make.com routes the dentist's approval or rescheduling decision, then automates the matching confirmation or rescheduling email back to the patient. Status changes and cancellations are synchronized back to the tracker.",
    "safeguards": "Includes workflow safeguards for temporary service or connection failures, so a dropped connection doesn't leave an appointment record out of sync.",
    "value": "Designed to reduce administrative workload and the risk of missed appointment updates, and to give dental staff a more organized way to manage the daily appointment flow.",
    "steps": [
      "Calendly booking",
      "Google Sheets tracker",
      "Dentist approval",
      "Patient email / status sync"
    ],
    "tools": [
      "Make.com",
      "Calendly",
      "Google Sheets",
      "Gmail"
    ],
    "images": [
      {
        "src": "/projects/dental-appointment/image-01.webp",
        "alt": "Scenario A — new request — Dental appointment management",
        "caption": "New Calendly booking is captured, logged to Google Sheets, and sent to the dentist for approval.",
        "width": 1818,
        "height": 914,
        "title": "Scenario A",
        "description": "New Calendly booking is captured, logged to Google Sheets, and sent to the dentist for approval."
      },
      {
        "src": "/projects/dental-appointment/image-02.webp",
        "alt": "Approval email — Dental appointment management",
        "caption": "One-click approve / reject email the dentist receives for each new appointment request.",
        "width": 1587,
        "height": 730,
        "title": "Approval email",
        "description": "One-click approve / reject email the dentist receives for each new appointment request."
      },
      {
        "src": "/projects/dental-appointment/image-03.webp",
        "alt": "Scenario B — approval routing — Dental appointment management",
        "caption": "Router sends the patient the correct confirmation or rejection message based on the dentist's decision.",
        "width": 1820,
        "height": 908,
        "title": "Scenario B",
        "description": "Router sends the patient the correct confirmation or rejection message based on the dentist's decision."
      },
      {
        "src": "/projects/dental-appointment/image-04.webp",
        "alt": "Scenario C — cancellation listener — Dental appointment management",
        "caption": "Listens for cancellations, updates the sheet, and notifies the team that a slot has opened — with automatic retries on failure.",
        "width": 1820,
        "height": 916,
        "title": "Scenario C",
        "description": "Listens for cancellations, updates the sheet, and notifies the team that a slot has opened — with automatic retries on failure."
      }
    ]
  },
  {
    "id": "ai-lead-management",
    "title": "AI Lead Qualification & Priority Routing",
    "shortTitle": "AI Lead Qualification & Priority Routing",
    "platform": "Make.com",
    "type": "Self-built portfolio project",
    "overview": "AI-assisted lead evaluation, CRM updates, personalized follow-up drafting, and priority alerts.",
    "problem": "Manual lead handling leads to delayed responses, scattered records, and a higher risk of missing high-priority prospects.",
    "workflow": "A webhook-based intake receives the lead the moment it comes in, and Gemini AI processes the prospect information to assess quality and priority.",
    "implementation": "Make.com records structured lead information in Google Sheets, drafts a personalized follow-up email, and sends a Telegram alert for high-priority leads.",
    "safeguards": "Includes retry/error-handling logic for temporary database interruptions — the workflow retries the failed step three times at 15-minute intervals before giving up.",
    "value": "Helps minimize response delays, keeps lead records structured and centralized, and reduces the repetitive manual work of triaging incoming leads.",
    "steps": [
      "Webhook intake",
      "Gemini qualification",
      "Google Sheets CRM",
      "Gmail draft / Telegram alert"
    ],
    "tools": [
      "Make.com",
      "Gemini AI",
      "Webhooks",
      "Google Sheets",
      "Gmail",
      "Telegram"
    ],
    "images": [
      {
        "src": "/projects/ai-lead-management/image-01.webp",
        "alt": "Make.com scenario — AI lead management",
        "caption": "Webhook → Gemini AI qualification → router → CRM sheet, email, and Telegram alert, with a retry handler on the database step.",
        "width": 1915,
        "height": 924,
        "title": "Make.com scenario",
        "description": "Webhook → Gemini AI qualification → router → CRM sheet, email, and Telegram alert, with a retry handler on the database step."
      },
      {
        "src": "/projects/ai-lead-management/image-02.webp",
        "alt": "CRM sheet output — AI lead management",
        "caption": "Qualified / not-qualified leads logged automatically with the AI's reasoning for each decision.",
        "width": 1845,
        "height": 710,
        "title": "CRM sheet output",
        "description": "Qualified / not-qualified leads logged automatically with the AI's reasoning for each decision."
      },
      {
        "src": "/projects/ai-lead-management/image-03.webp",
        "alt": "Hot lead alert — AI lead management",
        "caption": "Real-time Telegram notification the moment a high-budget lead comes in.",
        "width": 784,
        "height": 916,
        "title": "Hot lead alert",
        "description": "Real-time Telegram notification the moment a high-budget lead comes in."
      }
    ]
  },
  {
    "id": "ecommerce-order-processing",
    "title": "Automated Order Processing & Exception Routing",
    "shortTitle": "Automated Order Processing & Exception Routing",
    "platform": "Make.com",
    "type": "Self-built portfolio project",
    "overview": "Order logging, AI delivery-note classification, confirmation emails, and high-value order flagging.",
    "problem": "Manual order processing creates data-entry bottlenecks, delays confirmations, and risks missing special delivery instructions.",
    "workflow": "Incoming customer orders are recorded automatically, and AI classifies the delivery instructions attached to each order.",
    "implementation": "Make.com generates an automated confirmation email and applies conditional logic to flag high-value orders for priority review.",
    "safeguards": "Handles invalid customer email addresses without stopping the main workflow, isolating that fault so the rest of the run completes.",
    "value": "Designed to reduce manual data entry, keep delivery instructions from getting missed, and give faster visibility into priority orders.",
    "steps": [
      "New Google Sheets row",
      "Gemini delivery classification",
      "Priority routing",
      "Confirmation email"
    ],
    "tools": [
      "Make.com",
      "Gemini AI",
      "Google Sheets",
      "Gmail"
    ],
    "images": [
      {
        "src": "/projects/ecommerce-order-processing/image-01.webp",
        "alt": "Make.com scenario — E-commerce order processing",
        "caption": "Watches new sheet rows, classifies delivery notes with Gemini AI, and routes high-value / priority orders down separate email branches.",
        "width": 1910,
        "height": 922,
        "title": "Make.com scenario",
        "description": "Watches new sheet rows, classifies delivery notes with Gemini AI, and routes high-value / priority orders down separate email branches."
      },
      {
        "src": "/projects/ecommerce-order-processing/image-02.webp",
        "alt": "Order log sheet — E-commerce order processing",
        "caption": "Orders captured with product, quantity, pricing, and delivery notes used for AI classification.",
        "width": 1914,
        "height": 923,
        "title": "Order log sheet",
        "description": "Orders captured with product, quantity, pricing, and delivery notes used for AI classification."
      }
    ]
  },
  {
    "id": "receipt-expense-automation",
    "title": "AI Receipt Extraction & Structured Expense Logging",
    "shortTitle": "AI Receipt Extraction & Structured Expense Logging",
    "platform": "Make.com",
    "type": "Self-built portfolio project",
    "overview": "Receipt attachment processing, AI data extraction, validation, and structured expense records.",
    "problem": "Manually typing expense details from receipt images into spreadsheets is slow and error-prone.",
    "workflow": "Receipt attachments arriving by email are picked up automatically, and Gemini Vision AI extracts the date, vendor, line items, and totals.",
    "implementation": "Make.com structures the extracted information and records it in Google Sheets, applying validation filters against the extracted fields.",
    "safeguards": "Includes reconnect/error-handling logic and validation that prevents invalid or junk entries from entering the workflow where possible.",
    "value": "Reduces manual entry from receipts and helps keep the expense log limited to validated, structured records.",
    "steps": [
      "Email receipt attachment",
      "Gemini Vision extraction",
      "Validation filters",
      "Google Sheets expense log"
    ],
    "tools": [
      "Make.com",
      "Gemini Vision AI",
      "Gmail",
      "Google Sheets"
    ],
    "images": [
      {
        "src": "/projects/receipt-expense-automation/image-01.webp",
        "alt": "Make.com scenario — Receipt & expense extraction",
        "caption": "Watches for emailed receipts, runs Gemini Vision AI to check is_receipt and extract line items, then logs clean records.",
        "width": 1908,
        "height": 929,
        "title": "Make.com scenario",
        "description": "Watches for emailed receipts, runs Gemini Vision AI to check is_receipt and extract line items, then logs clean records."
      },
      {
        "src": "/projects/receipt-expense-automation/image-02.webp",
        "alt": "Expense sheet output — Receipt & expense extraction",
        "caption": "Extracted date, merchant, labor, and materials values logged automatically from each receipt image.",
        "width": 1403,
        "height": 600,
        "title": "Expense sheet output",
        "description": "Extracted date, merchant, labor, and materials values logged automatically from each receipt image."
      }
    ]
  },
  {
    "id": "ai-lead-qualification-sales-routing",
    "video": {
      "url": "https://www.loom.com/share/ec6ba62d11ec4cc4973a6e120afb53b5",
      "embedUrl": "https://www.loom.com/embed/ec6ba62d11ec4cc4973a6e120afb53b5",
      "description": "Walkthrough of the lead automation covering structured intake, AI qualification, CRM updates, conditional routing, sales tasks, notifications, and follow-up."
    },
    "title": "AI-Powered Lead Qualification & Sales Routing",
    "shortTitle": "AI-Powered Lead Qualification & Sales Routing",
    "platform": "Zapier",
    "type": "Self-built portfolio project",
    "overview": "Structured lead intake, duplicate protection, AI scoring, CRM routing, sales follow-up, and exception handling.",
    "problem": "Inbound web leads can require manual cleanup, duplicate checking, qualification, prioritization, and follow-up. Without automation, CRM data becomes inconsistent, duplicate contacts accumulate, sales teams review every lead manually, high-value prospects may not receive immediate attention, and unqualified leads consume sales time.",
    "workflow": "Typeform captures structured lead information and triggers the Zapier workflow. The automation cleans and normalizes incoming data, checks Airtable for an existing contact, creates or updates the lead record, evaluates the lead using AI, stores the qualification result, and routes the lead through the appropriate follow-up path.",
    "implementation": "AI returns structured outputs such as lead score, qualification category, summary, and recommended action. Conditional routing then sends each lead through the appropriate path. High-priority leads can update Airtable, create an Asana task, notify the sales team in Slack, and trigger an acknowledgement email. Qualified leads can be added to a structured follow-up process. Unqualified leads remain recorded in Airtable and receive the appropriate automated response without creating unnecessary priority tasks.",
    "safeguards": "Airtable looks up the lead’s email before creating a record, updating an existing contact instead of duplicating it. Required inputs and structured AI outputs support consistent routing. A dedicated fallback/error path sends a failed-automation notification in Slack and flags the Airtable record for manual review. Records are preserved for review so failed AI actions do not disappear silently.",
    "value": "Designed to keep CRM data consistent, reduce repetitive lead review, surface high-priority prospects faster, and create structured sales follow-up.",
    "steps": [
      "Typeform submission",
      "Clean and normalize data",
      "Airtable lookup / upsert",
      "AI qualification and scoring",
      "Save qualification result",
      "Route by qualification",
      "Create sales task / notification",
      "Send appropriate email response",
      "Handle exceptions and failed actions"
    ],
    "tools": [
      "Zapier",
      "AI by Zapier",
      "Typeform",
      "Airtable",
      "Asana",
      "Slack",
      "Gmail"
    ],
    "images": [
      {
        "src": "/projects/ai-lead-qualification-sales-routing/image-01.webp",
        "alt": "End-to-End Zapier Workflow — AI lead qualification & sales routing",
        "caption": "Complete Zapier workflow covering intake, cleanup, AI qualification, routing, notifications, sales tasks, email responses, and failure handling.",
        "width": 2000,
        "height": 2297,
        "title": "Complete Automation Workflow",
        "description": "Complete Zapier workflow covering intake, cleanup, AI qualification, routing, notifications, sales tasks, email responses, and failure handling.",
        "tool": "Zapier"
      },
      {
        "src": "/projects/ai-lead-qualification-sales-routing/image-02.webp",
        "alt": "Structured Lead Intake — AI lead qualification & sales routing",
        "caption": "Typeform captures the structured lead information used for automated qualification and routing.",
        "width": 797,
        "height": 2304,
        "title": "Structured Lead Intake",
        "description": "Typeform captures the structured lead information used for automated qualification and routing.",
        "tool": "Typeform"
      },
      {
        "src": "/projects/ai-lead-qualification-sales-routing/image-03.webp",
        "alt": "AI Lead Scoring & Qualification — AI lead qualification & sales routing",
        "caption": "AI evaluates incoming lead data and returns structured scoring, qualification, summary, and recommended actions.",
        "width": 998,
        "height": 827,
        "title": "AI Qualification",
        "description": "AI evaluates incoming lead data and returns structured scoring, qualification, summary, and recommended actions.",
        "tool": "AI by Zapier"
      },
      {
        "src": "/projects/ai-lead-qualification-sales-routing/image-04.webp",
        "alt": "Automated Lead Management CRM — AI lead qualification & sales routing",
        "caption": "Airtable stores lead data, qualification results, recommended actions, and workflow status.",
        "width": 1878,
        "height": 382,
        "title": "CRM / Lead Record",
        "description": "Airtable stores lead data, qualification results, recommended actions, and workflow status.",
        "tool": "Airtable"
      },
      {
        "src": "/projects/ai-lead-qualification-sales-routing/image-05.webp",
        "alt": "Automated Sales Follow-Up — AI lead qualification & sales routing",
        "caption": "High-priority and qualified leads automatically create structured follow-up tasks in Asana.",
        "width": 1717,
        "height": 884,
        "title": "Sales Follow-up Task",
        "description": "High-priority and qualified leads automatically create structured follow-up tasks in Asana.",
        "tool": "Asana"
      },
      {
        "src": "/projects/ai-lead-qualification-sales-routing/image-06.webp",
        "alt": "Real-Time VIP Lead Alert — AI lead qualification & sales routing",
        "caption": "Priority leads trigger Slack notifications with key lead information and recommended next actions.",
        "width": 1863,
        "height": 857,
        "title": "Priority Lead Notification",
        "description": "Priority leads trigger Slack notifications with key lead information and recommended next actions.",
        "tool": "Slack"
      }
    ],
    "featured": true,
    "disclaimer": "Built as a self-directed portfolio project. The business benefits described above are design goals based on the implemented workflow, not measured client results."
  },
  {
    "id": "customer-support",
    "video": {
      "url": "https://www.loom.com/share/5af47c2d5d634646b3b16aeca0971696",
      "embedUrl": "https://www.loom.com/embed/5af47c2d5d634646b3b16aeca0971696",
      "description": "Walkthrough of the customer support automation covering Gmail intake, AI triage, HubSpot customer lookup, duplicate protection, Trello ticket creation, AI-assisted response drafting, and Slack escalation for high-priority issues."
    },
    "title": "AI-Powered Customer Support & Ticket Management Automation",
    "shortTitle": "AI Customer Support & Ticket Automation",
    "platform": "Zapier",
    "type": "Self-built portfolio project",
    "overview": "AI-assisted email triage, customer record management, duplicate protection, ticket creation, response drafting, and priority escalation.",
    "cardOverview": "AI-assisted email triage, CRM lookup, duplicate protection, ticket creation, response drafting, and urgent support alerts.",
    "problem": "Customer support teams often spend significant time manually reviewing incoming emails, identifying the type and urgency of each issue, maintaining customer records, creating tickets, and preparing replies.\n\nImportant customer concerns can also be overlooked if every request is processed the same way.",
    "workflow": "The workflow monitors incoming Gmail support emails and sends each message through AI triage.\n\nAI classifies the request, assigns priority and sentiment, creates a summary, and recommends an action.\n\nThe workflow then searches HubSpot for the customer, checks the Gmail Message ID against Storage by Zapier to prevent duplicate processing, creates a Trello support ticket, stores the processed Message ID, drafts a customer response for human review, and escalates High or Urgent tickets to Slack.",
    "implementation": "AI by Zapier analyzes each incoming support email and returns structured fields including category, priority, sentiment, summary, and recommended action.\n\nHubSpot is used to locate or create the related customer record.\n\nStorage by Zapier checks the Gmail Message ID before ticket creation so the same email is not processed twice.\n\nA Trello card becomes the support ticket and contains the customer context, AI classification, original message, and HubSpot reference.\n\nAI then prepares a response, but Gmail saves it only as a draft so a support agent can review and approve the message before it is sent.\n\nLow and Medium priority tickets remain in the normal support workflow. High and Urgent tickets continue to Slack for additional visibility.",
    "safeguards": "The workflow includes multiple safeguards to reduce duplicate processing and uncontrolled AI actions.\n\nThe customer is searched in HubSpot before a new contact is created.\n\nThe Gmail Message ID is checked against Storage by Zapier before a Trello ticket is created, and the Message ID is stored only after successful ticket creation.\n\nAI-generated responses are saved as Gmail drafts rather than being automatically sent.\n\nDuring testing, Gmail drafts initially triggered the workflow again. The Gmail search condition was updated to monitor inbox messages only, preventing automation-created drafts from retriggering the process.",
    "troubleshooting": "During testing, automation-generated Gmail drafts were initially satisfying the email trigger and creating a loop.\n\nI traced the issue to the Gmail search condition and changed the trigger to monitor inbox messages only.\n\nThis prevented automation-created drafts from retriggering the workflow.\n\nGmail Message ID duplicate protection remains as an additional safeguard.",
    "value": "Designed to reduce repetitive email triage, organize support requests consistently, maintain cleaner customer records, surface urgent concerns faster, prepare replies more efficiently, and prevent duplicate ticket creation.",
    "disclaimer": "Built as a self-directed portfolio project. The business benefits described above are design goals based on the implemented workflow, not measured client results.",
    "steps": [
      "Gmail support email",
      "AI classify request & urgency",
      "HubSpot contact lookup",
      "Check duplicate Message ID",
      "Continue only if email is new",
      "Create Trello support ticket",
      "Mark email as processed",
      "Draft customer response",
      "Create Gmail draft",
      "Check High / Urgent priority",
      "Send Slack alert"
    ],
    "tools": [
      "Zapier",
      "AI by Zapier",
      "Gmail",
      "HubSpot",
      "Storage by Zapier",
      "Filter by Zapier",
      "Trello",
      "Slack"
    ],
    "images": [
      {
        "src": "/projects/customer-support/image-01.png",
        "alt": "Complete Customer Support Workflow — Customer Support & Ticket Management Automation",
        "caption": "Complete Zapier workflow covering Gmail intake, AI triage, HubSpot contact lookup, duplicate protection, Trello ticket creation, response drafting, priority filtering, and Slack escalation.",
        "title": "Complete Customer Support Workflow",
        "description": "Complete Zapier workflow covering Gmail intake, AI triage, HubSpot contact lookup, duplicate protection, Trello ticket creation, response drafting, priority filtering, and Slack escalation.",
        "width": 5092,
        "height": 6737
      },
      {
        "src": "/projects/customer-support/image-02.png",
        "alt": "Structured Support Ticket — Customer Support & Ticket Management Automation",
        "caption": "Trello receives a structured ticket containing customer details, category, priority, sentiment, summary, recommended action, original message, and the related HubSpot contact.",
        "title": "Structured Support Ticket",
        "description": "Trello receives a structured ticket containing customer details, category, priority, sentiment, summary, recommended action, original message, and the related HubSpot contact.",
        "width": 970,
        "height": 769
      },
      {
        "src": "/projects/customer-support/image-03.png",
        "alt": "Urgent Support Alert — Customer Support & Ticket Management Automation",
        "caption": "High and Urgent support requests trigger a Slack alert containing the key ticket details, recommended action, and links to the related Trello and HubSpot records.",
        "title": "Urgent Support Alert",
        "description": "High and Urgent support requests trigger a Slack alert containing the key ticket details, recommended action, and links to the related Trello and HubSpot records.",
        "width": 1822,
        "height": 790
      }
    ],
    "galleryLayout": "featured-first",
    "simpleLightbox": true
  }
]

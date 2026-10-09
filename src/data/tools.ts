export type Tool = { name: string; iconPath: string; category: string }
export const tools: Tool[] = [
  {
    "name": "Make.com",
    "iconPath": "/logos/make.svg",
    "category": "Automation Platforms"
  },
  {
    "name": "Zapier",
    "iconPath": "/logos/zapier.svg",
    "category": "Automation Platforms"
  },
  {
    "name": "AI by Zapier",
    "iconPath": "/logos/ai-by-zapier.svg",
    "category": "AI"
  },
  {
    "name": "Gemini AI",
    "iconPath": "/logos/gemini.svg",
    "category": "AI"
  },
  {
    "name": "Airtable",
    "iconPath": "/logos/airtable.svg",
    "category": "Data / CRM"
  },
  {
    "name": "Google Sheets",
    "iconPath": "/logos/google-sheets.svg",
    "category": "Data / CRM"
  },
  {
    "name": "Typeform",
    "iconPath": "/logos/typeform.svg",
    "category": "Forms / Intake"
  },
  {
    "name": "Asana",
    "iconPath": "/logos/asana.svg",
    "category": "Communication / Collaboration"
  },
  {
    "name": "Slack",
    "iconPath": "/logos/slack.svg",
    "category": "Communication / Collaboration"
  },
  {
    "name": "Google Forms",
    "iconPath": "/logos/google-forms.svg",
    "category": "Forms / Intake"
  },
  {
    "name": "Calendly",
    "iconPath": "/logos/calendly.svg",
    "category": "Forms / Intake"
  },
  {
    "name": "Gmail",
    "iconPath": "/logos/gmail.svg",
    "category": "Communication / Collaboration"
  },
  {
    "name": "Telegram",
    "iconPath": "/logos/telegram.svg",
    "category": "Communication / Collaboration"
  },
  {
    "name": "Google Drive",
    "iconPath": "/logos/google-drive.svg",
    "category": "Infrastructure / Integration"
  },
  {
    "name": "Webhooks",
    "iconPath": "/logos/webhooks.svg",
    "category": "Infrastructure / Integration"
  }
]
export const featuredTools = tools.slice(0, 9)
export const toolCategories = ['Automation Platforms', 'AI', 'Data / CRM', 'Forms / Intake', 'Communication / Collaboration', 'Infrastructure / Integration']

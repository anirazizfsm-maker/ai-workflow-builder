# Backend code for Lethimdo

## 1) What I will deliver here (copy/paste-ready)

- `package.json` (for frontend/backend dependencies)
- Convex schema definitions (`src/convex/schema.ts`)
- Convex server-side functions (FAQ CRUD already present; add auth, stripe handler, ai-builder parse/validate, workflows)
- Next.js API routes (Stripe webhook, ai-builder endpoints that call the LLM)
- Frontend pages skeletons: Landing, AI Builder, Dashboard (React + Tailwind-ready)
- Example LLM prompt/function JSON for OpenAI function-calling
- README: environment variables, how to run locally (stripe listen), test plan, deployment hints

## 2) Repo structure (single-app/monorepo suggested)

```jsx
lethimdo/
├─ README.md
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ src/
│  ├─ convex/
│  │  ├─ schema.ts
│  │  ├─ faqs.ts
│  │  ├─ auth.ts
│  │  ├─ stripe.ts
│  │  ├─ aiBuilder.ts
│  │  └─ workflows.ts
│  ├─ pages/
│  │  ├─ index.tsx
│  │  ├─ ai-builder.tsx
│  │  ├─ dashboard.tsx
│  │  └─ api/
│  │     ├─ openai-proxy.ts
│  │     ├─ stripe-webhook.ts
│  │     └─ forward-stripe.ts
│  ├─ components/
│  │  ├─ ChatbotWidget.tsx
│  │  └─ WorkflowCard.tsx
│  ├─ utils/
│  │  └─ openai.ts
│  └─ styles/
│     └─ globals.css
└─ assets/
   └─ (logo, hero Lottie, demo GIF)

```

## 3) Core files

> Note: code uses TypeScript + Next.js + Convex function style. If your team uses plain JS or other frameworks, the logic is the same — you can convert.
**package.json**
> 

```jsx
{
  "name": "lethimdo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "convex": "^0.7.0",
    "stripe": "^12.0.0",
    "openai": "^4.0.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}

```

## .env.example  (copy to `.env.local` and fill)

```jsx
# Convex (if using Convex Cloud)
CONVEX_URL={{CONVEX_URL}}
CONVEX_CLIENT_KEY={{CONVEX_CLIENT_KEY}}

# Stripe
STRIPE_SECRET_KEY={{STRIPE_SECRET_KEY}}
STRIPE_WEBHOOK_SECRET={{STRIPE_WEBHOOK_SECRET}}

# OpenAI
OPENAI_API_KEY={{OPENAI_API_KEY}}

# Pinecone (optional for RAG)
PINECONE_API_KEY={{PINECONE_API_KEY}}
PINECONE_ENVIRONMENT={{PINECONE_ENVIRONMENT}}
PINECONE_INDEX={{PINECONE_INDEX}}

# Google OAuth (for Gmail/Drive integrations later)
GOOGLE_CLIENT_ID={{GOOGLE_CLIENT_ID}}
GOOGLE_CLIENT_SECRET={{GOOGLE_CLIENT_SECRET}}

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

```

## src/convex/schema.ts

```jsx
// Convex schema definitions
export const faqs = {
  question: "string",
  answer: "string",
  createdBy: "string",
  createdAt: "number"
};

export const users = {
  email: "string",
  role: "string", // 'admin' | 'user'
  createdAt: "number"
};

export const subscriptions = {
  userId: "string",
  stripeCustomerId: "string",
  stripeSubscriptionId: "string",
  plan: "string",
  status: "string",
  currentPeriodEnd: "number"
};

export const invoices = {
  userId: "string",
  stripeInvoiceId: "string",
  pdfUrl: "string",
  amount: "number",
  status: "string",
  createdAt: "number"
};

export const workflow_templates = {
  slug: "string",
  name: "string",
  json_schema: "json",
  preview: "string",
  min_plan: "string",
  createdAt: "number"
};

export const workflows = {
  orgId: "string",
  templateId: "string",
  params: "json",
  status: "string",
  n8nWorkflowId: "number",
  createdAt: "number"
};

```

If using Convex's schema helpers, convert to `defineTable` and types per Convex docs.

src/convex/faqs.ts

(You said you added these already — include typical CRUD)

```jsx
import { query, mutation } from "convex/server";

export const getAllFAQs = query(async ({ db }) => {
  return await db.table("faqs").order("createdAt", "desc").collect();
});

export const createFAQ = mutation(async ({ db, auth }, { question, answer }) => {
  const user = await auth.getUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  const now = Date.now();
  const id = await db.insert("faqs", { question, answer, createdBy: user.id, createdAt: now });
  return { id, question, answer, createdAt: now };
});

export const updateFAQ = mutation(async ({ db, auth }, { id, question, answer }) => {
  const user = await auth.getUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  await db.patch("faqs", id, { question, answer });
  return { id };
});

export const deleteFAQ = mutation(async ({ db, auth }, { id }) => {
  const user = await auth.getUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  await db.delete("faqs", id);
  return { id };
});

```

## **src/convex/auth.ts**

(simple helper stubs - depends on Convex auth)

```jsx
import { query } from "convex/server";

export const getUserProfile = query(async ({ db, auth }) => {
  const user = await auth.getUser();
  if (!user) return null;
  const profile = await db.get("users", user.id);
  return profile;
});

```

### src/convex/stripe.ts

(convex function to process Stripe webhook events)

```jsx
import { mutation } from "convex/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-01" });

export const handleStripeEvent = mutation(async ({ db }, { event }) => {
  const e = event;
  switch (e.type) {
    case "checkout.session.completed": {
      const session = e.data.object;
      // Map session.customer_email to user and create subscription record
      // Implementation detail: find user by email or create guest record
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = e.data.object;
      await db.insert("invoices", {
        userId: null, // map via metadata or email
        stripeInvoiceId: invoice.id,
        pdfUrl: invoice.invoice_pdf || "",
        amount: invoice.amount_paid || 0,
        status: "paid",
        createdAt: Date.now()
      });
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // update subscription table
      break;
    }
    default:
      break;
  }
  return { ok: true };
});

```

### src/convex/aiBuilder.ts (parse NL → call OpenAI proxy)

```jsx
import { mutation } from "convex/server";
import axios from "axios";

export const parseNaturalLanguage = mutation(async ({}, { orgId, text }) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/openai-proxy`, { text, orgId }, {
    headers: { "Content-Type": "application/json" }
  });
  return res.data;
});

```

### `src/convex/workflows.ts` (create + metadata)

```jsx
import { mutation, query } from "convex/server";

export const createWorkflow = mutation(async ({ db }, { orgId, templateId, params, activate = false }) => {
  const now = Date.now();
  const id = await db.insert("workflows", { orgId, templateId, params, status: activate ? "activating" : "draft", n8nWorkflowId: null, createdAt: now });
  // You will have an execution broker that listens for new workflows and imports into n8n
  return { id };
});

export const getWorkflowsForOrg = query(async ({ db }, { orgId }) => {
  return await db.table("workflows").filter(w => w.orgId === orgId).collect();
});

```

### `src/pages/api/openai-proxy.ts` (LLM function-calling proxy)

```jsx
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const functionSpec = {
  name: "generate_workflow",
  description: "Generate a JSON workflow from a natural language request",
  parameters: {
    type: "object",
    properties: {
      template_id: { type: "string" },
      confidence: { type: "number" },
      reason: { type: "string" },
      params: { type: "object" },
      preview_steps: { type: "array", items: { type: "string" } }
    },
    required: ["template_id", "confidence", "reason", "params", "preview_steps"]
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { text, orgId } = req.body;
    const messages = [
      { role: "system", content: `You are Lethimdo's AI Workflow Builder. Prefer templates: ai-agent-chat, customer-support-gmail-faq, rag-pipeline-chatbot. Use placeholders for missing credentials like {{gmail_credential_id}}.` },
      { role: "user", content: text }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      functions: [functionSpec],
      function_call: { name: "generate_workflow" },
      max_tokens: 800
    });

    const call = response.choices?.[0]?.message?.function_call;
    if (!call) return res.status(200).json({ error: "No function call", raw: response });

    const args = JSON.parse(call.arguments || "{}");
    return res.status(200).json(args);
  } catch (err: any) {
    console.error("openai-proxy error", err);
    res.status(500).json({ error: err.message });
  }
}

```

### 10) `src/pages/api/stripe-webhook.ts` (verify & forward)

```jsx
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import axios from "axios";

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-01" });

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Stripe webhook signature error", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Forward to Convex function via internal endpoint (forward-stripe) which will call Convex mutation
  await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/forward-stripe`, { event });

  res.status(200).json({ received: true });
}

```

### `src/pages/api/forward-stripe.ts` (forwards to Convex mutation)

```jsx
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { event } = req.body;
    // Call your Convex HTTP function endpoint that wraps handleStripeEvent
    // Replace CONVEX_FUNCTION_URL with your Convex function endpoint (if available)
    await axios.post(process.env.CONVEX_FUNCTION_URL!, { event });
    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("forward-stripe error", err);
    res.status(500).json({ error: err.message });
  }
}

```

If your Convex account exposes HTTP endpoints, set `CONVEX_FUNCTION_URL` env var to call the convex mutation. Otherwise, have a small server-side Convex client call inside this route.

### `src/pages/ai-builder.tsx` (Frontend UI)

```jsx
import React, { useState } from "react";
import axios from "axios";

export default function AIBuilderPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await axios.post("/api/openai-proxy", { text });
      setResult(res.data);
    } catch (e) {
      console.error(e);
      alert("Error generating workflow");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">AI Builder</h1>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Describe your workflow" className="w-full h-40 mt-4 p-3 rounded bg-slate-800 text-white" />
      <div className="mt-4">
        <button onClick={handleGenerate} className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded text-black">{loading ? "Generating..." : "Generate Workflow"}</button>
      </div>

      {result && (
        <div className="mt-6 bg-slate-900 p-4 rounded">
          <h3 className="font-semibold">Template: {result.template_id} (confidence {result.confidence})</h3>
          <p>{result.reason}</p>
          <h4 className="mt-3 font-medium">Preview Steps</h4>
          <ol className="list-decimal list-inside">
            {result.preview_steps?.map((s:any, i:number) => <li key={i}>{s}</li>)}
          </ol>
          <pre className="mt-3 text-xs bg-black p-3 rounded overflow-auto">{JSON.stringify(result.params, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

```

### `src/pages/index.tsx` (Landing skeleton)

```jsx
import React from "react";
import Link from "next/link";
import ChatbotWidget from "../components/ChatbotWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#07080a] to-[#061225] text-white">
      <header className="flex justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-yellow-500" />
          <span className="text-xl font-semibold">lethimdo.com</span>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/ai-builder">AI Builder</Link>
          <Link href="/dashboard">Dashboard</Link>
          <button className="px-4 py-2 border rounded">Start Free Trial</button>
        </nav>
      </header>

      <section className="px-12 py-24 grid grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-6xl font-bold bg-clip-text text-transparent" style={{ background: "linear-gradient(90deg,#00e5ff,#7b61ff)" }}>
            Automation Solved. <br/> Plug, Play, and Grow.
          </h1>
          <p className="mt-6 max-w-xl text-lg">Automate business tasks with custom workflows. No-code. Plug and play.</p>
          <div className="mt-8">
            <Link href="/ai-builder">
              <a className="inline-block px-6 py-3 rounded-full border-2 border-yellow-500">Start Free Trial</a>
            </Link>
          </div>
        </div>
        <div>
          <div className="h-72 bg-slate-900 rounded p-6">Hero diagram / Lottie here</div>
        </div>
      </section>

      <ChatbotWidget />
    </main>
  );
}

```

### src/components/ChatbotWidget.tsx

```jsx
import React, { useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", right: 20, bottom: 20 }}>
      {open && (
        <div className="w-80 h-96 bg-slate-900 rounded p-3">
          <div className="font-bold">Help & FAQ</div>
          <div className="mt-3 text-sm">Ask anything about plans or try the AI Builder.</div>
          {/* implement chat UI to call /api/chat later */}
        </div>
      )}
      <button onClick={()=>setOpen(!open)} className="w-14 h-14 rounded-full bg-yellow-500">💬</button>
    </div>
  );
}

```

### src/utils/openai.ts

```jsx
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default client;

```

### `README.md` (complete instructions)

```jsx
# Lethimdo — Local Dev & Deployment Guide

## Overview
This project contains frontend (Next.js) + backend API routes + Convex functions skeletons for:
- FAQ CRUD (Convex)
- AI Builder (OpenAI function-calling proxy)
- Stripe webhook handling + forwarding to Convex
- Basic UI pages (landing, AI Builder, dashboard skeleton)

## Setup (local)
1. Clone repo and `cd lethimdo`
2. `npm install`
3. Copy `.env.example` → `.env.local` and fill values:
   - CONVEX_URL / CONVEX_CLIENT_KEY (if using Convex cloud)
   - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
   - OPENAI_API_KEY
   - NEXT_PUBLIC_BASE_URL (e.g. http://localhost:3000)
   - (optional) PINECONE keys
4. Start dev server:
   ```bash
   npm run dev

```

### For Stripe webhooks in dev:

```jsx
stripe listen --forward-to localhost:3000/api/stripe-webhook

```

### src/pages/api/openai-proxy.ts

1. Then test with Stripe test cards (4242...).

## Convex

- Deploy Convex functions and tables per Convex docs.
- Ensure Convex function endpoint (or internal HTTP) is available and set `CONVEX_FUNCTION_URL` if using forward-stripe route.

## Testing flows

- AI Builder: visit `/ai-builder` and try "Reply to Gmail messages using FAQ".
- Billing: Create Stripe checkout session (frontend integration not included—use Stripe Checkout or Stripe portal).
- Webhook: Confirm `invoice.payment_succeeded` events create invoice records in Convex (or inspect forwarded event).

## Deployment (production)

- Deploy Next.js app to Vercel or any Node host.
- Set production env vars in host dashboard.
- In Stripe, set webhook endpoint to `https://yourdomain.com/api/stripe-webhook`.
- Use Convex Cloud or deploy Convex functions to cloud environment.

## Notes

- This repo is a starter scaffold. Execution Broker (n8n) is a separate service: implement import flow there.
- Replace placeholders and secure secrets (do not commit).

```yaml

---

## 17) LLM System Prompt & Function JSON (paste into OpenAI / LLM setup)
**System prompt**

```

You are Lethimdo’s AI Workflow Builder.

Your job: convert user natural language into one of the curated templates:

- ai-agent-chat
- customer-support-gmail-faq
- rag-pipeline-chatbot

Rules:

- Prefer templates from the list. Do not invent unknown templates.
- Use placeholders for credentials like {{gmail_credential_id}}.
- Validate required params; if missing, ask the user.
- Return a JSON object via the function call `generate_workflow` with fields: template_id, confidence, reason, params, and preview_steps.

```yaml

**Function spec (JSON)**
```json
{
  "name": "generate_workflow",
  "description": "Generate a JSON workflow from a natural language request",
  "parameters": {
    "type": "object",
    "properties": {
      "template_id": { "type": "string" },
      "confidence": { "type": "number" },
      "reason": { "type": "string" },
      "params": { "type": "object" },
      "preview_steps": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["template_id", "confidence", "reason", "params", "preview_steps"]
  }
}

```

### src/pages/api/openai-proxy.ts

(Next API route that calls OpenAI — function-calling used here)

```jsx
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const functionSpec = {
  name: "generate_workflow",
  description: "Generate a JSON workflow from a natural language request",
  parameters: {
    type: "object",
    properties: {
      template_id: { type: "string" },
      confidence: { type: "number" },
      reason: { type: "string" },
      params: { type: "object" },
      preview_steps: { type: "array", items: { type: "string" } }
    },
    required: ["template_id", "confidence", "reason", "params", "preview_steps"]
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { text, orgId } = req.body;
    const messages = [
      { role: "system", content: `You are Lethimdo's AI Workflow Builder. Use the official templates (ai-agent-chat, customer-support-gmail-faq, rag-pipeline-chatbot). Use placeholder credentials when needed.` },
      { role: "user", content: text }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      functions: [functionSpec],
      function_call: { name: "generate_workflow" },
      max_tokens: 800
    });

    // The function call output:
    const call = response.choices?.[0]?.message?.function_call;
    if (!call) {
      return res.status(200).json({ error: "No function response", raw: response });
    }
    const args = JSON.parse(call.arguments);
    return res.status(200).json(args);
  } catch (err: any) {
    console.error("openai-proxy error", err);
    return res.status(500).json({ error: err.message });
  }

```

### src/pages/api/stripe-webhook.ts

(Next API route to verify webhook and forward to Convex mutation)

```jsx
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import axios from "axios";

export const config = {
  api: { bodyParser: false }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-01" });

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.log("Webhook signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // forward event to Convex via REST or call its http function (if using Convex's function endpoint)
  await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/forward-stripe`, { event });

  res.status(200).json({ received: true });
}

```

Note: `api/forward-stripe` is a local endpoint you can implement to call Convex mutation `handleStripeEvent`. Alternatively you can call Convex HTTP function directly if using Convex Cloud functions.

### src/pages/ai-builder.tsx

(A simplified UI for AI Builder)

```jsx
import React, { useState } from "react";
import axios from "axios";

export default function AIBuilderPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await axios.post("/api/openai-proxy", { text });
      setResult(res.data);
    } catch (e) {
      console.error(e);
      alert("Error generating workflow");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">AI Builder</h1>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Describe your workflow" className="w-full h-40 mt-4 p-3 rounded bg-slate-800 text-white" />
      <div className="mt-4">
        <button onClick={handleGenerate} className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded text-black">{loading ? "Generating..." : "Generate Workflow"}</button>
      </div>

      {result && (
        <div className="mt-6 bg-slate-900 p-4 rounded">
          <h3 className="font-semibold">Template: {result.template_id} (confidence {result.confidence})</h3>
          <p>{result.reason}</p>
          <h4 className="mt-3 font-medium">Preview Steps</h4>
          <ol className="list-decimal list-inside">
            {result.preview_steps?.map((s:any, i:number) => <li key={i}>{s}</li>)}
          </ol>
          <pre className="mt-3 text-xs bg-black p-3 rounded overflow-auto">{JSON.stringify(result.params, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

```

## src/pages/index.tsx (Landing skeleton)

```jsx
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#07080a] to-[#061225] text-white">
      <header className="flex justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-yellow-500" />
          <span className="text-xl font-semibold">lethimdo.com</span>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/ai-builder">AI Builder</Link>
          <Link href="/dashboard">Dashboard</Link>
          <button className="px-4 py-2 border rounded">Start Free Trial</button>
        </nav>
      </header>

      <section className="px-12 py-24 grid grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-6xl font-bold bg-clip-text text-transparent" style={{ background: "linear-gradient(90deg,#00e5ff,#7b61ff)" }}>
            Automation Solved. <br/> Plug, Play, and Grow.
          </h1>
          <p className="mt-6 max-w-xl text-lg">Automate business tasks with custom workflows. No-code. Plug and play.</p>
          <div className="mt-8">
            <Link href="/ai-builder">
              <a className="inline-block px-6 py-3 rounded-full border-2 border-yellow-500">Start Free Trial</a>
            </Link>
          </div>
        </div>
        <div>
          {/* placeholder for workflow diagram / hero image */}
          <div className="h-72 bg-slate-900 rounded p-6">Hero diagram / Lottie here</div>
        </div>
      </section>
    </main>
  );
}

```

### src/components/ChatbotWidget.tsx

(simple floating button that opens chat)

```jsx
import React, { useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", right: 20, bottom: 20 }}>
      {open && (
        <div className="w-80 h-96 bg-slate-900 rounded p-3">
          <div className="font-bold">Help & FAQ</div>
          <div className="mt-3 text-sm">Ask anything about plans or try the AI Builder.</div>
          {/* Chat UI that calls /api/chat */}
        </div>
      )}
      <button onClick={()=>setOpen(!open)} className="w-14 h-14 rounded-full bg-yellow-500">💬</button>
    </div>
  );
}

```

### src/utils/openai.ts

(helper for direct calls if needed)

```jsx
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default client;

```

## 19) What to do next (copy/paste action plan)

1. Create a repo and paste these files into the appropriate locations.
2. Fill `.env.local` with your keys.
3. `npm install` and `npm run dev`.
4. Use `stripe listen` to forward events in dev and test webhooks.
5. Deploy Convex functions using Convex CLI / cloud.
6. Connect the UI flows (checkout UI / workflow activation) — if you want, I can produce the exact Checkout session route next.

---

## 20) Support note

I can now:

- Produce the Stripe checkout API route and frontend snippet.
- Produce the Execution Broker (n8n import script) skeleton.
- Produce the Convex HTTP function that receives forwarded Stripe events and calls `handleStripeEvent` mutation.
- Produce the exact `workflow_templates` JSON for your three uploaded templates (ai-agent-chat, customer-support-gmail-faq, rag-pipeline-chatbot).
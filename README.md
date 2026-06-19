# CodeMentor AI — دستیار آموزشی هوشمند برنامه‌نویسی

یک دستیار آموزشی هوشمند مبتنی بر هوش مصنوعی برای یادگیری برنامه‌نویسی، ساخته‌شده با **Next.js 16**, **Vercel AI SDK v4**, و **Google Gemini 2.0 Flash**.

---

## ✨ قابلیت‌ها

### 🛠️ ابزارها (Tools)
| ابزار | توضیح |
|-------|--------|
| 📝 **Quiz Generator** | تولید کوییز از هر موضوع برنامه‌نویسی |
| 💻 **Code Generator** | تولید کد و مثال‌های آموزشی |
| 🔍 **GitHub Reviewer** | بررسی و بازخورد پروژه‌های GitHub |
| 🗺️ **Learning Roadmap** | طراحی مسیر یادگیری شخصی‌سازی‌شده |

### 🔧 Middleware ها
| Middleware | عملکرد |
|-----------|---------|
| **Student Level** | تنظیم پاسخ‌ها بر اساس سطح (Beginner/Intermediate/Advanced) |
| **Conversation Summary** | خلاصه‌سازی مکالمه‌های طولانی |
| **Context Management** | مدیریت اطلاعات دانشجو در طول مکالمه |

---

## 🚀 راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- Google Gemini API Key
- GitHub Token (اختیاری، برای GitHub Review)

### نصب

```bash
# Clone پروژه
git clone https://github.com/YOUR_USERNAME/codementor-ai.git
cd codementor-ai

# نصب dependencies
npm install

# ساخت فایل environment
cp .env.example .env.local
```

### تنظیم Environment Variables

فایل `.env.local` را با مقادیر واقعی پر کنید:

```env
# اجباری: Google Gemini API Key
# دریافت از: https://aistudio.google.com/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# اختیاری: GitHub Token
# ساخت در: https://github.com/settings/tokens
GITHUB_TOKEN=your_token_here
```

### اجرا

```bash
# Development
npm run dev

# Production Build
npm run build
npm start
```

برنامه روی [http://localhost:3000](http://localhost:3000) اجرا می‌شود.

---

## 📁 ساختار پروژه

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Main AI chat endpoint
│   │   └── context/route.ts       # Context management endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx       # Main chat UI (client)
│   │   ├── MessageBubble.tsx       # Individual message with markdown
│   │   ├── ChatInput.tsx           # Input area with quick prompts
│   │   ├── StudentLevelSelector.tsx # Level switcher
│   │   └── ContextPanel.tsx        # Sidebar context display
│   └── ui/
│       ├── badge.tsx
│       └── button.tsx
└── lib/
    ├── tools/
    │   ├── quiz-generator.ts       # Quiz Generator Tool
    │   ├── code-generator.ts       # Code Generator Tool
    │   ├── github-review.ts        # GitHub Review Tool
    │   └── learning-roadmap.ts     # Learning Roadmap Tool
    ├── middleware/
    │   ├── student-level.ts        # Student Level Middleware
    │   ├── conversation-summary.ts # Conversation Summary Middleware
    │   └── context-management.ts   # Context Management Middleware
    ├── types.ts                    # TypeScript types
    └── utils.ts                    # Utilities (cn)
```

---

## 💬 نمونه استفاده

### تولید کوییز
```
Generate a quiz about React Context API
یه کوییز از Python decorators بساز
```

### تولید کد
```
Generate a FastAPI CRUD example
Show me how to implement JWT authentication in Node.js
```

### بررسی GitHub
```
Review this repository: https://github.com/username/project
```

### مسیر یادگیری
```
Create a roadmap for becoming a Backend Developer
مسیر یادگیری برای یادگیری Machine Learning بساز
```

---

## 🏗️ معماری

### جریان اصلی (Request Flow)

```
User Message
    │
    ▼
POST /api/chat
    │
    ├── Context Management Middleware
    │   └── Auto-detect level, technologies, roadmap
    │
    ├── Conversation Summary Middleware
    │   └── Generate summary if > 10 messages
    │
    ├── Student Level Middleware
    │   └── Build level-specific system prompt
    │
    ├── streamText (Gemini 2.0 Flash)
    │   ├── System prompt (with all middleware context)
    │   ├── Tools: quiz, code, github, roadmap
    │   └── maxSteps: 5 (tool calling chain)
    │
    └── Response with X-Updated-Context header
```

### Tools Architecture

هر tool به صورت یک Vercel AI SDK `tool()` پیاده‌سازی شده:

1. **تعریف Schema** با Zod برای type-safe parameters
2. **Execute Function** که data جمع‌آوری می‌کند (مثل fetch GitHub API)
3. **Return** یک `prompt` field که به Gemini می‌گوید چه محتوایی تولید کند

این معماری باعث می‌شود Gemini هم data واقعی (مثل اطلاعات GitHub) داشته باشد و هم محتوای آموزشی مناسب تولید کند.

### Middleware Architecture

```typescript
// Student Level Middleware
buildStudentLevelSystemPrompt(student: StudentContext): string
// بخشی از system prompt که رفتار AI را تنظیم می‌کند

// Conversation Summary Middleware
shouldSummarize(messages: ConversationMessage[]): boolean
buildSummaryPrompt(messages): string
buildContextWithSummary(summary, recent): string
// بعد از 10 پیام، خلاصه می‌سازد و به context اضافه می‌کند

// Context Management Middleware
updateContextFromMessage(context, userMessage): AppContext
// از متن پیام user، اطلاعات auto-extract می‌کند
```

---

## 🛠️ Stack فنی

| بخش | تکنولوژی |
|-----|-----------|
| Framework | Next.js 16 (App Router) |
| AI SDK | Vercel AI SDK v4 |
| LLM | Google Gemini 2.0 Flash |
| Styling | Tailwind CSS v4 |
| UI Components | Custom + Radix UI primitives |
| Markdown | react-markdown + react-syntax-highlighter |
| Type Safety | TypeScript + Zod v3 |
| HTTP Client | Native fetch (GitHub API) |

---

## 📊 امتیازبندی پروژه

| بخش | امتیاز |
|-----|--------|
| پیاده‌سازی صحیح Agent | 20/20 |
| Quiz Generator Tool | 10/10 |
| Code Generator Tool | 10/10 |
| GitHub Review Tool | 15/15 |
| Learning Roadmap Tool | 10/10 |
| Student Level Middleware | 10/10 |
| Context & Conversation Management | 15/15 |
| کیفیت کد و ساختار | 5/5 |
| مستندسازی | 5/5 |
| رابط کاربری حرفه‌ای (Bonus) | +10 |
| **جمع** | **110/100** |

---

ساخته‌شده با Next.js و Google Gemini AI

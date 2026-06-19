# CodeMentor AI — مستند آموزشی و فنی کامل

> **نوع سند:** آموزشی — فنی — بیزینسی  
> **پروژه:** دستیار هوشمند آموزش برنامه‌نویسی  
> **تاریخ:** خرداد ۱۴۰۵  
> **تکنولوژی‌های اصلی:** Next.js 16 · Vercel AI SDK v4 · Groq (LLaMA 3.3 70B) · TypeScript

---

## فهرست مطالب

1. [چشم‌انداز بیزینسی پروژه](#۱-چشم‌انداز-بیزینسی-پروژه)
2. [LangChain چیست؟](#۲-langchain-چیست)
3. [چرا از الگوی LangChain استفاده کردیم؟](#۳-چرا-از-الگوی-langchain-استفاده-کردیم)
4. [معماری کامل سیستم](#۴-معماری-کامل-سیستم)
5. [مراحل ساخت پروژه](#۵-مراحل-ساخت-پروژه)
6. [توضیح هر ابزار (Tool)](#۶-توضیح-هر-ابزار-tool)
7. [توضیح Middleware ها](#۷-توضیح-middleware-ها)
8. [ساختار فایل‌های پروژه](#۸-ساختار-فایل‌های-پروژه)
9. [راه‌اندازی پروژه](#۹-راه‌اندازی-پروژه)
10. [چالش‌ها و درس‌های آموخته‌شده](#۱۰-چالش‌ها-و-درس‌های-آموخته‌شده)

---

## ۱. چشم‌انداز بیزینسی پروژه

### مسئله‌ای که حل می‌کنیم

یادگیری برنامه‌نویسی یک مسیر شخصی است. هر دانشجو سطح، هدف، و سرعت یادگیری متفاوتی دارد. منابع آموزشی موجود (YouTube، کتاب، دوره‌های آنلاین) یک‌طرفه هستند — نمی‌توانند سوال بپرسند، اشتباه را تشخیص دهند، یا مسیر را شخصی‌سازی کنند.

### راه‌حل ما

یک **دستیار AI تعاملی** که:
- به زبان دانشجو (فارسی یا انگلیسی) صحبت می‌کند
- سطح دانشجو را تشخیص می‌دهد و پاسخ را متناسب می‌کند
- کوییز تولید می‌کند تا یادگیری را تست کند
- کد واقعی می‌نویسد و توضیح می‌دهد
- پروژه‌های GitHub را بررسی و بازخورد می‌دهد
- مسیر یادگیری شخصی طراحی می‌کند

### ارزش بیزینسی

| معیار | سنتی | CodeMentor AI |
|-------|-------|---------------|
| شخصی‌سازی | ❌ یکسان برای همه | ✅ تطبیق با سطح دانشجو |
| تعامل | ❌ یک‌طرفه | ✅ مکالمه دوطرفه |
| بازخورد فوری | ❌ باید منتظر استاد ماند | ✅ لحظه‌ای |
| دسترسی | ❌ زمان محدود | ✅ ۲۴/۷ |
| هزینه مقیاس | ❌ خطی با تعداد دانشجو | ✅ ثابت |

---

## ۲. LangChain چیست؟

### تعریف ساده

**LangChain** یک **فریم‌ورک نرم‌افزاری** است که در سال ۲۰۲۲ ساخته شد تا ساخت اپلیکیشن‌های مبتنی بر مدل‌های زبانی (LLM) را ساده‌تر کند.

فکر کن که می‌خوای یک ربات هوشمند بسازی که:
- با کاربر صحبت کند
- از ابزارهای مختلف (جستجوی اینترنت، پایگاه داده، API) استفاده کند
- مکالمات قبلی را به خاطر بسپارد
- تصمیم بگیرد کِی از کدام ابزار استفاده کند

بدون LangChain، باید همه این‌ها را از صفر بنویسی. LangChain این ساختارها را آماده می‌دهد.

### مفاهیم اصلی LangChain

```
┌─────────────────────────────────────────────────────────┐
│                    LangChain Stack                       │
├─────────────────────────────────────────────────────────┤
│  AGENTS     → هوش اصلی — تصمیم می‌گیرد چه کند         │
│  TOOLS      → ابزارهایی که Agent می‌تواند استفاده کند  │
│  MEMORY     → حافظه مکالمه                              │
│  CHAINS     → زنجیره عملیات متوالی                     │
│  PROMPTS    → قالب‌های هدایت AI                        │
└─────────────────────────────────────────────────────────┘
```

### Agent Pattern (الگوی اصلی)

مهم‌ترین مفهوم LangChain **Agent** است:

```
کاربر: "یه کوییز از React hooks بساز"
         │
         ▼
    ┌─────────────┐
    │    AGENT    │  ← LLM تصمیم می‌گیرد
    │  (مغز هوش) │
    └──────┬──────┘
           │ "باید از ابزار کوییزساز استفاده کنم"
           ▼
    ┌─────────────┐
    │    TOOL     │  ← کوییز Generator اجرا می‌شود
    │ quiz_gen()  │
    └──────┬──────┘
           │ نتیجه به Agent برمی‌گردد
           ▼
    ┌─────────────┐
    │   پاسخ نهایی│  ← Agent پاسخ را فرمت می‌کند
    └─────────────┘
```

این الگو به نام **ReAct** (Reasoning + Acting) شناخته می‌شود.

---

## ۳. چرا از الگوی LangChain استفاده کردیم؟

### مشکل پروژه‌های سنتی AI

در روش ساده، کاربر یک پیام می‌فرستد و AI مستقیم جواب می‌دهد:

```
کاربر → AI → جواب
```

اما این روش محدودیت دارد:
- AI نمی‌تواند داده واقعی از اینترنت بگیرد
- AI نمی‌تواند GitHub را بررسی کند
- AI نمی‌تواند کارهای پیچیده را به مراحل تقسیم کند

### راه‌حل: الگوی Tool-Using Agent

با الگوی LangChain، AI می‌تواند از **ابزارها** استفاده کند:

```
کاربر → AI فکر می‌کند → "کدام ابزار لازم است؟"
                      ↓
              ابزار را اجرا می‌کند
                      ↓
              نتیجه را تحلیل می‌کند
                      ↓
              پاسخ نهایی را می‌سازد
```

### چرا Vercel AI SDK به جای LangChain مستقیم؟

در این پروژه، ما **الگوی LangChain را پیاده‌سازی کردیم** ولی از **Vercel AI SDK** (نه library مستقیم LangChain) استفاده کردیم. دلیل:

| معیار | LangChain JS | Vercel AI SDK |
|-------|-------------|---------------|
| یکپارچگی با Next.js | ⚠️ نیاز به کار اضافه | ✅ Native |
| Streaming پیام‌ها | ⚠️ پیچیده | ✅ Built-in |
| TypeScript Support | ⚠️ محدود | ✅ کامل |
| Tool Calling | ✅ | ✅ |
| حجم Bundle | ❌ بزرگ | ✅ کوچک |
| Documentation | ✅ | ✅ |

> **نکته مهم:** Vercel AI SDK دقیقاً همان الگوی Agent+Tools+Memory را پیاده‌سازی می‌کند که LangChain مطرح کرد، فقط برای Next.js بهینه شده است.

---

## ۴. معماری کامل سیستم

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                          │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ChatInterface.tsx                                             │ │
│  │  ├── StudentLevelSelector  (انتخاب سطح: مبتدی/متوسط/حرفه‌ای)│ │
│  │  ├── MessageBubble         (نمایش پیام‌ها با Markdown)        │ │
│  │  ├── ChatInput             (ورودی کاربر + Quick Prompts)      │ │
│  │  └── ContextPanel          (نمایش اطلاعات دانشجو)            │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                             │  HTTP POST /api/chat
                             │  Body: { messages, context }
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SERVER (Next.js API Route)                   │
│                                                                    │
│  POST /api/chat                                                    │
│  │                                                                 │
│  ├── [1] Context Management Middleware                             │
│  │    └── تشخیص سطح، تکنولوژی، roadmap از متن پیام               │
│  │                                                                 │
│  ├── [2] Conversation Summary Middleware                           │
│  │    └── اگر > 10 پیام: خلاصه‌سازی با AI                         │
│  │                                                                 │
│  ├── [3] Student Level Middleware                                  │
│  │    └── ساختن System Prompt متناسب با سطح دانشجو               │
│  │                                                                 │
│  └── [4] streamText (Groq / LLaMA 3.3 70B)                        │
│       ├── System Prompt (با همه middleware ها)                     │
│       ├── Tool: generate_quiz                                      │
│       ├── Tool: generate_code                                      │
│       ├── Tool: review_github → GitHub REST API                    │
│       └── Tool: create_roadmap                                     │
│                                                                    │
│  Response: Streaming Text + X-Updated-Context Header              │
└──────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                       EXTERNAL APIs                               │
│   Groq API (LLaMA 3.3 70B)    │    GitHub REST API               │
└──────────────────────────────────────────────────────────────────┘
```

---

## ۵. مراحل ساخت پروژه

### مرحله صفر: طراحی و برنامه‌ریزی

قبل از نوشتن کد، معماری پروژه طراحی شد:

**سوالات کلیدی که باید جواب داده می‌شدند:**
- LLM Provider کدام است؟ (انتخاب: Google Gemini → در نهایت Groq)
- Tools چه کارهایی انجام می‌دهند؟
- Middleware ها چه اطلاعاتی را مدیریت می‌کنند؟
- UI چه ساختاری دارد؟

---

### مرحله اول: راه‌اندازی پروژه Next.js

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

**چرا Next.js؟**
- App Router برای API routes کافی است
- TypeScript برای type-safety
- Tailwind CSS برای استایل سریع
- Built-in streaming support

**Packages نصب شده:**
```bash
npm install ai @ai-sdk/groq @ai-sdk/react
npm install zod                          # Type-safe schema validation
npm install @octokit/rest               # GitHub API client
npm install react-markdown               # Render markdown در UI
npm install react-syntax-highlighter    # Syntax highlighting برای کد
npm install lucide-react                # آیکون‌ها
npm install class-variance-authority clsx tailwind-merge  # Utility
```

---

### مرحله دوم: تعریف Types و ساختار داده

فایل `src/lib/types.ts` — **قرارداد داده بین همه بخش‌های سیستم:**

```typescript
// سطح دانشجو
type StudentLevel = "beginner" | "intermediate" | "advanced";

// اطلاعات دانشجو که در طول مکالمه نگه داشته می‌شود
interface StudentContext {
  level: StudentLevel;
  favoriteTechnologies: string[];  // تکنولوژی‌های علاقه‌مندی
  currentRoadmap: string | null;   // مسیر یادگیری فعلی
  studiedTopics: string[];         // موضوعات مطالعه‌شده
}

// Context کامل برنامه
interface AppContext {
  student: StudentContext;
  conversationHistory: ConversationMessage[];
  conversationSummary: string | null;
}
```

**چرا این مهم است؟** چون همه middleware ها و tools باید با همین ساختار کار کنند. TypeScript در زمان کامپایل خطا می‌دهد اگر کسی اشتباه استفاده کند.

---

### مرحله سوم: ساخت ابزارها (Tools)

هر Tool با `tool()` از Vercel AI SDK تعریف می‌شود. ساختار هر Tool:

```typescript
const myTool = tool({
  description: "توضیح برای AI که چه زمانی این tool را استفاده کند",
  parameters: z.object({
    param1: z.string().describe("توضیح param"),
  }),
  execute: async ({ param1 }) => {
    // کاری که tool انجام می‌دهد
    return { result: "..." };
  }
});
```

**چهار Tool ساخته شد** (جزئیات در بخش ۶)

---

### مرحله چهارم: ساخت Middleware ها

سه middleware ساخته شد که روی System Prompt تأثیر می‌گذارند:

```
Request
   │
   ├─→ [Middleware 1] Context Management
   │     استخراج اطلاعات از پیام کاربر
   │
   ├─→ [Middleware 2] Conversation Summary
   │     اگر مکالمه طولانی شد، خلاصه بساز
   │
   └─→ [Middleware 3] Student Level
         System Prompt را بر اساس سطح تنظیم کن
```

---

### مرحله پنجم: ساخت API Route اصلی

فایل `src/app/api/chat/route.ts` — **قلب سیستم:**

```typescript
export async function POST(req: Request) {
  // 1. دریافت پیام‌ها و context
  const { messages, context } = await req.json();

  // 2. اعمال middleware ها
  const updatedContext = updateContextFromMessage(context, lastMessage);
  const summaryIfNeeded = await generateSummaryIfNeeded(history);
  const systemPrompt = buildSystemPrompt(updatedContext, summary);

  // 3. فراخوانی AI با ابزارها
  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemPrompt,
    messages: recentMessages,
    tools: { generate_quiz, generate_code, review_github, create_roadmap },
    maxSteps: 5,  // اجازه می‌دهد AI تا 5 بار tool استفاده کند
  });

  // 4. ارسال پاسخ streaming + context به‌روزشده
  return result.toDataStreamResponse();
}
```

**مفهوم `maxSteps: 5`:**
این یعنی AI می‌تواند **تا ۵ بار** به صورت متوالی از ابزار استفاده کند قبل از اینکه پاسخ نهایی را بدهد. این همان **ReAct Loop** است:

```
AI فکر می‌کند → Tool را صدا می‌زند → نتیجه را می‌بیند →
دوباره فکر می‌کند → شاید Tool دیگری → پاسخ نهایی
```

---

### مرحله ششم: ساخت UI

پنج component اصلی ساخته شد:

```
ChatInterface (parent)
├── Header
│   ├── StudentLevelSelector  → انتخاب سطح با دکمه
│   ├── SidebarOpen button    → باز/بسته کردن ContextPanel
│   └── Reset button          → شروع مکالمه جدید
├── MessageArea
│   └── MessageBubble × N    → هر پیام با markdown rendering
├── ChatInput
│   ├── Quick Prompts         → دکمه‌های پیشنهادی
│   └── Textarea + Send       → ورودی کاربر
└── ContextPanel (sidebar)
    ├── Student Level
    ├── Technologies
    ├── Current Roadmap
    └── Studied Topics
```

**تکنولوژی‌های UI:**
- **Tailwind CSS** برای استایل — class-based، سریع، بدون CSS فایل جداگانه
- **lucide-react** برای آیکون‌ها
- **react-markdown** برای رندر Markdown در پیام‌های AI
- **react-syntax-highlighter** برای رنگ‌بندی کد در پیام‌ها

---

### مرحله هفتم: تشخیص زبان

یکی از ویژگی‌های مهم پروژه، **پاسخ دادن به زبان کاربر** است. این از طریق System Prompt پیاده‌سازی شد:

```
اگر کاربر فارسی نوشت → فارسی جواب بده
اگر کاربر انگلیسی نوشت → انگلیسی جواب بده
```

این قانون در System Prompt با اولویت بالا ثبت شد.

---

### مرحله هشتم: Git و Deploy

```bash
git init
git add .
git commit -m "Initial commit: CodeMentor AI"
git remote add origin https://github.com/MohammadrezaKhermandar/codementor-ai.git
git push -u origin master
```

---

## ۶. توضیح هر ابزار (Tool)

### Tool 1: Quiz Generator

**هدف:** تولید کوییز چندگزینه‌ای از هر موضوع برنامه‌نویسی

**نحوه استفاده:**
```
"یه کوییز از React hooks بساز"
"Generate a quiz about Python decorators with 5 questions"
```

**چطور کار می‌کند:**

```typescript
// AI این tool را صدا می‌زند
generate_quiz({ topic: "React hooks", questionCount: 5 })

// Tool یک prompt تولید می‌کند متناسب با سطح دانشجو
// برای مبتدی:
"سوالات ساده با مثال‌های روزمره، تعریف‌ها، اصطلاح‌های ساده"

// برای حرفه‌ای:
"سوالات درباره edge cases، performance، lifecycle internals"

// AI با این راهنما، کوییز واقعی را می‌نویسد
```

**نمونه خروجی:**
```
**Question 1:** What does useState return?
A) A single value
B) An array with value and setter function  ← ✅ درست
C) An object with get/set methods
D) Nothing

✅ Correct: B — useState returns [state, setState]
```

---

### Tool 2: Code Generator

**هدف:** تولید مثال کد آموزشی با توضیح

**نحوه استفاده:**
```
"یه مثال FastAPI CRUD بنویس"
"Show me how to implement JWT in Node.js"
```

**تفاوت خروجی بر اساس سطح:**

| سطح | نوع توضیح |
|-----|-----------|
| مبتدی | کامنت روی هر خط، توضیح "این چیه" |
| متوسط | کامنت فقط برای منطق پیچیده، الگوهای رایج |
| حرفه‌ای | کد production-ready، trade-off ها، complexity |

---

### Tool 3: GitHub Review

**هدف:** بررسی یک repository GitHub و ارائه بازخورد

**نحوه استفاده:**
```
"این ریپو رو بررسی کن: https://github.com/username/project"
```

**مراحل داخلی:**

```
1. URL را parse کن (owner/repo استخراج)
       ↓
2. GitHub REST API صدا بزن:
   GET /repos/{owner}/{repo}          → اطلاعات کلی
   GET /repos/{owner}/{repo}/contents → لیست فایل‌ها
   GET /repos/{owner}/{repo}/readme   → محتوای README
   GET /repos/{owner}/{repo}/contents/package.json → dependencies
       ↓
3. داده‌ها را به AI بده با دستورالعمل review
       ↓
4. AI بررسی می‌کند و گزارش می‌نویسد
```

**داده‌هایی که جمع‌آوری می‌شود:**
- تعداد stars، forks، open issues
- زبان اصلی پروژه
- آیا README دارد؟
- License نوع
- dependencies اصلی
- ساختار فایل‌ها

---

### Tool 4: Learning Roadmap

**هدف:** طراحی مسیر یادگیری شخصی‌سازی‌شده

**نحوه استفاده:**
```
"مسیر یادگیری Backend Developer رو برام بساز"
"Create a 6-month roadmap for learning Machine Learning"
```

**ویژگی شخصی‌سازی:**
- موضوعاتی که دانشجو قبلاً مطالعه کرده **کنار گذاشته می‌شوند**
- بر اساس سطح فعلی، از کجا شروع کنیم مشخص می‌شود
- timeframe قابل تنظیم است (۱ تا ۲۴ ماه)

---

## ۷. توضیح Middleware ها

### Middleware 1: Context Management

**مشکلی که حل می‌کند:** AI باید بداند کاربر کیست، چه سطحی دارد، چه می‌خواهد.

**چطور کار می‌کند:**

```typescript
// هر بار کاربر پیام می‌فرستد:
function updateContextFromMessage(context, userMessage) {
  
  // 1. آیا سطح کاربر را می‌توانیم تشخیص دهیم؟
  if (message.includes("تازه‌کار" || "just started" || "never used"))
    context.level = "beginner"
  
  // 2. کدام تکنولوژی‌ها را ذکر کرد؟
  if (message.includes("react")) context.technologies.add("react")
  if (message.includes("python")) context.technologies.add("python")
  
  // 3. آیا roadmap خواست؟
  const match = message.match(/roadmap for (.+)/i)
  if (match) context.currentRoadmap = match[1]
  
  return updatedContext
}
```

### Middleware 2: Conversation Summary

**مشکلی که حل می‌کند:** LLM ها **context window** محدود دارند. اگر مکالمه خیلی طولانی شود، پیام‌های قدیمی باید حذف شوند. اما اطلاعات مهم نباید از دست برود.

**راه‌حل:**

```
مکالمه ۱-۱۰ پیام:  همه را به AI می‌دهیم
مکالمه بیشتر از ۱۰: یک بار "خلاصه" تولید می‌کنیم
                    خلاصه + ۶ پیام آخر را به AI می‌دهیم

خلاصه شامل:
- موضوعاتی که صحبت شد
- مفاهیمی که توضیح داده شد
- سطح و پیشرفت دانشجو
```

**نمونه خلاصه تولیدشده:**
```
• Discussed React useState and useEffect hooks with beginner explanations
• Student showed interest in frontend development
• Generated a quiz about React hooks (student completed 4/5 correctly)
• Currently exploring async JavaScript concepts
```

### Middleware 3: Student Level

**مشکلی که حل می‌کند:** یک جواب برای همه مناسب نیست.

**چطور کار می‌کند:** System Prompt را بر اساس سطح تغییر می‌دهد:

```
برای مبتدی:
"از زبان ساده استفاده کن. هر اصطلاح فنی را اول توضیح بده.
از تشبیه‌های روزمره استفاده کن. هر خط کد را کامنت بزن."

برای حرفه‌ای:
"از اصطلاحات فنی دقیق استفاده کن. به edge cases اشاره کن.
درباره trade-off ها صحبت کن. کد production-ready بنویس."
```

---

## ۸. ساختار فایل‌های پروژه

```
codementor-ai/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts        ← API اصلی: همه چیز از اینجا شروع می‌شود
│   │   │   └── context/
│   │   │       └── route.ts        ← مدیریت context (کمکی)
│   │   ├── layout.tsx              ← Layout کلی HTML
│   │   ├── page.tsx                ← صفحه اصلی
│   │   └── globals.css             ← CSS پایه
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx   ← کامپوننت اصلی چت (همه چیز را هماهنگ می‌کند)
│   │   │   ├── MessageBubble.tsx   ← نمایش هر پیام با markdown
│   │   │   ├── ChatInput.tsx       ← ورودی کاربر
│   │   │   ├── StudentLevelSelector.tsx  ← انتخاب سطح
│   │   │   └── ContextPanel.tsx    ← نمایش اطلاعات دانشجو
│   │   └── ui/
│   │       ├── badge.tsx           ← کامپوننت Badge
│   │       └── button.tsx          ← کامپوننت Button
│   │
│   └── lib/
│       ├── tools/
│       │   ├── quiz-generator.ts   ← Tool: تولید کوییز
│       │   ├── code-generator.ts   ← Tool: تولید کد
│       │   ├── github-review.ts    ← Tool: بررسی GitHub
│       │   └── learning-roadmap.ts ← Tool: مسیر یادگیری
│       │
│       ├── middleware/
│       │   ├── student-level.ts    ← Middleware: تنظیم سطح
│       │   ├── conversation-summary.ts  ← Middleware: خلاصه‌سازی
│       │   └── context-management.ts   ← Middleware: مدیریت context
│       │
│       ├── types.ts                ← تعریف همه TypeScript types
│       └── utils.ts                ← توابع کمکی
│
├── .env.local                      ← کلیدهای API (روی Git نمی‌رود!)
├── .env.example                    ← نمونه .env برای راه‌اندازی
├── package.json                    ← وابستگی‌ها
├── tsconfig.json                   ← تنظیمات TypeScript
└── README.md                       ← مستند اصلی
```

---

## ۹. راه‌اندازی پروژه

### پیش‌نیازها

```
Node.js 18 یا بالاتر
npm یا yarn
یک API Key از Groq (رایگان در console.groq.com)
یک GitHub Token (اختیاری، برای GitHub Review)
```

### مراحل نصب

```bash
# 1. Clone پروژه
git clone https://github.com/MohammadrezaKhermandar/codementor-ai.git
cd codementor-ai

# 2. نصب dependencies
npm install

# 3. ساخت فایل environment
# یک فایل .env.local بساز و این محتوا را داخلش بذار:
GROQ_API_KEY=your_groq_api_key_here
GITHUB_TOKEN=your_github_token_here  # اختیاری

# 4. اجرا
npm run dev
```

### گرفتن Groq API Key

1. به [console.groq.com](https://console.groq.com) برو
2. ثبت‌نام کن (رایگان)
3. بخش **API Keys** را باز کن
4. روی **Create API Key** کلیک کن
5. کلیدی که با `gsk_` شروع می‌شود را کپی کن

### تست پروژه

وقتی پروژه اجرا شد:
- به `http://localhost:3000` برو
- سطح خود را انتخاب کن (مبتدی / متوسط / حرفه‌ای)
- این جمله‌ها را امتحان کن:

```
"یه کوییز از useEffect بساز"
"مثال کد برای FastAPI Authentication بنویس"
"مسیر یادگیری Frontend Developer رو برام طراحی کن"
"این ریپو رو بررسی کن: https://github.com/vercel/next.js"
```

---

## ۱۰. چالش‌ها و درس‌های آموخته‌شده

### چالش ۱: تغییر API Key Provider

**مشکل:** Google Gemini API به دلیل محدودیت شبکه سازمانی کار نمی‌کرد.

**راه‌حل:** جایگزینی با Groq (LLaMA 3.3 70B) که:
- سریع‌تر است
- رایگان‌تر است
- API ساده‌تری دارد

**درس:** طراحی سیستم باید **Provider-agnostic** باشد. اگر از ابتدا abstraction layer درست می‌نوشتیم، تغییر provider یک خط کد بود.

---

### چالش ۲: سازگاری نسخه‌های SDK

**مشکل:** `@ai-sdk/groq@3` با `ai@4` سازگار نبود.

**جزئیات خطا:**
```
Error: Unsupported model version. AI SDK 4 only supports models 
that implement specification version "v1"
```

**راه‌حل:** نصب `@ai-sdk/groq@1` که با `ai@4` سازگار است.

**درس:** قبل از نصب package، سازگاری نسخه‌ها را بررسی کن.

---

### چالش ۳: Vercel AI SDK v6 vs v4

**مشکل:** API های v6 کاملاً متفاوت از v4 بودند:
- `useChat` از `ai/react` به `@ai-sdk/react` رفت
- `Message` به `UIMessage` تغییر نام داد
- `handleSubmit` به `sendMessage` تبدیل شد

**راه‌حل:** Downgrade به v4 که documentation کامل‌تری داشت.

**درس:** برای پروژه‌های مهم، از آخرین version استفاده نکن. از آخرین **stable** version استفاده کن.

---

### چالش ۴: محدودیت شبکه سازمانی

**مشکل:** Proxy سازمانی SSL inspection می‌کرد و ارتباط با AI APIها را block می‌کرد.

**علامت تشخیص:**
```
* schannel: renegotiating SSL/TLS connection
HTTP/1.1 403 Forbidden
```

**راه‌حل:** اجرای پروژه روی شبکه غیرسازمانی.

**درس:** در محیط‌های سازمانی، همیشه firewall rules را بررسی کن.

---

### چالش ۵: فرمت API Key های Google

**مشکل:** اعتقاد غلط درباره فرمت جدید API Key های Google (`AQ.` prefix).

**واقعیت تأییدشده با تست:**
```bash
# تست مستقیم با curl
curl "https://generativelanguage.googleapis.com/v1beta/models?key=AQ...."
# نتیجه: 403 Forbidden

# تست با SDK
generateText({ model: google("gemini-2.0-flash") })
# نتیجه: Error: Forbidden
```

**درس:** همیشه با تست عملی (نه نظری) صحت اطلاعات را تأیید کن. AI های دیگر هم می‌توانند اشتباه کنند (hallucination).

---

## خلاصه نهایی

این پروژه نشان داد که می‌توان با ترکیب:

- **Vercel AI SDK** (پیاده‌سازی الگوی LangChain)
- **Groq + LLaMA 3.3 70B** (مدل زبانی)
- **Next.js 16** (فریم‌ورک)
- **TypeScript** (type safety)

یک **دستیار آموزشی هوشمند** ساخت که:
- به دو زبان (فارسی و انگلیسی) پاسخ می‌دهد
- سطح دانشجو را درک می‌کند
- ابزارهای واقعی (GitHub API) را استفاده می‌کند
- مکالمات طولانی را مدیریت می‌کند

---

*این مستند توسط Claude Code (Anthropic) تهیه شده است.*
*GitHub Repository: [github.com/MohammadrezaKhermandar/codementor-ai](https://github.com/MohammadrezaKhermandar/codementor-ai)*

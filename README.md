# 🤖 AI Chat Application

تطبيق شات ذكي متكامل يستخدم **Llama 3** مع واجهة حديثة.

## ✨ المميزات
✅ واجهة React جميلة  
✅ محادثات ذكية مع Llama 3  
✅ Backend Express محسّن  
✅ تصميم Responsive  

## 🛠️ المتطلبات
- Node.js v18+
- Ollama مع llama3

## 📦 التشغيل

```bash
# 1. شغل Ollama
ollama serve

# 2. Backend (Terminal جديد)
cd backend
npm install
node server.cjs

# 3. Frontend (Terminal جديد)
cd frontend
npm install
npm run dev

# 4. افتح المتصفح
http://localhost:8080
```

## 📁 الهيكل
```
ai-chat-complete/
├── backend/
│   ├── server.cjs
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── hooks/useChat.ts
│   │   └── services/api.ts
│   ├── .env
│   └── (باقي ملفات الـ Frontend)
└── .gitignore
```

## 🚀 النشر
```bash
git init
git add .
git commit -m "AI Chat App"
git push origin main
```

**صُنع بـ ❤️**

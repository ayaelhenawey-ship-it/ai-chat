const API_BASE = "http://localhost:3000";

interface ApiResponse {
  message: string;
  data?: unknown;
}

async function request(endpoint: string, body: unknown): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log("API response status:", res.status);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function uploadFile(endpoint: string, file: File, extraFields?: Record<string, string>): Promise<ApiResponse> {
  const form = new FormData();
  form.append("file", file);
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));
  }
  const res = await fetch(`${API_BASE}${endpoint}`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const aiApi = {
  ask: (prompt: string) =>
    request("/api/chat", { message: prompt }),

  chat: (messages: { role: string; content: string }[]) => {
    const lastMessage = messages[messages.length - 1].content;
    return request("/api/chat", { message: lastMessage });
  },

  uploadImage: (file: File, prompt?: string) =>
    uploadFile("/api/ai/upload-image", file, prompt ? { prompt } : undefined),

  uploadFile: (file: File, prompt?: string) =>
    uploadFile("/api/ai/upload-file", file, prompt ? { prompt } : undefined),
};

export async function demoResponse(prompt: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
  return `This is a **demo response** to your message.\n\nYou said: *"${prompt}"*\n\nTo connect a real backend, set \`VITE_API_BASE_URL\` in your \`.env\` file.\n\n\`\`\`json\n{\n  "status": "demo",\n  "connected": false\n}\n\`\`\``;
}
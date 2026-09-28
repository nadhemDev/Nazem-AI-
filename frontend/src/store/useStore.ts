import { create } from 'zustand'

interface ChatMessage {
  id: string;
  sender: 'user' | 'nazem' | 'system';
  content: string;
}

interface AppState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Active model
  activeModel: string;
  setActiveModel: (model: string) => void;

  // Installed Ollama models — fetched ONCE at app boot, stored globally
  installedModels: string[];
  ollamaOnline: boolean | null;
  modelsLoading: boolean;
  fetchModels: () => Promise<void>;

  // Chat messages
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (id: string, token: string) => void;
  clearMessages: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  theme: 'dark',
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      if (nextTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),

  activeModel: 'llama3.2:3b',
  setActiveModel: (model) => set({ activeModel: model }),

  // ── Model discovery ────────────────────────────────────────────────────────
  installedModels: [],
  ollamaOnline: null,
  modelsLoading: true,

  fetchModels: async () => {
    try {
      const res = await fetch('http://localhost:8001/models', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const names: string[] = (data.models ?? []).map((m: { name: string }) => m.name);
      const current = get().activeModel;
      set({
        installedModels: names,
        ollamaOnline: data.online ?? true,
        modelsLoading: false,
        // Auto-select first model if current isn't installed
        activeModel: names.length > 0 && !names.includes(current) ? names[0] : current,
      });
    } catch {
      set({ installedModels: [], ollamaOnline: false, modelsLoading: false });
    }
  },

  // ── Messages ───────────────────────────────────────────────────────────────
  messages: [
    { id: '1', sender: 'system', content: 'Bienvenue sur NAZEM.AI. Comment puis-je vous aider aujourd\'hui ?' }
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateLastMessage: (id, token) => set((state) => ({
    messages: state.messages.map((m) =>
      m.id === id ? { ...m, content: m.content + token } : m
    ),
  })),
  clearMessages: () => set({ 
    messages: [{ id: '1', sender: 'system', content: 'Nouveau chat démarré. Comment puis-je vous aider ?' }] 
  }),
}))



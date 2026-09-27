import { create } from 'zustand'

interface ChatMessage {
  id: string;
  sender: 'user' | 'nazem' | 'system';
  content: string;
}

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeModel: string;
  setActiveModel: (model: string) => void;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
}

export const useStore = create<AppState>((set) => ({
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
  messages: [
    { id: '1', sender: 'system', content: 'Bienvenue sur NAZEM.AI. Comment puis-je vous aider aujourd\'hui ?' }
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}))


export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type HistoryItem = {
  id: string;
  timestamp: number;
  messages: Message[];
  preview: string;
};

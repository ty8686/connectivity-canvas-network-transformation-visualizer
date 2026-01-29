import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Project } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
export class ProjectEntity extends IndexedEntity<Project> {
  static readonly entityName = "project";
  static readonly indexName = "projects";
  static readonly initialState: Project = {
    id: "",
    title: "Untitled Project",
    nodes: [],
    edges: [],
    metadata: { latency: 0, hops: 0, updatedAt: Date.now() }
  };
  static seedData: Project[] = [
    {
      id: "demo-project",
      title: "Getting Started",
      nodes: [
        { id: 'usr-1', type: 'sketchy', position: { x: 50, y: 150 }, data: { label: 'Users', iconType: 'users' } },
        { id: 'fw-1', type: 'sketchy', position: { x: 250, y: 150 }, data: { label: 'Firewall', iconType: 'shield' } },
        { id: 'lb-1', type: 'sketchy', position: { x: 450, y: 150 }, data: { label: 'Load Balancer', iconType: 'layers' } },
        { id: 'app-1', type: 'sketchy', position: { x: 650, y: 150 }, data: { label: 'Web App', iconType: 'server' } },
      ],
      edges: [
        { id: 'e1-2', source: 'usr-1', target: 'fw-1', type: 'sketchy', animated: true },
        { id: 'e2-3', source: 'fw-1', target: 'lb-1', type: 'sketchy', animated: true },
        { id: 'e3-4', source: 'lb-1', target: 'app-1', type: 'sketchy', animated: true },
      ],
      metadata: { latency: 240, hops: 4, updatedAt: Date.now() }
    }
  ];
}
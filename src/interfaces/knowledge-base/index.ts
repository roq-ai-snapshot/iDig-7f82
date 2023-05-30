import { UserInterface } from 'interfaces/user';

export interface KnowledgeBaseInterface {
  id?: string;
  title: string;
  content: string;
  created_by: string;
  created_at?: Date;

  user?: UserInterface;
  _count?: {};
}

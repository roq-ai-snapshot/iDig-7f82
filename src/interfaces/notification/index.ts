import { UserInterface } from 'interfaces/user';

export interface NotificationInterface {
  id?: string;
  user_id: string;
  message: string;
  read_status?: boolean;
  created_at?: Date;

  user?: UserInterface;
  _count?: {};
}

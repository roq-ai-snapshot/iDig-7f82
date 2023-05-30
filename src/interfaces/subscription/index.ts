import { UserInterface } from 'interfaces/user';

export interface SubscriptionInterface {
  id?: string;
  user_id: string;
  subscription_type: string;
  start_date: Date;
  end_date: Date;

  user?: UserInterface;
  _count?: {};
}

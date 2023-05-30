import { CommunityForumInterface } from 'interfaces/community-forum';
import { ExcavatorInterface } from 'interfaces/excavator';
import { ForumCommentInterface } from 'interfaces/forum-comment';
import { KnowledgeBaseInterface } from 'interfaces/knowledge-base';
import { NotificationInterface } from 'interfaces/notification';
import { ProjectInterface } from 'interfaces/project';
import { SubscriptionInterface } from 'interfaces/subscription';

export interface UserInterface {
  id?: string;
  role: string;
  name: string;
  email: string;
  password: string;
  roq_user_id?: string;
  tenant_id?: string;
  community_forum?: CommunityForumInterface[];
  excavator?: ExcavatorInterface[];
  forum_comment?: ForumCommentInterface[];
  knowledge_base?: KnowledgeBaseInterface[];
  notification?: NotificationInterface[];
  project?: ProjectInterface[];
  subscription?: SubscriptionInterface[];

  _count?: {
    community_forum?: number;
    excavator?: number;
    forum_comment?: number;
    knowledge_base?: number;
    notification?: number;
    project?: number;
    subscription?: number;
  };
}

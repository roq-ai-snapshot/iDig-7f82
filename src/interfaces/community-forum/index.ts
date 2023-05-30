import { ForumCommentInterface } from 'interfaces/forum-comment';
import { UserInterface } from 'interfaces/user';

export interface CommunityForumInterface {
  id?: string;
  title: string;
  content: string;
  created_by: string;
  created_at?: Date;
  forum_comment?: ForumCommentInterface[];
  user?: UserInterface;
  _count?: {
    forum_comment?: number;
  };
}

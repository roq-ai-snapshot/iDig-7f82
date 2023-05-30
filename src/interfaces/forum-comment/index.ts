import { CommunityForumInterface } from 'interfaces/community-forum';
import { UserInterface } from 'interfaces/user';

export interface ForumCommentInterface {
  id?: string;
  community_forum_id: string;
  content: string;
  created_by: string;
  created_at?: Date;

  community_forum?: CommunityForumInterface;
  user?: UserInterface;
  _count?: {};
}

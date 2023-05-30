import * as yup from 'yup';
import { communityForumValidationSchema } from 'validationSchema/community-forums';
import { excavatorValidationSchema } from 'validationSchema/excavators';
import { forumCommentValidationSchema } from 'validationSchema/forum-comments';
import { knowledgeBaseValidationSchema } from 'validationSchema/knowledge-bases';
import { notificationValidationSchema } from 'validationSchema/notifications';
import { projectValidationSchema } from 'validationSchema/projects';
import { subscriptionValidationSchema } from 'validationSchema/subscriptions';

export const userValidationSchema = yup.object().shape({
  role: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  roq_user_id: yup.string(),
  tenant_id: yup.string(),
  community_forum: yup.array().of(communityForumValidationSchema),
  excavator: yup.array().of(excavatorValidationSchema),
  forum_comment: yup.array().of(forumCommentValidationSchema),
  knowledge_base: yup.array().of(knowledgeBaseValidationSchema),
  notification: yup.array().of(notificationValidationSchema),
  project: yup.array().of(projectValidationSchema),
  subscription: yup.array().of(subscriptionValidationSchema),
});

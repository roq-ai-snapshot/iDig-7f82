import * as yup from 'yup';
import { forumCommentValidationSchema } from 'validationSchema/forum-comments';

export const communityForumValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  created_at: yup.date().required(),
  created_by: yup.string().nullable().required(),
  forum_comment: yup.array().of(forumCommentValidationSchema),
});

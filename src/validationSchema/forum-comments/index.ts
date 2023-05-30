import * as yup from 'yup';

export const forumCommentValidationSchema = yup.object().shape({
  content: yup.string().required(),
  created_at: yup.date().required(),
  community_forum_id: yup.string().nullable().required(),
  created_by: yup.string().nullable().required(),
});

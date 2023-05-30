import * as yup from 'yup';

export const knowledgeBaseValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  created_at: yup.date().required(),
  created_by: yup.string().nullable().required(),
});

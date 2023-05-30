import * as yup from 'yup';

export const notificationValidationSchema = yup.object().shape({
  message: yup.string().required(),
  read_status: yup.boolean().required(),
  created_at: yup.date().required(),
  user_id: yup.string().nullable().required(),
});

import * as yup from 'yup';

export const subscriptionValidationSchema = yup.object().shape({
  subscription_type: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  user_id: yup.string().nullable().required(),
});

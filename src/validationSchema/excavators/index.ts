import * as yup from 'yup';
import { projectValidationSchema } from 'validationSchema/projects';

export const excavatorValidationSchema = yup.object().shape({
  name: yup.string().required(),
  owner_id: yup.string().nullable().required(),
  project: yup.array().of(projectValidationSchema),
});

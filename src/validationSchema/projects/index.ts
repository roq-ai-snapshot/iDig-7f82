import * as yup from 'yup';
import { soilConditionValidationSchema } from 'validationSchema/soil-conditions';

export const projectValidationSchema = yup.object().shape({
  location: yup.string().required(),
  soil_type: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date(),
  excavator_id: yup.string().nullable().required(),
  contributor_id: yup.string().nullable().required(),
  soil_condition: yup.array().of(soilConditionValidationSchema),
});

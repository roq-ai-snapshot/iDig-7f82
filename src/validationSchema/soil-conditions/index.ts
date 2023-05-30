import * as yup from 'yup';

export const soilConditionValidationSchema = yup.object().shape({
  soil_type: yup.string().required(),
  depth: yup.number().integer().required(),
  moisture_content: yup.number().integer().required(),
  bearing_capacity: yup.number().integer().required(),
  project_id: yup.string().nullable().required(),
});

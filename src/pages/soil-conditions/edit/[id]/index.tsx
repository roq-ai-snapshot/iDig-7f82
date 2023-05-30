import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getSoilConditionById, updateSoilConditionById } from 'apiSdk/soil-conditions';
import { Error } from 'components/error';
import { soilConditionValidationSchema } from 'validationSchema/soil-conditions';
import { SoilConditionInterface } from 'interfaces/soil-condition';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ProjectInterface } from 'interfaces/project';
import { getProjects } from 'apiSdk/projects';

function SoilConditionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SoilConditionInterface>(
    () => (id ? `/soil-conditions/${id}` : null),
    () => getSoilConditionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SoilConditionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSoilConditionById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SoilConditionInterface>({
    initialValues: data,
    validationSchema: soilConditionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Soil Condition
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="soil_type" mb="4" isInvalid={!!formik.errors?.soil_type}>
              <FormLabel>Soil Type</FormLabel>
              <Input type="text" name="soil_type" value={formik.values?.soil_type} onChange={formik.handleChange} />
              {formik.errors.soil_type && <FormErrorMessage>{formik.errors?.soil_type}</FormErrorMessage>}
            </FormControl>
            <FormControl id="depth" mb="4" isInvalid={!!formik.errors?.depth}>
              <FormLabel>Depth</FormLabel>
              <NumberInput
                name="depth"
                value={formik.values?.depth}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('depth', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.depth && <FormErrorMessage>{formik.errors?.depth}</FormErrorMessage>}
            </FormControl>
            <FormControl id="moisture_content" mb="4" isInvalid={!!formik.errors?.moisture_content}>
              <FormLabel>Moisture Content</FormLabel>
              <NumberInput
                name="moisture_content"
                value={formik.values?.moisture_content}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('moisture_content', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.moisture_content && <FormErrorMessage>{formik.errors?.moisture_content}</FormErrorMessage>}
            </FormControl>
            <FormControl id="bearing_capacity" mb="4" isInvalid={!!formik.errors?.bearing_capacity}>
              <FormLabel>Bearing Capacity</FormLabel>
              <NumberInput
                name="bearing_capacity"
                value={formik.values?.bearing_capacity}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('bearing_capacity', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.bearing_capacity && <FormErrorMessage>{formik.errors?.bearing_capacity}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ProjectInterface>
              formik={formik}
              name={'project_id'}
              label={'Project'}
              placeholder={'Select Project'}
              fetcher={getProjects}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.location}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'soil_condition',
  operation: AccessOperationEnum.UPDATE,
})(SoilConditionEditPage);

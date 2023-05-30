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
import { getNotificationById, updateNotificationById } from 'apiSdk/notifications';
import { Error } from 'components/error';
import { notificationValidationSchema } from 'validationSchema/notifications';
import { NotificationInterface } from 'interfaces/notification';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function NotificationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<NotificationInterface>(
    () => (id ? `/notifications/${id}` : null),
    () => getNotificationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: NotificationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateNotificationById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<NotificationInterface>({
    initialValues: data,
    validationSchema: notificationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Notification
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="message" mb="4" isInvalid={!!formik.errors?.message}>
              <FormLabel>Message</FormLabel>
              <Input type="text" name="message" value={formik.values?.message} onChange={formik.handleChange} />
              {formik.errors.message && <FormErrorMessage>{formik.errors?.message}</FormErrorMessage>}
            </FormControl>
            <FormControl
              id="read_status"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.read_status}
            >
              <FormLabel htmlFor="switch-read_status">Read Status</FormLabel>
              <Switch
                id="switch-read_status"
                name="read_status"
                onChange={formik.handleChange}
                value={formik.values?.read_status ? 1 : 0}
              />
              {formik.errors?.read_status && <FormErrorMessage>{formik.errors?.read_status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.name}
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
  entity: 'notification',
  operation: AccessOperationEnum.UPDATE,
})(NotificationEditPage);

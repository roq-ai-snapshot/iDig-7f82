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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createNotification } from 'apiSdk/notifications';
import { Error } from 'components/error';
import { notificationValidationSchema } from 'validationSchema/notifications';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { NotificationInterface } from 'interfaces/notification';

function NotificationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: NotificationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createNotification(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<NotificationInterface>({
    initialValues: {
      message: '',
      read_status: false,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: notificationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Notification
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'notification',
  operation: AccessOperationEnum.CREATE,
})(NotificationCreatePage);

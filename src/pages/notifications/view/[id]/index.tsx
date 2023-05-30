import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getNotificationById } from 'apiSdk/notifications';
import { Error } from 'components/error';
import { NotificationInterface } from 'interfaces/notification';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function NotificationViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<NotificationInterface>(
    () => (id ? `/notifications/${id}` : null),
    () =>
      getNotificationById(id, {
        relations: ['user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Notification Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Message: {data?.message}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Read Status: {data?.read_status}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Created At: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              User: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.name}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'notification',
  operation: AccessOperationEnum.READ,
})(NotificationViewPage);

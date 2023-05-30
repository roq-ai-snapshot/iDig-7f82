import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getProjectById } from 'apiSdk/projects';
import { Error } from 'components/error';
import { ProjectInterface } from 'interfaces/project';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function ProjectViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ProjectInterface>(
    () => (id ? `/projects/${id}` : null),
    () =>
      getProjectById(id, {
        relations: ['excavator', 'user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Project Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Location: {data?.location}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Soil Type: {data?.soil_type}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Start Date: {data?.start_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              End Date: {data?.end_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Excavator: <Link href={`/excavators/view/${data?.excavator?.id}`}>{data?.excavator?.name}</Link>
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Contributor: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.name}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'project',
  operation: AccessOperationEnum.READ,
})(ProjectViewPage);

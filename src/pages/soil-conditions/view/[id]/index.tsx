import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getSoilConditionById } from 'apiSdk/soil-conditions';
import { Error } from 'components/error';
import { SoilConditionInterface } from 'interfaces/soil-condition';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function SoilConditionViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SoilConditionInterface>(
    () => (id ? `/soil-conditions/${id}` : null),
    () =>
      getSoilConditionById(id, {
        relations: ['project'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Soil Condition Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Soil Type: {data?.soil_type}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Depth: {data?.depth}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Moisture Content: {data?.moisture_content}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Bearing Capacity: {data?.bearing_capacity}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Project: <Link href={`/projects/view/${data?.project?.id}`}>{data?.project?.location}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'soil_condition',
  operation: AccessOperationEnum.READ,
})(SoilConditionViewPage);

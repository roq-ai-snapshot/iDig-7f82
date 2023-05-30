import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getSoilConditions, deleteSoilConditionById } from 'apiSdk/soil-conditions';
import { SoilConditionInterface } from 'interfaces/soil-condition';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function SoilConditionListPage() {
  const { data, error, isLoading, mutate } = useSWR<SoilConditionInterface[]>(
    () => '/soil-conditions',
    () =>
      getSoilConditions({
        relations: ['project'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteSoilConditionById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Soil Condition
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Link href={`/soil-conditions/create`}>
          <Button colorScheme="blue" mr="4">
            Create
          </Button>
        </Link>
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Soil Type</Th>
                  <Th>Depth</Th>
                  <Th>Moisture Content</Th>
                  <Th>Bearing Capacity</Th>
                  <Th>Project</Th>

                  <Th>Edit</Th>
                  <Th>View</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.soil_type}</Td>
                    <Td>{record.depth}</Td>
                    <Td>{record.moisture_content}</Td>
                    <Td>{record.bearing_capacity}</Td>
                    <Td>
                      <Link href={`/projects/view/${record.project?.id}`}>{record.project?.location}</Link>
                    </Td>

                    <Td>
                      <Link href={`/soil-conditions/edit/${record.id}`} passHref legacyBehavior>
                        <Button as="a">Edit</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/soil-conditions/view/${record.id}`} passHref legacyBehavior>
                        <Button as="a">View</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'soil_condition',
  operation: AccessOperationEnum.READ,
})(SoilConditionListPage);

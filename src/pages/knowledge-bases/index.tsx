import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getKnowledgeBases, deleteKnowledgeBaseById } from 'apiSdk/knowledge-bases';
import { KnowledgeBaseInterface } from 'interfaces/knowledge-base';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function KnowledgeBaseListPage() {
  const { data, error, isLoading, mutate } = useSWR<KnowledgeBaseInterface[]>(
    () => '/knowledge-bases',
    () =>
      getKnowledgeBases({
        relations: ['user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteKnowledgeBaseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Knowledge Base
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Link href={`/knowledge-bases/create`}>
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
                  <Th>Title</Th>
                  <Th>Content</Th>
                  <Th>Created At</Th>
                  <Th>Created By</Th>

                  <Th>Edit</Th>
                  <Th>View</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.title}</Td>
                    <Td>{record.content}</Td>
                    <Td>{record.created_at as unknown as string}</Td>
                    <Td>
                      <Link href={`/users/view/${record.user?.id}`}>{record.user?.name}</Link>
                    </Td>

                    <Td>
                      <Link href={`/knowledge-bases/edit/${record.id}`} passHref legacyBehavior>
                        <Button as="a">Edit</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/knowledge-bases/view/${record.id}`} passHref legacyBehavior>
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
  entity: 'knowledge_base',
  operation: AccessOperationEnum.READ,
})(KnowledgeBaseListPage);

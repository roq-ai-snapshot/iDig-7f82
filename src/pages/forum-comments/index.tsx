import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getForumComments, deleteForumCommentById } from 'apiSdk/forum-comments';
import { ForumCommentInterface } from 'interfaces/forum-comment';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function ForumCommentListPage() {
  const { data, error, isLoading, mutate } = useSWR<ForumCommentInterface[]>(
    () => '/forum-comments',
    () =>
      getForumComments({
        relations: ['community_forum', 'user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteForumCommentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Forum Comment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Link href={`/forum-comments/create`}>
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
                  <Th>Content</Th>
                  <Th>Created At</Th>
                  <Th>Forum</Th>
                  <Th>Created By</Th>

                  <Th>Edit</Th>
                  <Th>View</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.content}</Td>
                    <Td>{record.created_at as unknown as string}</Td>
                    <Td>
                      <Link href={`/community-forums/view/${record.community_forum?.id}`}>
                        {record.community_forum?.title}
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/users/view/${record.user?.id}`}>{record.user?.name}</Link>
                    </Td>

                    <Td>
                      <Link href={`/forum-comments/edit/${record.id}`} passHref legacyBehavior>
                        <Button as="a">Edit</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/forum-comments/view/${record.id}`} passHref legacyBehavior>
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
  entity: 'forum_comment',
  operation: AccessOperationEnum.READ,
})(ForumCommentListPage);

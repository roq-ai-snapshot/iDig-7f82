import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getCommunityForumById } from 'apiSdk/community-forums';
import { Error } from 'components/error';
import { CommunityForumInterface } from 'interfaces/community-forum';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { deleteForumCommentById } from 'apiSdk/forum-comments';

function CommunityForumViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CommunityForumInterface>(
    () => (id ? `/community-forums/${id}` : null),
    () =>
      getCommunityForumById(id, {
        relations: ['user', 'forum_comment'],
      }),
  );

  const forum_commentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteForumCommentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Community Forum Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Title: {data?.title}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Content: {data?.content}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Created At: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Created By: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.name}</Link>
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Forum Comment
            </Text>
            <Link href={`/forum-comments/create?community_forum_id=${data?.id}`}>
              <Button colorScheme="blue" mr="4">
                Create
              </Button>
            </Link>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Content</Th>
                    <Th>Created At</Th>
                    <Th>Edit</Th>
                    <Th>View</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.forum_comment?.map((record) => (
                    <Tr key={record.id}>
                      <Td>{record.content}</Td>
                      <Td>{record.created_at as unknown as string}</Td>
                      <Td>
                        <Button>
                          <Link href={`/forum-comments/edit/${record.id}`}>Edit</Link>
                        </Button>
                      </Td>
                      <Td>
                        <Button>
                          <Link href={`/forum-comments/view/${record.id}`}>View</Link>
                        </Button>
                      </Td>
                      <Td>
                        <Button onClick={() => forum_commentHandleDelete(record.id)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'community_forum',
  operation: AccessOperationEnum.READ,
})(CommunityForumViewPage);

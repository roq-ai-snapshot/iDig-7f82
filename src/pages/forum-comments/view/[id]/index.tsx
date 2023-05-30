import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getForumCommentById } from 'apiSdk/forum-comments';
import { Error } from 'components/error';
import { ForumCommentInterface } from 'interfaces/forum-comment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function ForumCommentViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ForumCommentInterface>(
    () => (id ? `/forum-comments/${id}` : null),
    () =>
      getForumCommentById(id, {
        relations: ['community_forum', 'user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Forum Comment Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Comment Content: {data?.content}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Created At: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Community Forum:{' '}
              <Link href={`/community-forums/view/${data?.community_forum?.id}`}>{data?.community_forum?.title}</Link>
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Created By: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.name}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'forum_comment',
  operation: AccessOperationEnum.READ,
})(ForumCommentViewPage);

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { forumCommentValidationSchema } from 'validationSchema/forum-comments';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getForumCommentById();
    case 'PUT':
      return updateForumCommentById();
    case 'DELETE':
      return deleteForumCommentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getForumCommentById() {
    const data = await prisma.forum_comment.findFirst(convertQueryToPrismaUtil(req.query, 'forum_comment'));
    return res.status(200).json(data);
  }

  async function updateForumCommentById() {
    await forumCommentValidationSchema.validate(req.body);
    const data = await prisma.forum_comment.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteForumCommentById() {
    const data = await prisma.forum_comment.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

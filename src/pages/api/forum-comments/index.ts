import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { forumCommentValidationSchema } from 'validationSchema/forum-comments';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getForumComments();
    case 'POST':
      return createForumComment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getForumComments() {
    const data = await prisma.forum_comment.findMany(convertQueryToPrismaUtil(req.query, 'forum_comment'));
    return res.status(200).json(data);
  }

  async function createForumComment() {
    await forumCommentValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.forum_comment.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

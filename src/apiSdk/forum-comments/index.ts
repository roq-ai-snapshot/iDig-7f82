import axios from 'axios';
import queryString from 'query-string';
import { ForumCommentInterface } from 'interfaces/forum-comment';
import { GetQueryInterface } from '../../interfaces';

export const getForumComments = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/forum-comments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createForumComment = async (forumComment: ForumCommentInterface) => {
  const response = await axios.post('/api/forum-comments', forumComment);
  return response.data;
};

export const updateForumCommentById = async (id: string, forumComment: ForumCommentInterface) => {
  const response = await axios.put(`/api/forum-comments/${id}`, forumComment);
  return response.data;
};

export const getForumCommentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/forum-comments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteForumCommentById = async (id: string) => {
  const response = await axios.delete(`/api/forum-comments/${id}`);
  return response.data;
};

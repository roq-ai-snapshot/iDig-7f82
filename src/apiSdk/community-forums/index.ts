import axios from 'axios';
import queryString from 'query-string';
import { CommunityForumInterface } from 'interfaces/community-forum';
import { GetQueryInterface } from '../../interfaces';

export const getCommunityForums = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/community-forums${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCommunityForum = async (communityForum: CommunityForumInterface) => {
  const response = await axios.post('/api/community-forums', communityForum);
  return response.data;
};

export const updateCommunityForumById = async (id: string, communityForum: CommunityForumInterface) => {
  const response = await axios.put(`/api/community-forums/${id}`, communityForum);
  return response.data;
};

export const getCommunityForumById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/community-forums/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCommunityForumById = async (id: string) => {
  const response = await axios.delete(`/api/community-forums/${id}`);
  return response.data;
};

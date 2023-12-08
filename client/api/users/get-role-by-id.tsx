import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { ROLES_URL } from '@orbitelco/common';

export const getRoleById = async (context: NextPageContext, id: string) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(`${ROLES_URL}/${id}`);
  return res.data;
};

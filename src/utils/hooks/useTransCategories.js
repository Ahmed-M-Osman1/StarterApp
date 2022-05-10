import React from 'react';
import {mngmtHttp} from '../http/Http';
import {useQuery} from 'react-query';

export default function useTransCategories(type) {
  return useQuery([`TransCategories`, {type}], () =>
    mngmtHttp.get(`/transactions/categories?type=${type}`).then(response => {
      return response.data.data;
    }),
  );
}

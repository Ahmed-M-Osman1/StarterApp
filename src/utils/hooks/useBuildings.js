import React from 'react';
import {mngmtHttp} from '../http/Http';
import {useQuery} from 'react-query';

export default function useBuildings(type) {
  return useQuery([`BUILDINGS`, {type}], () =>
    mngmtHttp.get(`/properties?type=${type}`).then(response => {
      return response.data.data;
    }),
  );
}

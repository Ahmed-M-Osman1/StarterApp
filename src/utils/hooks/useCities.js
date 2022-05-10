import React from 'react';
import {http} from '../http/Http';
import {useQuery} from 'react-query';

export default function useCities() {
  return useQuery(`CITIES`, () =>
    http.get('/tenancy/api/cities/all').then(response => {
      return response.data.data;
    }),
  );
}

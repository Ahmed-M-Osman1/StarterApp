import React from 'react';
import {http} from '../http/Http';
import {useQuery} from 'react-query';

export default function useDistricts(city) {
  return useQuery([`DISTRICTS`, {city}], () =>
    http.get(`/tenancy/api/districts/all?city_id=${city}`).then(response => {
      return response.data.data;
    }),
  );
}

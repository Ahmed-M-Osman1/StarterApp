import React from 'react';
import {mngmtHttp} from '../http/Http';
import {useQuery} from 'react-query';

export default function useContacts(request_id) {
  return useQuery([`CONTACTS`, {request_id}], () =>
    mngmtHttp
      .get(`/contacts/lite-list?request_id=${request_id}`)
      .then(response => response.data.data),
  );
}

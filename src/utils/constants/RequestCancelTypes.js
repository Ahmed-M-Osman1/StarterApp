import {i18n} from '../i18n';

export const RequestCancelTypes = [
  {id: 1, name: i18n.t('requests.tenantNotAvailable')},
  {id: 2, name: i18n.t('requests.incorrectRequestInformation')},
  {id: 3, name: i18n.t('requests.cancelUponTenantRequest')},
  {id: 5, name: i18n.t('requests.iamNotAvailable')},
  {id: 4, name: i18n.t('requests.other')},
];

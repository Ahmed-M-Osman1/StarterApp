import {i18n} from '../i18n';

export const CASH = 1;
export const MADA = 2;
export const CREDIT_CARD = 3;
export const BANK_TRANSFER = 4;
export const CHEQUE = 5;

export const PaymentMethods = [
  {
    id: CASH,
    name: i18n.t('accounting.payments.methods.cash'),
  },
  {
    id: MADA,
    name: i18n.t('accounting.payments.methods.mada'),
  },
  {
    id: CREDIT_CARD,
    name: i18n.t('accounting.payments.methods.creditCard'),
  },
  {
    id: BANK_TRANSFER,
    name: i18n.t('accounting.payments.methods.bank'),
  },
  {
    id: CHEQUE,
    name: i18n.t('accounting.payments.methods.cheque'),
  },
];

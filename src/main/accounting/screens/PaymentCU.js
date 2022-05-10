import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {useQueryClient} from 'react-query';
import Header from '../../../components/Header';
import {theme} from '../../../utils/design';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import {handleError, mngmtHttp} from '../../../utils/http/Http';
import AppButton from '../../../components/AppButton';
import {PaymentMethods} from '../../../utils/constants/PaymentMethod';
import CalendarOverlay from '../../../components/CalendarOverlay';
import AppTextInput from '../../../components/AppTextInput';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {AlertHelper} from '../../../utils/AlertHelper';
import CalendarInputController from '../../../components/controlled/CalendarInputController';

const PaymentCU = ({navigation, route}) => {
  const {transaction} = route.params;

  const {t} = useTranslation();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(null);

  const mySchema = yup.object().shape({
    method: yup.object().shape({
      id: yup.string().required(t('accounting.payments.errorMethod')),
    }),
    paid_at: yup.string().required('Paid at date is required'),
    amount: yup
      .number(t('createTransaction.errorAmount'))
      .transform(value => (isNaN(value) ? undefined : value))
      .required(t('createTransaction.errorAmount'))
      .positive(t('createTransaction.errorAmount'))
      .lessThan(transaction.left + 1, t('createTransaction.errorAmountExceed')),
    details: yup.string().required(t('accounting.payments.errorDetails')),
  });

  const form = useForm({
    defaultValues: {
      method: {
        id: '',
      },
      amount: 0,
      paid_at: '',
      details: '',
    },
    resolver: yupResolver(mySchema),
  });

  const submit = () => {
    setIsLoading(true);
    mngmtHttp
      .post(`/transactions/${transaction.id}/payments`, {
        ...form.getValues(),
      })
      .then(response => {
        navigation.goBack();
        queryClient.invalidateQueries('TRANSACTIONS');
      })
      .catch(error => {
        console.log(error.response);
        setIsLoading(false);
        AlertHelper.show('error', t('common.error'), error);
        handleError(error, {
          setError: form.setError,
        });
      });
  };

  return (
    <View style={styles.container}>
      <Header name={t(route.name)} navigation={navigation} />
      <ScrollView style={{flex: 1}}>
        <View style={styles.formContainer}>
          <View style={[styles.formRowContainer, {zIndex: 10}]}>
            <AppDropDownController
              placeholder={t('accounting.payments.method')}
              data={{data: PaymentMethods}}
              control={form.control}
              name="method.id"
              error={form.formState.errors?.method?.id}
            />
          </View>
          <View style={styles.formRowContainer}>
            <AppTextInputController
              placeholder={t('common.amount')}
              keyboardType={'decimal-pad'}
              control={form.control}
              name="amount"
              placeholderTextColor={theme.blackColor}
              textColor={theme.blackColor}
              style={{height: 45}}
              error={form.formState.errors?.amount}
            />
          </View>
          <View style={styles.formRowContainer}>
            <CalendarInputController
              name="paid_at"
              control={form.control}
              title={t('accounting.payments.paid_at')}
              placeholder={t('accounting.payments.paid_at')}
              error={form.formState.errors?.paid_at}
              // state={[showCalendar, setShowCalendar]}
            />
          </View>
          <View style={styles.formRowContainer}>
            <AppTextInputController
              placeholder={t('common.details')}
              control={form.control}
              name="details"
              multiline
              style={{paddingTop: 8}}
              error={form.formState.errors?.details}
              textColor={theme.blackColor}
            />
          </View>
        </View>
        <View style={styles.btnContainer}>
          <AppButton
            title={t('common.save')}
            onPress={form.handleSubmit(submit)}
            Bcolor={theme.primaryColor}
            Tcolor={theme.whiteColor}
            loading={isLoading}
            rounded={8}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentCU;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  formContainer: {
    flex: 2,
    marginTop: 10,
  },
  btnContainer: {
    paddingVertical: 10,
  },
  formRowContainer: {
    paddingVertical: 5,
  },
});

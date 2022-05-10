import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import crashlytics from '@react-native-firebase/crashlytics';
import DocumentPicker from 'react-native-document-picker';
import AppButton from '../../../../components/AppButton';
import Header from '../../../../components/Header';
import AppText from '../../../../components/AppText';
import Scrollable from '../../../../components/Scrollable';
import AppTextInput from '../../../../components/AppTextInput';
import CalendarInputController from '../../../../components/controlled/CalendarInputController';
import CountryPhoneController from '../../../../components/controlled/CountryPhoneController';
import AppTextInputController from '../../../../components/controlled/AppTextInputController';
import AppCheckBoxController from '../../../../components/controlled/AppCheckBoxController';
import AppDropDownController from '../../../../components/controlled/AppDropDownController';
import {
  PaymentDurationInMonths,
  PaymentDurationInYears,
} from '../../../../utils/constants/PaymentDuration';
import {PaymentCycle} from '../../../../utils/constants/PaymentCycle';
import {AlertHelper} from '../../../../utils/AlertHelper';
import {mngmtHttp} from '../../../../utils/http/Http';
import {theme, WP} from '../../../../utils/design';
import AppRadioButton from '../../../../components/AppRadioButton';
import {useQuery} from 'react-query';

const TenantInfo = ({t, control, errors, tenant}) => {
  return (
    <View style={{}}>
      <View style={styles.formRowContainer}>
        <AppTextInputController
          name="name"
          control={control}
          placeholder={t('tenant.name')}
          error={errors.name}
          returnKeyType={'next'}
          keyboardType={'default'}
          editable={!tenant}
          style={{height: 45}}
          disabledTitle={true}
        />
      </View>
      {Platform.OS === 'android' ? (
        <CountryPhoneController
          pickerName="phone_country_code.id"
          name="phone_number"
          editable={!tenant}
          disabled={tenant}
          placeholder={t('signUp.mobile')}
          control={control}
          error={errors.phone_number}
          title={t('tenant.mobile')}
          disabledTitle={true}
          style={{height: 45}}
        />
      ) : (
        <View style={{zIndex: 10}}>
          <CountryPhoneController
            pickerName="phone_country_code.id"
            name="phone_number"
            editable={!tenant}
            disabled={tenant}
            placeholder={t('signUp.mobile')}
            control={control}
            error={errors.phone_number}
            title={t('tenant.mobile')}
            disabledTitle={true}
            style={{height: 45}}
          />
        </View>
      )}
      <View style={styles.formRowContainer}>
        <AppTextInputController
          name="email"
          control={control}
          placeholder={t('tenant.email')}
          error={errors.email}
          editable={!tenant}
          keyboardType={'email-address'}
          returnKeyType={'next'}
          style={{height: 45}}
          disabledTitle={true}
        />
        <AppCheckBoxController
          control={control}
          disabled={tenant}
          name={'invite_tenant'}
          text={t('tenant.invite')}
          hideDivider
        />
      </View>
    </View>
  );
};

const LeaseDetails = ({
  t,
  control,
  errors,
  tenant,
  lease,
  PaymentDuration,
  endDate,
  fileName,
  durationType,
  setDurationType,
  attachFile,
}) => {
  return (
    <View>
      {/* 1 */}
      <View style={styles.formRowContainer}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
          }}>
          <AppRadioButton
            text={t('lease.month')}
            state={durationType}
            setState={setDurationType}
            value={1}
          />
          <View style={{width: 20}} />
          <AppRadioButton
            text={t('lease.year')}
            state={durationType}
            setState={setDurationType}
            value={2}
          />
        </View>
      </View>
      {/* 1 */}
      <View style={styles.formRowContainer}>
        <View style={{flexDirection: 'row'}}>
          <CalendarInputController
            half={true}
            name="start_date"
            control={control}
            title={t('lease.startDate')}
            placeholder={t('lease.startDate')}
            // state={[showCalendar, setShowCalendar]}
            error={errors.start_date}
          />
          <View>
            <AppDropDownController
              half={true}
              disabled={lease}
              name="duration"
              placeholder={t('lease.duration')}
              data={
                durationType === 1
                  ? {data: PaymentDurationInMonths}
                  : {data: PaymentDurationInYears}
              }
              control={control}
              // error={errors.duration?.id}
            />
          </View>
        </View>
      </View>
      {/*  */}
      <View style={styles.formRowContainer}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <AppDropDownController
              half={true}
              disabled={lease}
              name="payments_count"
              placeholder={t('lease.cycle')}
              data={{data: PaymentCycle}}
              control={control}
            />
          </View>
          <AppTextInputController
            name="brokerage_fee"
            control={control}
            customWidth={WP(40)}
            title={t('lease.brokerage_fee')}
            placeholder={t('lease.enterAmount')}
            error={errors.brokerage_fee}
            editable={!lease}
            keyboardType={'number-pad'}
            returnKeyType={'next'}
            style={{height: 45}}
          />
        </View>
      </View>
      {/*  */}
      <View style={styles.formRowContainer}>
        <View style={{flexDirection: 'row'}}>
          <AppTextInputController
            customWidth={WP(40)}
            name="deposit"
            control={control}
            title={t('lease.deposit')}
            placeholder={t('lease.enterAmount')}
            error={errors.deposit}
            editable={!lease}
            returnKeyType={'next'}
            keyboardType={'number-pad'}
            style={{height: 45}}
          />
          <AppTextInputController
            name="gas"
            control={control}
            customWidth={WP(40)}
            title={t('lease.gas')}
            placeholder={t('lease.enterAmount')}
            error={errors.gas}
            editable={!lease}
            returnKeyType={'next'}
            keyboardType={'number-pad'}
            style={{height: 45}}
            // ref={input => (ref.current[1] = input)}
            // onSubmitEditing={() => {
            //   ref.current[2].focus();
            // }}
          />
        </View>
      </View>
      {/*  */}
      <View style={styles.formRowContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <AppTextInputController
            name="electricity"
            control={control}
            customWidth={WP(40)}
            title={t('lease.electricity')}
            placeholder={t('lease.enterAmount')}
            error={errors.electricity}
            editable={!lease}
            returnKeyType={'next'}
            keyboardType={'number-pad'}
            style={{height: 45}}
            // ref={input => (ref.current[2] = input)}
            // onSubmitEditing={() => {
            //   ref.current[3].focus();
            // }}
          />
          <AppTextInputController
            name="parking"
            control={control}
            customWidth={WP(40)}
            title={t('lease.parking')}
            placeholder={t('lease.enterAmount')}
            error={errors.parking}
            editable={!lease}
            returnKeyType={'next'}
            keyboardType={'number-pad'}
            style={{height: 45}}
            // ref={input => (ref.current[3] = input)}
            // onSubmitEditing={() => {
            //   ref.current[4].focus();
            // }}
          />
        </View>
      </View>
      {/*  */}
      <View style={styles.formRowContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <AppTextInputController
            name="water"
            control={control}
            customWidth={WP(40)}
            title={t('lease.water')}
            placeholder={t('lease.enterAmount')}
            error={errors.water}
            editable={!lease}
            returnKeyType={'next'}
            keyboardType={'number-pad'}
            style={{height: 45}}
            // ref={input => (ref.current[4] = input)}
            // onSubmitEditing={() => {
            //   ref.current[5].focus();
            // }}
          />
          <AppTextInputController
            customWidth={WP(40)}
            name="annual_rent"
            title={t('lease.rent')}
            placeholder={t('lease.enterAmount')}
            keyboardType={'number-pad'}
            control={control}
            editable={!lease}
            error={errors.annual_rent}
            returnKeyType={'next'}
            style={{height: 45}}
            // ref={input => (ref.current[5] = input)}
            // onSubmitEditing={() => {
            //   ref.current[6].focus();
            // }}
          />
        </View>
      </View>
      {/*  */}
      <View style={styles.formRowContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <AppTextInputController
            customWidth={WP(40)}
            name="service_charge"
            title={t('lease.service')}
            placeholder={t('lease.enterAmount')}
            keyboardType={'number-pad'}
            control={control}
            editable={!lease}
            error={errors.service_charge}
            returnKeyType={'next'}
            style={{height: 45}}
            // ref={input => (ref.current[6] = input)}
            // onSubmitEditing={() => {
            //   ref.current[7].focus();
            // }}
          />
          <AppTextInputController
            name="vat"
            control={control}
            customWidth={WP(40)}
            title={t('lease.vat')}
            placeholder={t('lease.enterAmount')}
            error={errors.vat}
            editable={!lease}
            returnKeyType={'next'}
            keyboardType={'number-pad'}
            style={{height: 45}}
            // ref={input => (ref.current[7] = input)}
          />
        </View>
      </View>
      {/*  */}
      <View style={styles.formRowContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: WP(40),
              marginHorizontal: WP(5),
            }}
            onPress={() =>
              !!lease?.contract
                ? Linking.openURL(`${lease.contract?.url}`)
                : attachFile()
            }>
            <View pointerEvents="none" style={{alignSelf: 'center'}}>
              <AppTextInputController
                customWidth={WP(40)}
                name="contract"
                icon={'paperclip'}
                control={control}
                value={fileName}
                editable={!tenant && true}
                title={t('lease.contract')}
                placeholder={t('lease.contract')}
                error={errors.contract}
                returnKeyType={'next'}
                style={{height: 45}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/*  */}
    </View>
  );
};

const AssignTenant = ({route, navigation}) => {
  const {id, tenant, lease} = route.params;

  const {t} = useTranslation();
  const ref = useRef([]);
  const [schema, setSchema] = useState(true);
  const [isLoading, setLoading] = useState();
  const [durationType, setDurationType] = useState(1);
  const [fileName, setFileName] = useState('Contract');
  const [fileToUpload, setFileToUpload] = useState();
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const mySchema = yup.object().shape({
    name: yup.string().required(t('tenant.errorName')),
    // email: yup.string().email().required(t('tenant.errorEmail')),
    phone_number: yup.string().matches(phoneRegExp, t('tenant.errorMobile')),
    deposit: yup.string().required(t('tenant.errorDeposit')),
    start_date: yup.string().required(t('tenant.errorStartDate')),
    annual_rent: yup.string().required(t('tenant.errorAnnualRent')),
    // billing_cycle: yup.string().required(t('tenant.erroBillingCycle')),
  });
  const query = useQuery(`LIST_OF_TENANTS`, () =>
    mngmtHttp.get(`/contacts/lite-list?role=CUSTOMER`).then(response => {
      return response.data.data;
    }),
  );
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      invite_tenant: 0,
      name: tenant?.name,
      email: tenant?.email ?? '',
      phone_number: tenant?.phone_number ?? '',
      phone_country_code: {
        id: tenant?.phone_country_code ?? 'SA',
      },
      start_date: `${lease?.start_date ?? ''}`,
      end_date: lease?.end_date ?? '',
      payments_count: `${lease?.payments_count ?? ''}`,
      duration: `${lease?.duration ?? ''}`,
      deposit: lease?.deposit ?? '',
      annual_rent: lease?.annual_rent ?? '',
      contract: fileToUpload,
      brokerage_fee: lease?.brokerage_fee ?? '',
      service_charge: lease?.service_charge ?? '',
      gas: lease?.gas ?? '',
      electricity: lease?.electricity ?? '',
      water: lease?.water ?? '',
      parking: lease?.parking ?? '',
      vat: lease?.vat ?? '',
    },
    resolver: schema && yupResolver(mySchema),
  });

  const [endDate, setEndDate] = useState(`${lease?.end_date || ''}`);
  const [showCalendar, setShowCalendar] = useState(null);

  const createFormData = (file, body) => {
    const data = new FormData();

    data.append('contract', {
      name: file.name,
      uri:
        Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
    });

    data.append('invite_tenant', body.invite_tenant);
    data.append('name', body.name);
    // data.append('email', body.email);
    data.append('phone_number', body.phone_number);
    data.append('phone_country_code[id]', body.phone_country_code.id);
    data.append('start_date', body.start_date);
    data.append('end_date', body.end_date);
    data.append('payments_count', body.payments_count);
    data.append('duration', body.duration);
    data.append('duration_type', durationType);
    data.append('deposit', body.deposit);
    data.append('annual_rent', body.annual_rent);
    body.service_charge && data.append('service_charge', body.service_charge);
    body.vat && data.append('vat', body.vat);
    body.brokerage_fee && data.append('brokerage_fee', body.brokerage_fee);
    body.gas && data.append('gas', body.gas);
    body.electricity && data.append('electricity', body.electricity);
    body.water && data.append('water', body.water);
    body.parking && data.append('parking', body.parking);

    return data;
  };

  const submit = async data => {
    data.end_date = endDate;
    data.invite_tenant = data.invite_tenant ? 1 : 0;
    data.duration_type = durationType;
    const dataToUplaod = fileToUpload && createFormData(fileToUpload, data);
    setLoading(true);
    mngmtHttp
      .post(
        `/properties/${id}/assign-tenant`,
        fileToUpload ? dataToUplaod : data,
      )
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(error => {
        if (error.response) {
          crashlytics().recordError(error);

          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          AlertHelper.show('error', t('common.error'), error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (watch('start_date') && !lease) {
      let tempStartDate = new Date(watch('start_date'));
      let tempEndDate = new Date(
        tempStartDate.setMonth(tempStartDate.getMonth() + watch('duration')),
      );

      setEndDate(tempEndDate.toISOString().split('T')[0]);
    }
  }, [watch('start_date'), watch('duration')]);

  const handlePressMoveOut = () => {
    navigation.navigate('MoveOut', {id: id});
  };

  const attachFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFileName(res.name);
      setFileToUpload(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    const tenant = query?.data?.find(tenant => tenant.id === watch('user_id'));
    if (!!watch('user_id')) {
      setValue('name', tenant.name);
      setValue('email', tenant.email ?? '');
      setValue('phone_number', `${tenant.phone_number}`);
      setValue('phone_country_code', {id: tenant.phone_country_code});
    }
  }, [watch('user_id')]);

  return (
    <View style={styles.container}>
      <Header name={t('property.title')} navigation={navigation} />
      <ScrollView
        contentContainerStyle={{backgroundColor: theme.whiteColor}}
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Scrollable>
          <View style={styles.formContainer}>
            <View style={{height: 10}} />
            <View style={{marginHorizontal: 15}}>
              <AppText
                regular
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                Tcolor={'#005373'}
                textAlign={'left'}>
                {t('editForm.tenantInfo')}
              </AppText>
            </View>
            <View style={{height: 10}} />
            <View style={{height: 20}} />
            <AppDropDownController
              placeholder={t('AssignTenant.selectTenant')}
              data={query}
              control={control}
              name="user_id"
              error={errors.user_id}
            />
            <TenantInfo
              t={t}
              control={control}
              errors={errors}
              tenant={tenant}
            />

            <View style={{marginHorizontal: 15}}>
              <AppText
                regular
                fontSize={theme.titleFontSize}
                Tcolor={'#005373'}
                textAlign={'left'}>
                {t('assignToProperty.leaseDetails')}
              </AppText>
            </View>
            {/*  */}
            <LeaseDetails
              t={t}
              control={control}
              errors={errors}
              tenant={tenant}
              lease={lease}
              endDate={endDate}
              ref={ref}
              fileName={fileName}
              durationType={durationType}
              setDurationType={setDurationType}
              attachFile={attachFile}
            />
            {/*  */}
          </View>

          <View style={styles.btnContainer}>
            <AppButton
              title={tenant ? t('editForm.moveOut') : t('common.complete')}
              onPress={tenant ? handlePressMoveOut : handleSubmit(submit)}
              Bcolor={tenant ? '#7c7c7c' : theme.primaryColor}
              Tcolor={theme.whiteColor}
              loading={isLoading}
              rounded={8}
            />
          </View>
        </Scrollable>
      </ScrollView>
    </View>
  );
};

export default AssignTenant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
    flexGrow: 1,
  },
  titleContainer: {
    alignContent: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 40,
    height: 50,
  },
  formContainer: {
    // flex: 2,
    marginTop: 10,
  },
  btnContainer: {
    // backgroundColor: '#ccc',
    paddingVertical: 10,
  },
  formRowContainer: {
    paddingVertical: 10,
  },
});

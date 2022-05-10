import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import DocumentPicker from 'react-native-document-picker';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import Header from '../../../../components/Header';
import AppText from '../../../../components/AppText';
import AppTextInput from '../../../../components/AppTextInput';
import Scrollable from '../../../../components/Scrollable';
import AppButton from '../../../../components/AppButton';
import CalendarInputController from '../../../../components/controlled/CalendarInputController';
import AppTextInputController from '../../../../components/controlled/AppTextInputController';
import AppDropDownController from '../../../../components/controlled/AppDropDownController';
import {PaymentDuration} from '../../../../utils/constants/PaymentDuration';
import {PaymentCycle} from '../../../../utils/constants/PaymentCycle';
import {AlertHelper} from '../../../../utils/AlertHelper';
import {mngmtHttp} from '../../../../utils/http/Http';
import {theme, WP} from '../../../../utils/design';

const EditLease = ({route, navigation}) => {
  const {id, lease, type} = route.params;

  const ref = useRef([]);
  const {t} = useTranslation();
  const [isLoading, setLoading] = useState();
  const [fileName, setFileName] = useState(
    lease ? lease.contract[0]?.url?.split('files/')[1] : 'Contract',
  );
  const [fileToUpload, setFileToUpload] = useState();
  const [showCalendar, setShowCalendar] = useState(null);

  const mySchema = yup.object().shape({
    deposit: yup.string().required(t('tenant.errorDeposit')),
    start_date: yup.string().required(t('tenant.errorStartDate')),
    annual_rent: yup.string().required(t('tenant.errorAnnualRent')),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      start_date: `${lease?.start_date || ''}`,
      end_date: `${lease?.end_date || ''}`,
      payments_count: `${lease?.payments_count || ''}`,
      duration: `${lease?.duration || ''}`,
      deposit: lease ? (lease?.deposit ? lease?.deposit : '0') : '',
      annual_rent: lease ? (lease?.annual_rent ? lease?.annual_rent : '0') : '',
      contract: fileToUpload,
      brokerage_fee: lease
        ? lease?.brokerage_fee
          ? lease?.brokerage_fee
          : '0'
        : '',
      service_charge: lease
        ? lease?.service_charge
          ? lease?.service_charge
          : '0'
        : '',
      gas: lease ? (lease?.gas ? lease?.gas : '0') : '',
      electricity: lease ? (lease?.electricity ? lease?.electricity : '0') : '',
      water: lease ? (lease?.water ? lease?.water : '0') : '',
      parking: lease ? (lease?.parking ? lease?.parking : '0') : '',
      vat: lease ? (lease?.vat ? lease?.vat : '0') : '',
    },
    resolver: yupResolver(mySchema),
  });

  useEffect(() => {
    if (watch('start_date') && !lease) {
      let tempStartDate = new Date(watch('start_date'));
      let tempEndDate = new Date(
        tempStartDate.setMonth(tempStartDate.getMonth() + watch('duration')),
      );
      setValue('end_date', tempEndDate.toISOString().split('T')[0]);
    }
  }, [watch('start_date'), watch('duration')]);

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

  const createFormData = (file, body) => {
    const data = new FormData();

    data.append('contract', {
      name: file.name,
      uri:
        Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
    });
    data.append('start_date', body.start_date);
    data.append('end_date', body.end_date);
    data.append('payments_count', body.payments_count);
    data.append('duration', body.duration);
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

  const renewLease = async data => {
    setLoading(true);
    try {
      const dataToUplaod = fileToUpload && createFormData(fileToUpload, data);
      await mngmtHttp
        .post(
          `/properties/${id}/renew-lease`,
          fileToUpload ? dataToUplaod : data,
        )
        .then(() => {
          setLoading(false);
          navigation.goBack();
        });
    } catch (error) {
      crashlytics().recordError(error);
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        AlertHelper.show('error', t('common.error'), error);
      }
    }
  };

  return (
    <Scrollable>
      <Header name={' '} navigation={navigation} />
      <View style={styles.titleContainer}>
        <AppText
          fontSize={theme.superTitleFontSize}
          Tcolor={theme.primaryColor}
          textAlign={'center'}>
          {t('assignToProperty.leaseDetails')}
        </AppText>
      </View>
      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.leaseDetailsContainer}>
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
                    name="duration"
                    placeholder={t('lease.duration')}
                    data={{data: PaymentDuration}}
                    control={control}
                    // error={errors.duration?.id}
                  />
                </View>
              </View>
            </View>
            <View style={styles.formRowContainer}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <AppDropDownController
                    half={true}
                    name="payments_count"
                    placeholder={t('lease.cycle')}
                    data={{data: PaymentCycle}}
                    control={control}
                  />
                </View>
                <View pointerEvents="none">
                  <AppTextInput
                    customWidth={WP(40)}
                    value={watch('end_date')}
                    placeholder={t('lease.endDate')}
                    style={{height: 45, backgroundColor: '#eee'}}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.formRowContainer]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <AppTextInputController
                  name="brokerage_fee"
                  control={control}
                  customWidth={WP(40)}
                  title={t('lease.brokerage_fee')}
                  placeholder={t('lease.enterAmount')}
                  error={errors.name}
                  returnKeyType={'next'}
                  keyboardType={'number-pad'}
                  onSubmitEditing={() => {
                    ref.current[0].focus();
                  }}
                  style={{height: 45, color: theme.blackColor}}
                />
                <View>
                  <AppTextInputController
                    customWidth={WP(40)}
                    name="deposit"
                    control={control}
                    title={t('lease.deposit')}
                    placeholder={t('lease.enterAmount')}
                    error={errors.deposit}
                    returnKeyType={'next'}
                    keyboardType={'number-pad'}
                    style={{height: 45, color: theme.blackColor}}
                    ref={input => (ref.current[0] = input)}
                    onSubmitEditing={() => {
                      ref.current[1].focus();
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.formRowContainer]}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <AppTextInputController
                name="gas"
                control={control}
                customWidth={WP(40)}
                title={t('lease.gas')}
                placeholder={t('lease.enterAmount')}
                error={errors.name}
                returnKeyType={'next'}
                keyboardType={'number-pad'}
                style={{height: 45, color: theme.blackColor}}
                ref={input => (ref.current[1] = input)}
                onSubmitEditing={() => {
                  ref.current[2].focus();
                }}
              />
              <AppTextInputController
                name="electricity"
                control={control}
                customWidth={WP(40)}
                title={t('lease.electricity')}
                placeholder={t('lease.enterAmount')}
                error={errors.name}
                returnKeyType={'next'}
                keyboardType={'number-pad'}
                style={{height: 45, color: theme.blackColor}}
                ref={input => (ref.current[2] = input)}
                onSubmitEditing={() => {
                  ref.current[3].focus();
                }}
              />
            </View>
          </View>
          <View style={[styles.formRowContainer]}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <AppTextInputController
                name="parking"
                control={control}
                customWidth={WP(40)}
                title={t('lease.parking')}
                placeholder={t('lease.enterAmount')}
                error={errors.name}
                returnKeyType={'next'}
                keyboardType={'number-pad'}
                style={{height: 45, color: theme.blackColor}}
                ref={input => (ref.current[3] = input)}
                onSubmitEditing={() => {
                  ref.current[4].focus();
                }}
              />
              <AppTextInputController
                name="water"
                control={control}
                customWidth={WP(40)}
                title={t('lease.water')}
                placeholder={t('lease.enterAmount')}
                error={errors.name}
                returnKeyType={'next'}
                keyboardType={'number-pad'}
                style={{height: 45, color: theme.blackColor}}
                ref={input => (ref.current[4] = input)}
                onSubmitEditing={() => {
                  ref.current[5].focus();
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}>
            <AppTextInputController
              customWidth={WP(40)}
              name="annual_rent"
              title={t('lease.rent')}
              placeholder={t('lease.enterAmount')}
              keyboardType={'number-pad'}
              control={control}
              error={errors.annual_rent}
              returnKeyType={'next'}
              style={{height: 45, color: theme.blackColor}}
              ref={input => (ref.current[5] = input)}
              onSubmitEditing={() => {
                ref.current[6].focus();
              }}
            />
            <AppTextInputController
              customWidth={WP(40)}
              name="service_charge"
              title={t('lease.service')}
              placeholder={t('lease.enterAmount')}
              keyboardType={'number-pad'}
              control={control}
              error={errors.annual_rent}
              returnKeyType={'next'}
              style={{height: 45, color: theme.blackColor}}
              ref={input => (ref.current[6] = input)}
              onSubmitEditing={() => {
                ref.current[7].focus();
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}>
            <AppTextInputController
              ref={input => (ref.current[7] = input)}
              name="vat"
              control={control}
              customWidth={WP(40)}
              title={t('lease.vat')}
              placeholder={t('lease.enterAmount')}
              error={errors.name}
              returnKeyType={'next'}
              keyboardType={'number-pad'}
              style={{height: 45, color: theme.blackColor}}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                width: WP(40),
                marginHorizontal: WP(5),
              }}
              onPress={() =>
                lease.contract
                  ? Linking.openURL(
                      `https://${lease.contract[0]?.url.split('https://')[2]}`,
                    )
                  : attachFile()
              }>
              <View pointerEvents="none" style={{alignSelf: 'center'}}>
                <AppTextInputController
                  customWidth={WP(40)}
                  name="contract"
                  icon={'paperclip'}
                  control={control}
                  value={fileName}
                  editable={false}
                  title={t('lease.contract')}
                  placeholder={t('lease.contract')}
                  error={errors.contract}
                  returnKeyType={'next'}
                  style={{height: 45, color: theme.blackColor}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.btnContainer}>
          <AppButton
            title={t('common.complete')}
            onPress={handleSubmit(renewLease)} //lease ? editLease :
            Bcolor={theme.primaryColor}
            Tcolor={theme.whiteColor}
            loading={isLoading}
            rounded={8}
          />
        </View>
      </ScrollView>
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  titleContainer: {
    alignContent: 'center',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 40,
    height: 50,
  },
  formContainer: {
    flex: 1,
    marginTop: 10,
  },
  btnContainer: {
    // backgroundColor: '#ccc',
    paddingVertical: 10,
  },
  formRowContainer: {
    paddingVertical: 0,
  },
});

export default EditLease;

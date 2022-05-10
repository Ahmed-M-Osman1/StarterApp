import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import crashlytics from '@react-native-firebase/crashlytics';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import AppButton from '../../../../components/AppButton';
import Header from '../../../../components/Header';
import AppText from '../../../../components/AppText';
import Scrollable from '../../../../components/Scrollable';
import CountryPhoneController from '../../../../components/controlled/CountryPhoneController';
import AppTextInputController from '../../../../components/controlled/AppTextInputController';
import AppCheckBoxController from '../../../../components/controlled/AppCheckBoxController';
import {theme, WP} from '../../../../utils/design';
import {AlertHelper} from '../../../../utils/AlertHelper';
import {mngmtHttp} from '../../../../utils/http/Http';
import AppDropDownController from '../../../../components/controlled/AppDropDownController';
import {useQuery} from 'react-query';

const AssignOwner = ({route, navigation}) => {
  const {id, owner, property} = route.params;
  const {t} = useTranslation();
  const [schema, setSchema] = useState(true);
  const [isLoading, setLoading] = useState();

  const query = useQuery(`LIST_OF_OWNERS`, () =>
    mngmtHttp.get(`/contacts/lite-list?role=OWNER`).then(response => {
      return response.data.data;
    }),
  );

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const mySchema = yup.object().shape({
    name: yup.string().required(t('owner.errorName')),
    //email: yup.string().email().required(t('owner.errorEmail')),
    phone_number: yup.string().matches(phoneRegExp, t('owner.errorMobile')),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      invite_owner: false,
      name: owner?.name,
      email: owner?.email ?? '',
      phone_number: owner?.phone_number ?? '',
      phone_country_code: {
        id: owner ? owner?.phone_country_code : 'SA',
      },
      iam_owner: false,
      user_id: '',
    },
    resolver: schema && yupResolver(mySchema),
  });
  const iam_owner = watch('iam_owner');

  const submit = async data => {
    setLoading(true);
    try {
      await mngmtHttp.post(`/properties/${id}/assign-owner`, data).then(() => {
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

  useEffect(() => {
    const owner = query?.data?.find(owner => owner.id === watch('user_id'));
    if (!!watch('user_id')) {
      setValue('name', owner.name);
      setValue('email', owner.email ?? '');
      setValue('phone_number', `${owner.phone_number}`);
      setValue('phone_country_code', {id: owner.phone_country_code});
    }
  }, [watch('user_id')]);

  return (
    <View style={styles.container}>
      <Header name={t('property.title')} navigation={navigation} />
      <View style={{height: 20}} />
      <View style={{flex: 1}}>
        <View style={{marginHorizontal: 10}}>
          <AppText
            fontSize={theme.s1.size}
            fontWeight={theme.s1.fontWeight}
            Tcolor={theme.primaryColor}
            textAlign={'left'}>
            {t('AssignOwner.title')} {property?.name ?? ''}
          </AppText>
        </View>
        <View style={{height: 20}} />
        <AppDropDownController
          placeholder={t('AssignOwner.selectOwner')}
          data={query}
          control={control}
          name="user_id"
          error={errors.user_id}
        />
        <View style={styles.formRowContainer}>
          <AppTextInputController
            name="name"
            control={control}
            keyboardType={'default'}
            placeholder={t('owner.name')}
            error={errors.name}
            editable={!iam_owner && !owner}
            style={[
              {height: 45},
              (iam_owner || owner) && {backgroundColor: '#eee'},
            ]}
            placeholderTextColor={'#7C7C7C'}
            textColor={theme.blackColor}
            disabledTitle
          />
        </View>
        {Platform.OS === 'android' ? (
          <CountryPhoneController
            pickerName="phone_country_code.id"
            name="phone_number"
            placeholder={t('owner.mobile')}
            // title={t('owner.mobile')}
            disabledTitle={true}
            control={control}
            error={errors.phone_number}
            editable={!iam_owner && !owner}
            disabled={iam_owner || owner}
            keyboardType={'phone-pad'}
            style={[
              {
                height: 45,
              },
              (iam_owner || owner) && {backgroundColor: '#eee'},
            ]}
            pickerStyle={[(iam_owner || owner) && {backgroundColor: '#eee'}]}
          />
        ) : (
          <View style={{zIndex: 10}}>
            <CountryPhoneController
              pickerName="phone_country_code.id"
              name="phone_number"
              placeholder={t('owner.mobile')}
              disabledTitle={true}
              control={control}
              error={errors.phone_number}
              editable={!iam_owner && !owner}
              disabled={iam_owner || owner}
              keyboardType={'phone-pad'}
              style={[
                {
                  height: 45,
                },
                (iam_owner || owner) && {backgroundColor: '#eee'},
              ]}
              pickerStyle={[(iam_owner || owner) && {backgroundColor: '#eee'}]}
            />
          </View>
        )}
        <View style={styles.formRowContainer}>
          <AppTextInputController
            name="email"
            control={control}
            placeholder={t('owner.email')}
            keyboardType={'email-address'}
            error={errors.email}
            editable={!iam_owner && !owner}
            style={[
              {height: 45},
              (iam_owner || owner) && {backgroundColor: '#eee'},
            ]}
            placeholderTextColor={'#7C7C7C'}
            textColor={theme.blackColor}
            disabledTitle
          />
        </View>
      </View>

      <View style={{marginVertical: 20}}>
        <AppButton
          title={t(!owner ? 'AssignOwner.assign' : 'AssignOwner.reassign')}
          onPress={handleSubmit(submit)}
          Bcolor={theme.primaryColor}
          rounded={8}
          Tcolor={theme.whiteColor}
          loading={isLoading}
        />
      </View>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <AppText
                fontSize={theme.superTitleFontSize}
                Tcolor={theme.primaryColor}
                textAlign={'center'}>
                {t('assignToProperty.title')}
              </AppText>
              <AppText fontSize={theme.subTitleFontSize} Tcolor={'#2A3D47'}>
                {t('assignToProperty.subTitle')}
              </AppText>
            </View>
            <View style={styles.formRowContainer}>
              <AppTextInputController
                name="name"
                control={control}
                keyboardType={'default'}
                placeholder={t('owner.name')}
                error={errors.name}
                editable={!iam_owner && !owner}
                style={[{height: 45}, iam_owner && {backgroundColor: '#eee'}]}
                placeholderTextColor={'#7C7C7C'}
                textColor={theme.blackColor}
                disabledTitle
              />
            </View>
            {Platform.OS === 'android' ? (
              <CountryPhoneController
                pickerName="phone_country_code.id"
                name="phone_number"
                placeholder={t('owner.mobile')}
                // title={t('owner.mobile')}
                disabledTitle={true}
                control={control}
                error={errors.phone_number}
                editable={!iam_owner && !owner}
                disabled={iam_owner || owner}
                keyboardType={'phone-pad'}
                style={[
                  {
                    height: 45,
                    // color: '#7C7C7C',
                    // borderRadius: 5,
                  },
                  iam_owner && {backgroundColor: '#eee'},
                ]}
                // pickerStyle={{
                //   // height: 45,
                //   // marginHorizontal: 0,
                //   borderRadius: 5,
                //   borderColor: theme.primaryColor,
                //   borderWidth: 15,
                //   // marginTop: 15,
                // }}
                // pickerDropDownStyle={{backgroundColor: theme.whiteColor}}
              />
            ) : (
              <View style={{zIndex: 10}}>
                <CountryPhoneController
                  pickerName="phone_country_code.id"
                  name="phone_number"
                  placeholder={t('owner.mobile')}
                  // title={t('owner.mobile')}
                  disabledTitle={true}
                  control={control}
                  error={errors.phone_number}
                  editable={!iam_owner && !owner}
                  disabled={iam_owner || owner}
                  keyboardType={'phone-pad'}
                  style={[
                    {
                      height: 45,
                      // color: '#7C7C7C',
                      // borderRadius: 5,
                    },
                    iam_owner && {backgroundColor: '#eee'},
                  ]}
                  // pickerStyle={{
                  //   // height: 45,
                  //   // marginHorizontal: 0,
                  //   borderRadius: 5,
                  //   borderColor: theme.primaryColor,
                  //   borderWidth: 15,
                  //   // marginTop: 15,
                  // }}
                  // pickerDropDownStyle={{backgroundColor: theme.whiteColor}}
                />
              </View>
            )}

            <View style={styles.formRowContainer}>
              <AppTextInputController
                name="email"
                control={control}
                placeholder={t('owner.email')}
                keyboardType={'email-address'}
                error={errors.email}
                editable={!iam_owner && !owner}
                style={[{height: 45}, iam_owner && {backgroundColor: '#eee'}]}
                placeholderTextColor={'#7C7C7C'}
                textColor={theme.blackColor}
                disabledTitle
              />
            </View>

            <AppCheckBoxController
              control={control}
              name={'invite_owner'}
              // disabled={iam_owner || owner}
              text={t('owner.invite')}
              checkboxContainerStyle={{}}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.btnContainer}>
        <AppButton
          title={owner ? t('common.delete') : t('common.complete')}
          onPress={owner ? handlePressDel : handleSubmit(submit)}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
          loading={isLoading}
          rounded={8}
        />
      </View> */}
    </View>
  );
};

export default AssignOwner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
    zIndex: 0,
  },
  titleContainer: {
    alignContent: 'center',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 40,
    marginVertical: 40,
  },
  formContainer: {
    flex: 1,
  },
  btnContainer: {
    backgroundColor: theme.whiteColor,
    paddingVertical: 10,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    zIndex: 0,
  },
  formRowContainer: {
    paddingVertical: 10,
    zIndex: 0,
  },
});

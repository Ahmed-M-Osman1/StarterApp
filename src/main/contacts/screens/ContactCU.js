import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {Divider} from 'react-native-elements';
import crashlytics from '@react-native-firebase/crashlytics';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import Header from '../../../components/Header';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import CountryPhoneController from '../../../components/controlled/CountryPhoneController';
import AppCheckBox from '../../../components/AppCheckBox';
import PermissionsForm from '../components/PermissionsForm';
import * as Actions from '../../../utils/constants/PermissionAction';
import * as Subjects from '../../../utils/constants/PermissionSubject';
import {Management} from '../../../utils/constants/Role';
import {transformPermissions} from '../helpers/TransformPermissions';
import {theme, WP} from '../../../utils/design';
import {AlertHelper} from '../../../utils/AlertHelper';
import {mngmtHttp} from '../../../utils/http/Http';
import {useDispatch} from 'react-redux';
import {setLoading} from '../../../redux/misc';

export default function ContactCU({route, navigation}) {
  const {type, item} = route.params;
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const [invite, setInvite] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(false);

  const handlePress = async data => {
    const {permissions} = form.getValues();

    try {
      setButtonLoading(true);
      if (item) {
        await mngmtHttp.put(`/contacts/${item.id}`, {
          ...data,
          role: type,
          invite,
        });
        if (type === Management) {
          const permissionsPayload = transformPermissions(permissions);
          await mngmtHttp.post(`/contacts/${item.id}/attach-permissions`, {
            subjects: permissionsPayload,
          });
        }
        setButtonLoading(false);
        navigation.goBack();
      } else {
        const response = await mngmtHttp.post(`/contacts`, {
          ...data,
          role: type,
          invite,
        });
        if (type === Management) {
          const permissionsPayload = transformPermissions(permissions);
          await mngmtHttp.post(
            `/contacts/${response.data.data.id}/attach-permissions`,
            {subjects: permissionsPayload},
          );
          setButtonLoading(false);
          navigation.goBack();
        }
      }
      setButtonLoading(false);
      navigation.goBack();
    } catch (error) {
      crashlytics().recordError(error);
      setButtonLoading(false);
      AlertHelper.show('error', t('common.error'), error);
    }
  };
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const mySchema = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
  });

  const mySchemaWithEmail = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
    email: yup.string().email().required(t('signUp.errorEmail')),
  });

  const form = useForm({
    defaultValues: {
      name: item?.name,
      email: item?.email,
      phone_number: item?.phone_number,
      phone_country_code: {
        id: item?.phone_country_code ? item?.phone_country_code : 'SA',
      },
      permissions: {
        [Subjects.CONTACTS]: {
          [Actions.VIEW]: false,
          [Actions.CREATE]: false,
          [Actions.UPDATE]: false,
          [Actions.DELETE]: false,
        },
        [Subjects.COMMUNITIES]: {
          [Actions.VIEW]: false,
          [Actions.CREATE]: false,
          [Actions.UPDATE]: false,
          [Actions.DELETE]: false,
        },
        [Subjects.BUILDINGS]: {
          [Actions.VIEW]: false,
          [Actions.CREATE]: false,
          [Actions.UPDATE]: false,
          [Actions.DELETE]: false,
        },
        [Subjects.UNITS]: {
          [Actions.VIEW]: false,
          [Actions.CREATE]: false,
          [Actions.UPDATE]: false,
          [Actions.DELETE]: false,
        },
        [Subjects.TRANSACTIONS]: {
          [Actions.VIEW]: false,
          [Actions.CREATE]: false,
          [Actions.UPDATE]: false,
          [Actions.DELETE]: false,
        },
        [Subjects.REQUESTS]: {
          [Actions.VIEW]: false,
          [Actions.CREATE]: false,
          [Actions.UPDATE]: false,
          [Actions.DELETE]: false,
        },
        [Subjects.DASHBOARD]: {
          [Actions.VIEW]: false,
        },
      },
    },
    resolver: yupResolver(mySchema),
  });

  const deleteContact = () => {
    Alert.alert(t('common.delete'), `${item?.name}`, [
      {
        text: t('property.no'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('property.yes'),
        onPress: async () => {
          try {
            dispatch(setLoading(true));
            await mngmtHttp.delete(`/contacts/${item.id}`).then(() => {
              dispatch(setLoading(false));
              navigation.goBack();
            });
          } catch (error) {
            dispatch(setLoading(false));
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              AlertHelper.show('error', t('common.error'), error);
            }
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.rootContainer}>
      <Header
        name={i18n.t(`contacts.roles.${route.params.type}`)}
        navigation={navigation}
        LeftIcon={'trash'}
        LeftIconColor={theme.blackColor}
        onPressLeftIcon={deleteContact}
      />
      <ScrollView style={{flex: 1, marginTop: 30}}>
        <View style={styles.titleContainer}>
          <AppText
            fontSize={theme.superTitleFontSize}
            Tcolor={theme.primaryColor}
            textAlign={'center'}>
            {t(`contacts.createTitle.${type}`)}
          </AppText>
        </View>
        <View style={[styles.formRowContainer, {paddingBottom: 10}]}>
          <AppTextInputController
            name="name"
            placeholder={t('contacts.contactCU.name')}
            keyboardType={'default'}
            error={form.formState.errors.name}
            control={form.control}
            rules={{required: true}}
            returnKeyType={'next'}
            style={{height: 45}}
            textColor={theme.blackColor}
          />
        </View>
        {Platform.OS === 'android' ? (
          <CountryPhoneController
            pickerName="phone_country_code.id"
            name="phone_number"
            placeholder={t('owner.mobile')}
            title={t('owner.mobile')}
            disabledTitle={true}
            control={form.control}
            error={form.formState.errors.phone_number}
            style={{
              height: 45,
              color: theme.blackColor,
              // borderRadius: 5,
            }}
            pickerStyle={{
              // marginTop: 15,
              height: 45,
            }}
            pickerDropDownStyle={{
              backgroundColor: theme.whiteColor,
            }}
            textColor={theme.blackColor}
          />
        ) : (
          <View style={{zIndex: 10}}>
            <CountryPhoneController
              pickerName="phone_country_code.id"
              name="phone_number"
              placeholder={t('owner.mobile')}
              title={t('owner.mobile')}
              disabledTitle={true}
              control={form.control}
              error={form.formState.errors.phone_number}
              style={{
                height: 45,
                color: theme.blackColor,
                // borderRadius: 5,
              }}
              pickerStyle={{
                // marginTop: 15,
                height: 45,
              }}
              pickerDropDownStyle={{
                backgroundColor: theme.whiteColor,
              }}
              textColor={theme.blackColor}
            />
          </View>
        )}
        <View style={styles.formRowContainer}>
          <AppTextInputController
            name="email"
            control={form.control}
            placeholder={t('contacts.contactCU.email')}
            keyboardType={'email-address'}
            error={form.formState.errors.email}
            rules={{required: true}}
            returnKeyType={'next'}
            style={{height: 45}}
            textColor={theme.blackColor}
          />
        </View>

        <AppCheckBox
          text={t('contacts.invite')}
          state={[invite, setInvite]}
          hideDivider={true}
          onPress={() => {}}
        />
        {type === Management && (
          <>
            <Divider style={styles.divider} />
            <PermissionsForm form={form} />
          </>
        )}
        <AppButton
          title={t('common.save')}
          onPress={form.handleSubmit(handlePress)}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
          loading={isButtonLoading}
          rounded={8}
        />
        <AppButton
          title={'See Transaction History'}
          onPress={() => {
            navigation.navigate('TransactionHistory', {contact: item?.id});
          }}
          rounded={8}
          Bcolor={theme.whiteColor}
          Tcolor={theme.primaryColor}
          style={{borderWidth: 1, borderColor: theme.primaryColor}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: theme.whiteColor,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  titleContainer: {
    flex: 1,
    alignContent: 'center',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 40,
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

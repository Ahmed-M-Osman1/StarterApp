import React from 'react';
import {View, Platform} from 'react-native';
import {theme} from '../../../utils/design';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import CountryPhoneController from '../../../components/controlled/CountryPhoneController';
import AppCheckBox from '../../../components/AppCheckBox';
import AppText from '../../../components/AppText';

const UserDetailsForm = ({
  control,
  errors,
  t,
  invite,
  setInvite,
  userType = 'User',
}) => {
  return (
    <>
      {/*  */}
      <View style={{paddingHorizontal: 20}}>
        <AppText
          regular
          fontSize={theme.h6.size}
          fontWeight={theme.h6.fontWeight}
          Tcolor={theme.primaryColor}
          textAlign={'left'}>
          {t(`UserDetailsForm.${userType} Details`)}
        </AppText>
        <View style={{height: 10}} />
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t(`UserDetailsForm.subtitle`)}
        </AppText>
        <View style={{height: 10}} />
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.greyColor}
          textAlign={'left'}>
          {t('UserDetailsForm.inviteMessage')}
        </AppText>
      </View>

      <View style={{height: 15}} />
      {/*  */}
      <View style={{marginHorizontal: 20}}>
        <AppTextInputController
          name={`name`}
          keyboardType={'default'}
          control={control}
          placeholder={t('UserDetailsForm.name')}
          error={errors.name}
          customMargin={0}
          customWidth={'100%'}
          disabledTitle
          style={{height: 45, borderRadius: 6}}
          textColor={theme.blackColor}
          backgroundColor={theme.whiteColor}
          placeholderTextColor={theme.greyColor}
        />
        <View style={{height: 15}} />
        {Platform.OS === 'android' ? (
          <CountryPhoneController
            pickerName="phone_country_code.id"
            name="phone_number"
            placeholder={t('UserDetailsForm.mobile')}
            title={t('UserDetailsForm.mobile')}
            disabledTitle={true}
            control={control}
            error={errors.phone_number}
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
            noMargin
            keyboardType={'number-pad'}
          />
        ) : (
          <View
            style={{
              zIndex: 10,
            }}>
            <CountryPhoneController
              pickerName="phone_country_code.id"
              name="phone_number"
              placeholder={t('UserDetailsForm.mobile')}
              title={t('UserDetailsForm.mobile')}
              disabledTitle={true}
              control={control}
              error={errors.phone_number}
              style={{
                height: 45,
                color: theme.blackColor,
                // borderRadius: 5,
                // width: '100%',
              }}
              pickerStyle={{
                // marginTop: 15,
                height: 45,
                // width: '100%',
              }}
              pickerDropDownStyle={{
                backgroundColor: theme.whiteColor,
              }}
              textColor={theme.blackColor}
              noMargin
              keyboardType={'number-pad'}
            />
          </View>
        )}
        <View style={{height: 15}} />
        <AppTextInputController
          name={`email`}
          keyboardType={'email-address'}
          control={control}
          placeholder={t('UserDetailsForm.email')}
          error={errors.email}
          customMargin={0}
          customWidth={'100%'}
          disabledTitle
          style={{height: 45, borderRadius: 6}}
          textColor={theme.blackColor}
          backgroundColor={theme.whiteColor}
          placeholderTextColor={theme.greyColor}
        />
      </View>
      {/*  */}
      <View>
        <AppCheckBox
          text={t('UserDetailsForm.sendInvite')}
          textStyle={{fontFamily: null, color: theme.greyColor}}
          state={[invite, setInvite]}
          hideDivider
          checkboxContainerStyle={{paddingVertical: 0}}
        />
      </View>
    </>
  );
};

export default UserDetailsForm;

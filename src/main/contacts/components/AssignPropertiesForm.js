import React from 'react';
import {View} from 'react-native';
import {theme} from '../../../utils/design';
import AppText from '../../../components/AppText';
import AppRadioButton from '../../../components/AppRadioButton';
import AppDropDownController from '../../../components/controlled/AppDropDownController';

//
const AssignPropertiesForm = ({
  control,
  errors,
  t,
  allProperties,
  setAllProperties,
  unitQuery,
  buildingQuery,
  communityQuery,
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
          {t('CreateProfessional.AssignProperties.title')}
        </AppText>
        <View style={{height: 10}} />
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('CreateProfessional.AssignProperties.subtitle')}
        </AppText>
      </View>
      <View style={{height: 15}} />
      {/*  */}
      <View style={{marginHorizontal: 20, flexDirection: 'row'}}>
        <AppRadioButton
          state={allProperties}
          setState={setAllProperties}
          text={t('CreateProfessional.AssignProperties.allProperties')}
          value={true}
        />
        <View style={{width: 18}} />

        <AppRadioButton
          state={allProperties}
          setState={setAllProperties}
          text={t('CreateProfessional.AssignProperties.custom')}
          value={false}
        />
      </View>
      <View style={{height: 15}} />
      {!allProperties && (
        <View>
          <AppDropDownController
            placeholder={t('properties.community')}
            data={communityQuery}
            control={control}
            name="community"
            error={errors?.community}
            withHeader={false}
          />
          <View style={{height: 15}} />
          <AppDropDownController
            placeholder={t('properties.building')}
            data={buildingQuery}
            control={control}
            name="building"
            error={errors?.building}
            withHeader={false}
          />
          <View style={{height: 15}} />
          <AppDropDownController
            placeholder={t('properties.unit')}
            data={unitQuery}
            control={control}
            name="unit"
            error={errors?.unit}
            withHeader={false}
          />
        </View>
      )}
    </>
  );
};

export default AssignPropertiesForm;

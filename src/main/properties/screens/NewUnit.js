import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AppText from '../../../components/AppText';
import Header from '../../../components/Header';
import WhiteSpace from '../../../components/WhiteSpace';
import {theme, HP, WP} from '../../../utils/design';

const NewUnit = ({navigation, route}) => {
  const {t} = useTranslation();
  const UnitButton = ({title, onPress}) => {
    return (
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          height: HP(6),
          width: WP(90),
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#BFEBDB',
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <View style={{flex: 0.89, justifyContent: 'center'}}>
          <AppText Tcolor={theme.blackColor} textAlign={'left'}>
            {title}
          </AppText>
        </View>
        <View
          style={{flex: 0.11, justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesome
            name={'chevron-right'}
            color={theme.blackColor}
            size={theme.iconSize - 2}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.whiteColor}}>
      <Header name={t('properties.add_unit.title')} navigation={navigation} />
      <WhiteSpace variant={1.5} />
      <AppText Tcolor={theme.greyColor} textAlign={'left'}>
        {t('properties.add_unit.selectUnitType')}
      </AppText>
      <WhiteSpace variant={1.5} />
      <UnitButton
        title={t('properties.add_unit.commercial')}
        onPress={() => {
          navigation.navigate('NewUnitForm', {type: 2, propertyType: 1, fromParent: route?.params?.fromParent, parent: route?.params?.parent});
        }}
      />
      <WhiteSpace variant={1} />
      <UnitButton
        title={t('properties.add_unit.residential')}
        onPress={() => {
          navigation.navigate('NewUnitForm', {type: 1, propertyType: 1, fromParent: route?.params?.fromParent, parent: route?.params?.parent});
        }}
      />
    </View>
  );
};

export default NewUnit;

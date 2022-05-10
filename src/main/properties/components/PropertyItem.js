import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';
import config from 'react-native-ultimate-config';
import AppText from '../../../components/AppText';
import AppImage from '../../../components/AppImage';
import {PropertyType} from '../../../utils/constants/PropertyType';
import {HP, theme} from '../../../utils/design';
import CommunityPlaceholder from '../../../../assets/images/images/community_placeholder.png';
import BuildingsPlaceholder from '../../../../assets/images/images/buildings_placeholder.png';
import {CardWithShadow} from '../../../components/CardWithShadow';

const PropertyItem = ({variant, item, navigation, prev}) => {
  const {t} = useTranslation();
  const arabicCrazyNaming = (n, thing) => {
    if (n === 0) return `${t(`properties.${thing}_numbers.0`)}`;
    if (n === 1) return `${t(`properties.${thing}_numbers.1`)}`;
    if (n === 2) return `${t(`properties.${thing}_numbers.2`)}`;
    if (n >= 3 && n < 11) return `${t(`properties.${thing}_numbers.3`)}`;
    if (n >= 11) return `${t(`properties.${thing}_numbers.11`)}`;
  };

  const IconText = ({icon, text, iconSize}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 5,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesome
            name={icon}
            color={theme.primaryColor}
            size={iconSize || theme.iconSize}
          />
        </View>
        <View
          style={{
            flex: 4,
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={13}
            numberOfLines={1}
            textAlign={'left'}>
            {text}
          </AppText>
        </View>
      </View>
    );
  };
  return (
    <CardWithShadow>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.imageContainer}>
          {!!item?.images?.length ? (
            <AppImage
              resizeMode={'cover'}
              style={{width: 120, height: 165}}
              uri={item?.images[item?.images?.length - 1]?.url}
            />
          ) : (
            <Image
              resizeMode={'contain'}
              source={
                config.X_TENANT === 'tanmya'
                  ? require('../../../../assets/images/tanmya/building.png')
                  : config.X_TENANT === 'alrajhi'
                  ? require('../../../../assets/images/alrajhi/buildings_placeholder.png')
                  : variant
                  ? BuildingsPlaceholder
                  : CommunityPlaceholder
              }
              style={{width: 120, height: 200}}
            />
          )}
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.headerContaier}>
            <View style={{flex: 1}}>
              <AppText
                Tcolor={theme.blackColor}
                fontSize={theme.h6.size}
                fontWeight={theme.c2.fontWeight}
                numberOfLines={1}
                textAlign={'left'}>
                {item?.name ?? ''}
              </AppText>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditForm', {
                  id: item.id,
                  variant: PropertyType[variant],
                  prev: prev,
                });
              }}>
              <AppText
                fontWeight={'500'}
                Tcolor={theme.primaryColor}
                fontSize={12}>
                {t('common.edit')}
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <IconText
              icon={'map-marker-alt'}
              iconSize={15}
              text={`${item.district?.name}, ${item.city?.name}`}
            />
            {!variant && (
              <IconText
                icon={'city'}
                iconSize={13}
                text={`${item.buildings_count} ${arabicCrazyNaming(
                  item.buildings_count,
                  'buildings',
                )}`}
              />
            )}
            <IconText
              icon={'building'}
              iconSize={15}
              text={`${item.units_count} ${arabicCrazyNaming(
                item.units_count,
                'units',
              )}`}
            />
            {!!item?.community?.name && (
              <IconText
                icon={'city'}
                iconSize={15}
                text={item?.community?.name ?? ''}
              />
            )}
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(
                  variant == 0 ? 'BuildingsUnitsList' : 'UnitsList',
                  {
                    item: item,
                  },
                );
              }}
              style={{
                backgroundColor: theme.whiteColor,
                borderRadius: 8,
                marginTop: 20,
                marginHorizontal: 20,
                height: 30,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 8,
                borderColor: theme.primaryColor,
              }}>
              <AppText
                Tcolor={theme.primaryColor}
                fontSize={theme.c1.size}
                fontWeight={theme.s1.fontWeight}
                textAlign={'center'}>
                {variant == 0
                  ? `${t('properties.view')} ${t('properties.buildings')}`
                  : `${t('properties.view')} ${t('properties.units')}`}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CardWithShadow>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    // position: 'absolute',
    bottom: 0,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginVertical: 10,
    // alignContent: "",
    justifyContent: 'flex-start',
  },
  headerContaier: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    // height: 20,
    // backgroundColor: 'pink',
    marginBottom: 15,
    marginHorizontal: 10,
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'column',
    marginHorizontal: 10,
    // height: 130,
    // justifyContent: 'flex-end',
    // alignContent: 'center',
    // alignItems: 'center',
  },
});

export default PropertyItem;

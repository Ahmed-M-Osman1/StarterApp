import React from 'react';
import {Pressable, View, StyleSheet, Image, TextInput} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';
import AppText from '../../../components/AppText';
import {theme, WP} from '../../../utils/design';
import Card from '../../../components/Card';
import AppImage from '../../../components/AppImage';
import config from 'react-native-ultimate-config';
import {TouchableOpacity} from 'react-native-gesture-handler';

const UnitItem = ({item, fromParent = false, navigation}) => {
  const {t} = useTranslation();
  const IconText = ({icon, text}) => {
    return (
      <View style={{flexDirection: 'row', marginVertical: 5}}>
        <View
          style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesome
            name={icon}
            color={theme.primaryColor}
            size={theme.iconSize - 5}
          />
        </View>
        <View style={{flex: 0.85}}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={13}
            textAlign={'left'}>
            {text}
          </AppText>
        </View>
      </View>
    );
  };

  const residential = {
    1: 'Apartment',
    2: 'Villa',
    3: 'Land',
  };

  const commercial = {
    1: 'Office',
    2: 'Retail',
    3: 'Land',
    4: 'Workshop',
    5: 'Warehouse',
  };

  return (
    <Card variant={2.2}>
      <Pressable
        style={styles.pressableContainer}
        onPress={() => {
          navigation?.navigate('EditForm', {
            id: item?.id,
            variant: 'Unit',
            fromParent: fromParent
          });
        }}>
        <View style={styles.itemsContainer}>
          <View style={styles.imageContainer}>
            {!!item?.images?.length ? (
              <AppImage
                resizeMode={'cover'}
                style={{width: 110, height: 110}}
                uri={item?.images[item?.images?.length - 1]?.url}
              />
            ) : (
              <Image
                resizeMode={'contain'}
                defaultSource={require('../../../../assets/images/atarcloud/building.png')}
                source={
                  item?.unit_type === 1
                    ? item?.unit_sub_type === 1
                      ? require('../../../../assets/images/images/residential_apartment.png')
                      : item?.unit_sub_type === 2
                      ? require('../../../../assets/images/images/residential_villa.png')
                      : require('../../../../assets/images/images/residential_land.png')
                    : item?.unit_sub_type === 1
                    ? require('../../../../assets/images/images/unit_office_placeholder.png')
                    : item?.unit_sub_type === 2
                    ? require('../../../../assets/images/images/commercial_retail.png')
                    : item?.unit_sub_type === 3
                    ? require('../../../../assets/images/images/residential_land.png')
                    : item?.unit_sub_type === 4
                    ? require('../../../../assets/images/images/commercial_workshop.png')
                    : require('../../../../assets/images/images/commercial_workshop.png')
                }
                style={{width: 120, height: 200}}
              />
            )}
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.headerContaier}>
              <AppText
                Tcolor={theme.blackColor}
                fontSize={theme.h6.size}
                fontWeight={theme.c2.fontWeight}
                numberOfLines={1}
                style={{flex: 1}}
                textAlign={'left'}>
                {item?.name ?? ''}
              </AppText>
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor:
                      item?.status?.description === 'Occupied'
                        ? 'rgba(34, 170, 111, 0.1)'
                        : 'rgba(255, 164, 18, 0.1)',
                  },
                ]}>
                <AppText
                  fontSize={10}
                  Tcolor={
                    item?.status?.description === 'Occupied'
                      ? theme.primaryColor
                      : '#FFA412'
                  }>
                  {`${t(`requests.${item?.status?.description}`, {
                    defaultValue: item?.status?.description ?? '',
                  })}`}
                </AppText>
              </View>
            </View>
            <View style={styles.infoContainer}>
              {/* <IconText
                icon={'map-marker-alt'}
                text={`${item?.district?.name}, ${item?.city?.name}`}
              /> */}

              {!!item?.unit_sub_type && (
                <IconText
                  icon={'home'}
                  text={`${
                    item?.unit_type === 1
                      ? `${t('properties.add_unit.residential')} - ${
                          residential[item?.unit_sub_type]
                        }`
                      : `${t('properties.add_unit.commercial')} - ${
                          commercial[item?.unit_sub_type]
                        }`
                  }`}
                />
              )}
              {!!item?.building?.name && (
                <IconText icon={'building'} text={item?.building?.name ?? ''} />
              )}
              {!!item?.community?.name && (
                <IconText icon={'city'} text={item?.community?.name ?? ''} />
              )}
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  // onPress={() => {
                  //   navigation.navigate(
                  //     variant == 0 ? 'BuildingsUnitsList' : 'UnitsList',
                  //     {
                  //       item: item,
                  //     },
                  //   );
                  // }}
                  style={{
                    backgroundColor: theme.whiteColor,
                    borderRadius: 8,
                    marginTop: 20,
                    height: 30,
                    width: '100%',
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
                    {`${t('properties.view')} ${t('properties.details')}`}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
};
const styles = StyleSheet.create({
  pressableContainer: {
    width: '100%',
    backgroundColor: theme.whiteColor,
    // height: 200,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#dddddd50',
    borderWidth: 1,
    shadowColor: '#dddddd90',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  itemsContainer: {
    flexDirection: 'row',
    // marginVertical: 13,
    marginHorizontal: 5,
  },
  imageContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 0.6,
    // marginVertical: HP(3.3),
    // alignContent: "",
    justifyContent: 'flex-start',
  },
  btnContainer: {
    width: 'auto',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  statusContainer: {
    borderRadius: 5,
    height: 15,
  },
  headerContaier: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 13,
    marginHorizontal: 10,
  },
  infoContainer: {
    flexDirection: 'column',
    marginHorizontal: 10,
    height: 130,
  },
});

export default UnitItem;

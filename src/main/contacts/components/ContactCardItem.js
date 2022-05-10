import React from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import AppText from '../../../components/AppText';
import Card from '../../../components/Card';
import {HP, theme, WP} from '../../../utils/design';
import {Tenant, Owner} from '../../../utils/constants/Role';
import {CardWithShadow} from '../../../components/CardWithShadow';
import Avatar from '../../../components/Avatar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

const ContactCardItem = ({
  item,
  onPress,
  style,
  type,
  showSelector,
  inviteList,
  setInvite,
  updateInviteList,
}) => {
  const {i18n} = useTranslation();
  return (
    <CardWithShadow>
      <TouchableOpacity
        onPress={!showSelector ? onPress : () => updateInviteList(item.id)}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {showSelector && (
          <View style={{width: 30}}>
            <MaterialIcons
              name={
                inviteList.includes(item.id)
                  ? 'check-box'
                  : 'check-box-outline-blank'
              }
              color={theme.greyColor}
              size={theme.h5.size}
            />
          </View>
        )}
        <Avatar text={item?.name} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.s1.size}
            fontWeight={theme.s1.fontWeight}
            textAlign={'left'}>
            {item?.name ?? ''}
          </AppText>
          <View style={{height: 5}} />
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            textTransform={item?.role === Tenant ? 'none' : 'capitalize'}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {item?.role === Tenant
              ? `${i18n.t('contacts.unitNo')}: ${item?.rented_units[0]?.name ??  'NA'}`
              : i18n.t(`contacts.roles.${item?.role.toUpperCase()}`) ?? ''}
          </AppText>

          <View style={{height: 10}} />
          {item?.role === Tenant ? (
            <AppText
              Tcolor={theme.greyColor}
              regular={true}
              textTransform={'none'}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {item?.email}
            </AppText>
           ) : ( 
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                width: 70,
                backgroundColor: `${theme.primaryColor}20`,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppText
                Tcolor={theme.blackColor}
                regular={true}
                fontSize={10}
                fontWeight={theme.c1.fontWeight}
                textAlign={'center'}>
                {i18n.t('common.offline')}
              </AppText>
            </View>
          )}
        </View>
        <View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${item.phone_number}`)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: theme.primaryColor,
              borderRadius: 6,
            }}>
            <AppText
              Tcolor={theme.whiteColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {i18n.t('common.call')}
            </AppText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </CardWithShadow>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.whiteColor,
    shadowColor: 'rgba(65, 201, 142, 0.15)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  unitContainer: {
    flexDirection: 'row',
    paddingHorizontal: WP('3'),
    alignItems: 'center',
  },
  headerContaier: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: HP(1),
  },
  detailsContainer: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
});

export default ContactCardItem;

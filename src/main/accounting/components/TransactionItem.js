import React from 'react';
import {TouchableOpacity, View, StyleSheet, I18nManager} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {HP, theme, WP} from '../../../utils/design';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import _ from 'lodash';
import formatNumbers from '../../../utils/formatNumbers';

export default function TransactionItem({item}) {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('TransactionOverview', {transactionId: item?.id})
      }>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            flex: 0.5,
          }}>
          <AppText
            Tcolor={theme.blackColor}
            fontSize={theme.titleFontSize}
            textAlign={'left'}
            style={{marginHorizontal: WP(1)}}>
            {item?.assignee}
          </AppText>
          <AppText
            fontSize={theme.subTitleFontSize}
            Tcolor={theme.greyColor}
            textAlign={'left'}
            style={{marginHorizontal: WP(1)}}>
            {item?.category?.name}
          </AppText>
          <WhiteSpace variant={1} />
          <AppText
            fontSize={theme.titleFontSize}
            Tcolor={theme.blackColor}
            textAlign="left"
            style={{marginHorizontal: WP(1)}}>
            {I18nManager.isRTL
              ? `${item?.amount_fmt} ${t('dashboard.sar')}`
              : `${t('dashboard.sar')} ${
                  item?.amount < 0
                    ? '(' +
                      Math.abs(item.amount)
                        .toFixed('2')
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                      ')'
                    : item.amount_fmt
                }`}
          </AppText>
        </View>
        <View style={{flex: 0.5, alignItems: 'flex-end'}}>
          <View
            style={{
              backgroundColor:
                item?.type == 'overdue'
                  ? theme.red
                  : item?.type == 'outstanding'
                  ? theme.orange
                  : theme.primaryColor,
              padding: HP(0.6),
              borderRadius: 3,
              width: WP(32),
            }}>
            <AppText
              fontSize={theme.label.size}
              fontWeight={theme.label.fontWeight}
              Tcolor={theme.whiteColor}
              textAlign={'center'}
              regular
              style={{marginHorizontal: 0}}>
              {t(`accounting.${item?.type}`)}
            </AppText>
          </View>
          <WhiteSpace variant={1.5} />
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.blackColor}
            textAlign={'right'}
            style={{marginHorizontal: WP(1), width: WP(35)}}>
            {`${
              item?.type === 'paid'
                ? t('myUnits.paid_on')
                : t('myUnits.due_date')
            }: ${item?.due_on}`}
          </AppText>
        </View>
      </View>
      <WhiteSpace variant={0.5} />
      {item?.type !== 'paid' && (
        <View
          style={{
            backgroundColor: '#fef1f0',
            width: '100%',
            height: 35,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
          }}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.blackColor}
            textAlign={'left'}
            style={{
              width: '90%',
            }}>
            {`${t('myUnits.remainingAmount')}: ${t(
              'dashboard.sar',
            )} ${formatNumbers(item?.left)}`}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'space-between',

    marginTop: 20,
    backgroundColor: theme.whiteColor,
    marginHorizontal: 20,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 17,
    shadowColor: theme.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 3,
    justifyContent: 'space-between',
  },
  amountContainer: {
    justifyContent: 'center',
  },
});

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../../components/Card';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import NoData from '../../../components/NoData';
import {HP, theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import {setLoading} from '../../../redux/misc';
import {Tenant} from '../../../utils/constants/Role';
import Announcements from '../../announcements/screens/Announcements';
import formatNumbers from '../../../utils/formatNumbers';
import shadeColor from '../../../utils/shadeColors';

const RequiresAttention = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const role = useSelector(state => state.user.data.role);

  const ReqCard = ({item, value, card}) => {
    return (
      <Pressable onPress={card.onPress}>
        <Card
          variant={0.85}
          style={{
            backgroundColor: card?.backgroundColor ?? '#ccc',
            borderColor: card?.borderColor ?? '#eee',
            borderWidth: 0,
            shadowColor: Platform.OS === 'android' ? '#c4c4c4' : '#eeeeee',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: shadeColor(card?.backgroundColor ?? '#ccc', -3),
          }}>
          <View style={styles.cardContentContainer}>
            <View style={styles.leftContainer}>
              <AppText
                Tcolor={theme.blackColor}
                fontSize={theme.s1.size}
                fontWeight={theme.p1.fontWeight}
                regular={true}
                textAlign={'left'}>
                {t(`dashboard.requiresAttention.${item}`)}
              </AppText>
            </View>
            {value < 99 ? (
              <View
                style={[
                  styles.counter,
                  {
                    backgroundColor: card.iconBackgroundColor,
                  },
                ]}>
                <Text style={styles.counterText}>{value}</Text>
              </View>
            ) : (
              <View
                style={[
                  styles.counter,
                  {
                    backgroundColor: '#ffffff00',
                    width: null,
                  },
                ]}>
                <Text style={styles.normalText}>{value}</Text>
              </View>
            )}
          </View>
        </Card>
      </Pressable>
    );
  };

  const query = useQuery(`requiresAttention`, () =>
    mngmtHttp
      .get(`/dashboard/requires-attention`)
      .then(response => response.data.data),
  );

  const overdue = useQuery(`overdue`, () =>
    mngmtHttp
      .get(`/transactions/balances`)
      .then(response => response.data.data),
  );

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  const cards = {
    contracts_expire_within_one_month: {
      backgroundColor: '#f4fef6',
      borderColor: '#00658415',
      iconBackgroundColor: '#bae6c2',
    },
    requests_required_approval: {
      backgroundColor: '#fefdf3',
      borderColor: '#D0CA8F',
      iconBackgroundColor: '#f0e9b3',
      onPress: () => {
        navigation.navigate('requestsTab');
      },
    },
    complaints_count: {
      backgroundColor: '#fef7f7',
      borderColor: '#F0CDCD',
      iconBackgroundColor: '#f4bdbd',
      onPress: () => {
        navigation.navigate('Complaints');
      },
    },
    overdue_out: {
      backgroundColor: '#fff9f2',
      borderColor: '#E0E3E4',
      iconBackgroundColor: '#0C6683',
      onPress: () => {
        navigation.navigate(role == Tenant ? 'paymentsTab' : 'accountingTab');
      },
    },
    overdue_in: {
      backgroundColor: '#f7fdfe',
      borderColor: '#D1FFF2',
      iconBackgroundColor: '#0C6683',
      onPress: () => {
        navigation.navigate(role == Tenant ? 'paymentsTab' : 'accountingTab');
      },
    },
  };

  return (
    <View style={styles.container}>
      {/* <------- Annnouncement Headers -------> */}
      <View style={styles.headerContainer}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {t('dashboard.announcements.title')}
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate('AllAnnouncements')}>
          <AppText
            Tcolor={theme.primaryColor}
            regular={true}
            fontSize={theme.s1.size}
            fontWeight={theme.s1.fontWeight}
            textAlign={'left'}>
            {t('dashboard.announcements.viewAll')}
          </AppText>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{}}>
          <Announcements />
        </View>
        {query.data &&
          (Object.keys(query.data).filter(item => query.data[item] !== 0)
            .length ? (
            <>
              <View style={{height: 20}} />
              <AppText Tcolor={theme.primaryColor} fontSize={theme.h5.size}>
                {t('dashboard.requiresAttention.title')}
              </AppText>
              <View style={{height: 20}} />
              {Object.entries(query.data)
                .filter(([item, value], index) => value > 0)
                .map(([item, value], index) => (
                  <ReqCard
                    key={index}
                    item={item}
                    value={value}
                    card={cards[item]}
                  />
                ))
                .reverse()}
              {overdue.data && (
                <>
                  {overdue?.data.overdue_in > 0 && (
                    <ReqCard
                      item={'overdue_out'}
                      value={formatNumbers(overdue?.data.overdue_in)}
                      card={cards.overdue_out}
                    />
                  )}
                  {overdue?.data.overdue_out > 0 && (
                    <ReqCard
                      item={'overdue_in'}
                      value={formatNumbers(overdue?.data.overdue_out)}
                      card={cards.overdue_in}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <NoData />
          ))}
      </ScrollView>
      <View style={{height: 50}} />
    </View>
  );
};

export default RequiresAttention;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.whiteColor,
  },
  cardContentContainer: {
    flexDirection: 'row',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  leftContainer: {
    flex: 4,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  counter: {
    backgroundColor: '#D08F8F',
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    textAlign: 'center',
    color: theme.whiteColor,
  },
  normalTextContainer: {
    marginHorizontal: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalText: {
    color: '#0C6683',
  },
});

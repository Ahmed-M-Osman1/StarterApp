import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import AppButtonGroup from '../../../components/AppButtonGroup';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import WhiteSpace from '../../../components/WhiteSpace';
import CircularProgressPie from '../../../components/CircularProgressPie';
import TransactionsTable from '../components/TransactionsTable';
import {setLoading} from '../../../redux/misc';
import {mngmtHttp} from '../../../utils/http/Http';
import {theme} from '../../../utils/design';
import NoData from '../../../components/NoData';

const ServiceRequests = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(0);

  const query = useQuery([`Requests`, {filter}], () =>
    mngmtHttp
      .get(`/dashboard/requests`, {
        params: {
          period:
            filter == 0
              ? 'this_month'
              : filter == 1
              ? 'last_month'
              : 'last_3_months',
        },
      })
      .then(response => response.data.data),
  );

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  const pieColors = [
    '#21a96e',
    '#5BDEA5',
    '#22AA6F',
    '#14CD7C',
    '#22AEA5',
    '#3FBC6C',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.body1}>
        <WhiteSpace variant={1} />
        <AppText Tcolor={theme.primaryColor} fontSize={theme.h5.size}>
          {t('dashboard.serviceRequests')}
        </AppText>
        <WhiteSpace variant={1} />
        <AppButtonGroup
          state={[filter, setFilter]}
          buttons={[
            t('dashboard.thisMonth'),
            t('dashboard.lastMonth'),
            t('dashboard.last3Months'),
          ]}
        />
        <WhiteSpace variant={3} />
        {query.data?.items.length > 0 ? (
          <CircularProgressPie
            hideSAR={true}
            text={query?.data?.total}
            data={query.data?.items?.map((value, key) => ({
              percentage: +value.percentage,
              color: pieColors[key],
            }))}
          />
        ) : (
          <NoData />
        )}
      </View>
      <View style={styles.body2}>
        {query.data?.items.length > 0 ? (
          <TransactionsTable
            headers={[`${t('dashboard.item')}`, '#', '%']}
            fields={['type_name', 'count', 'percentage']}
            data={query.data?.items}
          />
        ) : (
          <></>
        )}
      </View>
      <View style={styles.body3}>
        <AppButton
          title={t('dashboard.newRequest')}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
          rounded={8}
          onPress={() => {
            navigation.navigate('NewRequest', {goTo: 'dashboard'});
          }}
        />
      </View>
    </View>
  );
};

export default ServiceRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  body1: {
    flex: 3,
    marginVertical: 20,
  },
  body2: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  body3: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  nodataContainer: {
    justifyContent: 'space-around',
  },
  nodataImage: {
    width: '100%',
    height: '70%',
    opacity: 0.4,
  },
});

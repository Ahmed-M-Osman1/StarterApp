import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import AppButtonGroup from '../../../components/AppButtonGroup';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import CircularProgressPie from '../../../components/CircularProgressPie';
import TransactionsTable from '../components/TransactionsTable';
import {Colors} from '../../../utils/constants/Colors';
import {mngmtHttp} from '../../../utils/http/Http';
import {theme} from '../../../utils/design';
import {setLoading} from '../../../redux/misc';
import {Tenant} from '../../../utils/constants/Role';
import NoData from '../../../components/NoData';

const ProfitLoss = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(0);

  const role = useSelector(state => state.user.data.role);

  const query = useQuery([`ProfitLoss`, {filter}], () =>
    mngmtHttp
      .get(`/dashboard/property-profit-loss`, {
        params: {
          type: 'in',
          period:
            filter == 0
              ? 'this_month'
              : filter == 1
              ? 'last_month'
              : 'last_3_months',
        },
      })
      .then(response => response.data),
  );

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  const pieColors = ['#21a96e', '#5BDEA5', '#22AA6F', '#14CD7C'];

  return (
    <View style={styles.container}>
      <View style={styles.body1}>
        <WhiteSpace variant={1} />
        <AppText
          Tcolor={theme.primaryColor}
          fontSize={theme.superTitleFontSize}>
          {t('dashboard.netCashFlow')}
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
        {query.data?.data_building?.items.length > 0 ? (
          <CircularProgressPie
            text={query.data?.data_building?.total_fmt}
            data={query.data?.data_building?.items?.map(value => ({
              percentage:
                (value.amount / query.data?.data_building?.total) * 100,
              color: value.amount > 0 ? Colors[4] : Colors[2],
            }))}
          />
        ) : (
          <NoData />
        )}
      </View>
      <View style={styles.body2}>
        {query.data?.data_building?.items.length > 0 ? (
          <TransactionsTable
            binary={true}
            headers={[
              `${t('properties.building')}`,
              '',
              `${t('dashboard.sar')}`,
            ]}
            // headers={['ITEM', '', 'SAR']}
            fields={['building', '', 'amount_fmt']}
            data={query.data?.data_building?.items}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default ProfitLoss;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  body1: {
    flex: 0.6,
    marginVertical: 20,
  },
  body2: {
    flex: 0.32,
    justifyContent: 'flex-start',
  },
  body3: {
    flex: 0.08,
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

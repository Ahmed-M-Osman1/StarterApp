import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import AppText from '../../../components/AppText';
import {mngmtHttp} from '../../../utils/http/Http';
import {theme} from '../../../utils/design';
import {setLoading} from '../../../redux/misc';
import WhiteSpace from '../../../components/WhiteSpace';
import CircularProgressPie from '../../../components/CircularProgressPie';
import TransactionsTable from '../components/TransactionsTable';
import NoData from '../../../components/NoData';

const Contracts = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const query = useQuery(`Contracts`, () =>
    mngmtHttp.get(`/dashboard/contracts`).then(response => response.data.data),
  );

  const data = query.data
    ? Object.entries(query.data.items).map(([item, value]) => ({
        title: item,
        value: value.total,
        percentage: value.percentage,
      }))
    : [];

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  const pieColors = ['#21a96e', '#5BDEA5', '#22AA6F', '#14CD7C'];
  let shouldIShowNoData = 0;
  if (query.data) {
    shouldIShowNoData = Object.values(query?.data?.items)
      .map(v => v['total'])
      .reduce((a, b) => b + a, 0);
  }
  return (
    <View style={styles.container}>
      <View style={styles.body1}>
        <WhiteSpace variant={1} />
        <View style={{flex: 0.2}}>
          <AppText
            Tcolor={theme.primaryColor}
            fontSize={theme.superTitleFontSize}>
            {t('dashboard.contracts.expiringContracts')}
          </AppText>
        </View>
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          {shouldIShowNoData > 0 ? (
            <CircularProgressPie
              hideSAR={true}
              text={`${query.data?.total} ${
                // '\n' + t('dashboard.lease')
                '\n' + t('dashboard.lease', {count: query.data?.total})
              }`}
              data={data.map((value, key) => ({
                percentage: +value.percentage,
                color: pieColors[key],
              }))}
            />
          ) : (
            <NoData />
          )}
        </View>
      </View>
      {shouldIShowNoData > 0 ? (
        <View style={styles.body2}>
          <TransactionsTable
            headers={[`${t('dashboard.item')}`, '#', '%']}
            fields={['title', 'value', 'percentage']}
            data={data}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default Contracts;

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
    flex: 3,
    justifyContent: 'flex-start',
  },
  body3: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});

import React, {useEffect} from 'react';
import {View, Linking, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import AppText from '../../../components/AppText';
import NoData from '../../../components/NoData';
import WhiteSpace from '../../../components/WhiteSpace';
import AppFlatList from '../../../components/AppFlatList';
import Card from '../../../components/Card';
import {PaymentCycle} from '../../../utils/constants/PaymentCycle';
import DualField from '../../../components/DualField';
import AppButton from '../../../components/AppButton';
import {mngmtHttp} from '../../../utils/http/Http';
import {theme, WP} from '../../../utils/design';
import {setLoading} from '../../../redux/misc';

const MyLeases = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const query = useQuery(`MyLeases`, () =>
    mngmtHttp.get(`/dashboard/my-leases`).then(response => response.data.data),
  );

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  const SixField = ({titles, values}) => {
    return (
      <DualField
        Child1={() => (
          <View style={{width: '100%'}}>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {titles[0]}
            </AppText>
            <WhiteSpace variant={-1} />
            <AppText
              Tcolor={theme.blackColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {values[0] ? values[0] : '-'}
            </AppText>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {titles[1]}
            </AppText>
            <WhiteSpace variant={-1} />
            <AppText
              Tcolor={theme.blackColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {values[1] ? values[1] : '-'}
            </AppText>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {titles[2]}
            </AppText>
            <WhiteSpace variant={-1} />
            <AppText
              Tcolor={theme.blackColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {values[2] ? values[2] : '-'}
            </AppText>
          </View>
        )}
        Child2={() => (
          <View style={{width: '100%'}}>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {titles[3]}
            </AppText>
            <WhiteSpace variant={-1} />
            <AppText
              Tcolor={theme.blackColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {values[3] ? values[3] : '-'}
            </AppText>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {titles[4]}
            </AppText>
            <WhiteSpace variant={-1} />
            <AppText
              Tcolor={theme.blackColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {values[4] ? values[4] : '-'}
            </AppText>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {titles[5]}
            </AppText>
            <WhiteSpace variant={-1} />
            <AppText
              Tcolor={theme.blackColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {values[5] ? values[5] : '-'}
            </AppText>
          </View>
        )}
      />
    );
  };
  const Item = ({item}) => {
    return (
      <Card variant={4}>
        <View style={{width: '100%'}}>
          <AppText
            Tcolor={theme.blackColor}
            textAlign={'left'}
            fontSize={theme.titleFontSize}>
            {`${t('properties.unit')}# ${item.id}`}
          </AppText>
        </View>
        <SixField
          titles={[
            '',
            t('lease.rent'),
            t('lease.startDate'),
            '',
            t('lease.endDate'),
            t('lease.cycle'),
          ]}
          values={[
            item.name,
            item.lease?.annual_rent,
            item.lease?.start_date,
            `${item.district.name}, ${item.city.name}`,
            item.lease?.end_date,
            PaymentCycle.find(({id}) => item.lease?.billing_cycle == id).name,
          ]}
        />

        <AppButton
          customWidth={WP(80)}
          title={
            item.lease?.contract.length > 0
              ? t('dashboard.myLeases.downloadContract')
              : t('dashboard.myLeases.noContract')
          }
          Bcolor={theme.tertiaryColor}
          Tcolor={theme.whiteColor}
          onPress={() => {
            item.lease?.contract.length > 0 &&
              Linking.openURL(item.lease.contract[0].url);
          }}
        />
      </Card>
    );
  };
  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  return (
    <View style={styles.container}>
      <AppText Tcolor={theme.blackColor} fontSize={theme.superTitleFontSize}>
        {t('dashboard.myLeases.title')}
      </AppText>
      <WhiteSpace variant={1.5} />
      {query.data?.length > 0 ? (
        <AppFlatList data={query.data} renderItem={Item} />
      ) : (
        <NoData />
      )}
    </View>
  );
};

export default MyLeases;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  body1: {
    flex: 0.45,
  },
  body2: {
    flex: 0.35,
    justifyContent: 'flex-start',
  },
  body3: {
    flex: 0.2,
    justifyContent: 'flex-start',
  },
});

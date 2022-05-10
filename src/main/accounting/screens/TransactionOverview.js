import React, {useEffect} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import AppText from '../../../components/AppText';
import Card from '../../../components/Card';
import Header from '../../../components/Header';
import WhiteSpace from '../../../components/WhiteSpace';
import AppButton from '../../../components/AppButton';
import {HP, theme, WP} from '../../../utils/design';
import {TRANSACTIONS} from '../../../utils/constants/QueryKey';
import {mngmtHttp} from '../../../utils/http/Http';
import {Can} from '../../../utils/Can';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {setLoading} from '../../../redux/misc';
import formatNumbers from '../../../utils/formatNumbers';

const TransactionOverview = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {transactionId} = route.params;

  const transaction = useQuery([TRANSACTIONS, {id: transactionId}], () =>
    mngmtHttp
      .get(`/transactions/${transactionId}`)
      .then(response => response.data.data),
  );

  useEffect(() => {
    dispatch(setLoading(transaction.isLoading));
  }, [transaction.isLoading]);

  const Info = ({titles, keys}) => {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 0.5, alignItems: 'flex-start'}}>
          {titles.map((item, index) => {
            return (
              <View style={{marginVertical: HP(0.3)}} key={index}>
                <AppText
                  textAlign={'left'}
                  fontSize={theme.subTitleFontSize}
                  Tcolor={theme.greyColor}>
                  {item}
                </AppText>
              </View>
            );
          })}
        </View>

        <View style={{flex: 0.5, alignItems: 'flex-end'}}>
          {keys.map((item, index) => {
            return (
              <View style={{marginVertical: HP(0.3)}} key={index}>
                <AppText
                  Tcolor={theme.blackColor}
                  textAlign={'left'}
                  fontSize={theme.subTitleFontSize}>
                  {transaction.data
                    ? item == 'property'
                      ? transaction?.data[item]?.name
                      : typeof transaction?.data[item] === 'number'
                      ? formatNumbers(transaction?.data[item])
                      : transaction?.data[item]
                    : 0}
                </AppText>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const downloadInvoice = async () => {
    let link = '';

    await mngmtHttp
      .get(`/invoice-download/${transaction?.data?.invoice?.id}`)
      .then(resp => (link = resp.data.data.url))
      .catch(e => console.log(e));

    if (link) {
      Linking.openURL(link);
    }
  };

  return (
    <View style={styles.container}>
      <Header name={t('transactionOverview.title')} navigation={navigation} />
      <WhiteSpace variant={1.5} />
      <View style={{flex: 0.7}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Card
            variant={1.4}
            style={{
              flex: 0.5,
              shadowColor: theme.blackColor,
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}>
            <AppText
              Tcolor={theme.blackColor}
              fontSize={theme.subTitleFontSize}>
              {t('transactionOverview.paid')}
            </AppText>
            <AppText
              Tcolor={theme.blackColor}
              fontSize={theme.titleFontSize}
              style={{marginTop: HP(1)}}>
              {t('dashboard.sar')} {formatNumbers(transaction?.data?.paid ?? 0)}
            </AppText>
          </Card>
          <Card
            variant={1.4}
            style={{
              flex: 0.5,
              shadowColor: theme.blackColor,
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}>
            <AppText
              Tcolor={theme.blackColor}
              fontSize={theme.subTitleFontSize}>
              {t('transactionOverview.remaining')}
            </AppText>
            <AppText
              Tcolor={theme.blackColor}
              fontSize={theme.titleFontSize}
              style={{marginTop: HP(1)}}>
              {t('dashboard.sar')}{' '}
              {transaction?.data?.amount - transaction?.data?.paid < 0
                ? '(' +
                  formatNumbers(
                    transaction?.data?.amount - transaction?.data?.paid,
                  ) +
                  ')'
                : formatNumbers(
                    transaction?.data?.amount - transaction?.data?.paid,
                  )}
            </AppText>
          </Card>
        </View>
        <WhiteSpace variant={1} />
        <View style={{marginHorizontal: 10}}>
          <AppText
            textAlign={'left'}
            fontSize={theme.titleFontSize}
            Tcolor={theme.primaryColor}>
            {t('transactionOverview.summary')}
          </AppText>
        </View>
        <WhiteSpace variant={0.8} />
        <Card
          variant={2.7}
          style={{
            shadowColor: theme.blackColor,
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 2,
          }}>
          <View style={{flex: 1, width: '100%'}}>
            <WhiteSpace variant={1} />
            <AppText
              Tcolor={theme.blackColor}
              fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {transaction?.data?.category?.name ?? ''}
            </AppText>
            <WhiteSpace variant={0.3} />
            <AppText
              Tcolor={theme.blackColor}
              fontSize={theme.subTitleFontSize}
              textAlign={'left'}>
              {transaction?.data?.subcategory?.name ?? ''}
            </AppText>
            <WhiteSpace variant={1} />
            <Info
              titles={['Unit', 'Transaction ID', 'Amount', 'Due on', 'Payee']}
              keys={['property', 'id', 'amount', 'due_on', 'assignee']}
            />
            <View style={{justifyContent:"center", alignItems: "center"}}>
              <AppButton
                title={'View Invoice'}
                onPress={() => downloadInvoice()}
                rounded={8}
                Bcolor={theme.whiteColor}
                Tcolor={theme.primaryColor}
                style={{
                  borderWidth: 1, 
                  borderColor: theme.primaryColor,  
                  width: '95%', 
                  marginHorizontal: 0,
                  marginVertical: 10,  
                  height: 40
                }}
              />
            </View>
          </View>
        </Card>
      </View>
      <View style={styles.btnContainer}>
        <Can I={CREATE} a={TRANSACTIONS}>
          <View>
            {transaction?.data?.left != 0 ? (
              <AppButton
                title={t('accounting.recordPayment')}
                onPress={() =>
                  navigation.navigate('PaymentCU', {
                    transaction: transaction.data,
                  })
                }
                rounded={8}
                Bcolor={theme.primaryColor}
                Tcolor={theme.whiteColor}
              />
            ) : null}
          </View>
        </Can>
        <AppButton
          title={'See Transaction History'}
          onPress={() => {
            navigation.navigate('TransactionHistory', {
              contact: transaction.data?.assignee_id,
            });
          }}
          rounded={8}
          Bcolor={theme.whiteColor}
          Tcolor={theme.primaryColor}
          style={{borderWidth: 1, borderColor: theme.primaryColor}}
        />
      </View>
    </View>
  );
};

export default TransactionOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  barContainer: {
    marginTop: 20,
    marginHorizontal: WP(6),
    marginBottom: HP(1.5),
  },
  bar: {
    width: '100%',
    height: HP(1.5),
    backgroundColor: '#ccc',
    borderRadius: 1000,
    position: 'relative',
    overflow: 'hidden',
  },
  barProgress: {
    position: 'absolute',
    backgroundColor: theme.primaryColor,
    height: '100%',
  },
  paidLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paidLeftTitle: {
    color: theme.greyColor,
    marginTop: HP(1),
    marginBottom: HP(0.25),
  },
  paidLeftAmount: {color: '#333'},
  divider: {
    marginVertical: HP(2),
  },
  btnContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
  },
});

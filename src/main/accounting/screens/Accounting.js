import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import crashlytics from '@react-native-firebase/crashlytics';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import AppButtonGroup from '../../../components/AppButtonGroup';
import Transactions from '../components/Transactions';
import {TRANSACTIONS} from '../../../utils/constants/PermissionSubject';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {Admin, Tenant} from '../../../utils/constants/Role';
import {Can} from '../../../utils/Can';
import {WP, theme, HP} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import {setLoading} from '../../../redux/misc';
import AllTransactionsGraph from '../components/AllTransactionsGraph';
import {useForm} from 'react-hook-form';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {Periods} from '../../../utils/constants/Periods';
import MoneyTransactionsGraph from '../components/MoneyTransactionsGraph';
import Plus from '../../../components/Plus';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native-gesture-handler';

const moment = require('moment');

const summaryItemColor = {
  paid: '#5FCA83',
  outstanding: '#F2A83F',
  overdue: '#EA3325',
};

const GraphCard = ({t, control, filter, period, data = []}) => {
  const [selectedBar, setSelectedBar] = useState(null);
  return (
    <View style={styles.pieContainer}>
      <View style={styles.summaryOuterContainer}>
        <View style={styles.summaryContainer}>
          <View style={styles.summrySec}>
            <AppText
              regular
              fontSize={theme.s1.size}
              fontWeight={theme.s1.fontWeight}
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {t('accounting.allTransactions')}
            </AppText>
            <View style={{marginVertical: 10}}>
              <AppDropDownController
                half={true}
                height={30}
                width={'100%'}
                // disabled={lease}
                name="period"
                placeholder={t('lease.duration')}
                data={{data: Periods}}
                control={control}
                withHeader={false}
                noMargin
                // error={errors.duration?.id}
              />
            </View>
            <AppText
              regular
              fontSize={theme.p1.size}
              fontWeight={theme.p1.fontWeight}
              Tcolor={theme.greyColor}
              textAlign={'left'}>
              {`${
                selectedBar?.xName ||
                selectedBar?.month ||
                selectedBar?.month_name ||
                selectedBar?.quarter ||
                selectedBar?.year ||
                ''
              }`}
            </AppText>
            {filter === 0 ? (
              <>
                <AppText
                  regular
                  fontSize={theme.s1.size}
                  fontWeight={theme.s1.fontWeight}
                  Tcolor={theme.blackColor}
                  textAlign={'left'}>
                  {`${t('dashboard.sar')} ${
                    selectedBar?.amount
                      .toFixed('0')
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0
                  } `}
                </AppText>
              </>
            ) : (
              <>
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 20,
                      marginBottom: 5,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: theme.primaryColor,
                        borderRadius: 99,
                        height: 10,
                        width: 10,
                        marginHorizontal: 10,
                      }}
                    />
                    <AppText
                      regular
                      fontSize={theme.s1.size}
                      fontWeight={theme.s1.fontWeight}
                      Tcolor={theme.blackColor}
                      textAlign={'left'}>
                      {`${t('dashboard.sar')} ${
                        selectedBar?.paid
                          .toFixed('0')
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0
                      } `}
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 20,
                      marginBottom: 5,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: theme.orange,
                        borderRadius: 99,
                        height: 10,
                        width: 10,
                        marginHorizontal: 10,
                      }}
                    />
                    <AppText
                      regular
                      fontSize={theme.s1.size}
                      fontWeight={theme.s1.fontWeight}
                      Tcolor={theme.blackColor}
                      textAlign={'left'}>
                      {`${t('dashboard.sar')} ${
                        selectedBar?.outstanding
                          .toFixed('0')
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0
                      } `}
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 20,
                      marginBottom: 5,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: theme.red,
                        borderRadius: 99,
                        height: 10,
                        width: 10,
                        marginHorizontal: 10,
                      }}
                    />
                    <AppText
                      regular
                      fontSize={theme.s1.size}
                      fontWeight={theme.s1.fontWeight}
                      Tcolor={theme.blackColor}
                      textAlign={'left'}>
                      {`${t('dashboard.sar')} ${
                        selectedBar?.overdue
                          .toFixed('0')
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0
                      } `}
                    </AppText>
                  </View>
                </View>
              </>
            )}
          </View>
          <View style={styles.graphBars}>
            {filter === 0 ? (
              <AllTransactionsGraph
                data={data}
                height={150}
                width={150}
                onPress={setSelectedBar}
                filter={filter}
                period={period}
              />
            ) : (
              <MoneyTransactionsGraph
                data={data}
                height={150}
                width={150}
                onPress={setSelectedBar}
                filter={filter}
                period={period}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const SearchBox = ({t, search, setSearchText, updateSearchText}) => {
  return (
    <View style={styles.searchContainer}>
      <AppTextInput
        placeholder={t('contacts.searchPlaceholder')}
        placeholderTextColor={theme.greyColor}
        backgroundColor={'#F5F5F5'}
        keyboardType={'default'}
        style={{
          height: 45,
          borderColor: '#eeeeee',
          borderRadius: 150,
        }}
        leftIcon={'search'}
        value={search}
        leftIconColor={theme.blackColor}
        disabledTitle
        onChangeText={text => {
          !text && setSearchText(null);
        }}
        onSubmitEditing={updateSearchText}
      />
    </View>
  );
};

function SummaryItem({amount, label, color}) {
  return (
    <View style={styles.summaryItemContainer}>
      <View style={styles.summaryItem}>
        <View style={styles.summaryItemColorContainer}>
          <View
            style={{
              borderRadius: 9999,
              width: 15,
              height: 15,
              backgroundColor: color,
            }}></View>
        </View>
        <View>
          <AppText
            textAlign="left"
            style={{marginTop: 0, marginHorizontal: 0}}
            fontSize={theme.titleFontSize}
            Tcolor={'#4D6C79'}>
            SAR {amount}
          </AppText>
          <AppText
            textAlign="left"
            style={{marginTop: HP(0.3), marginHorizontal: 0}}
            fontSize={theme.subTitleFontSize}
            Tcolor={'#7C7C7C'}>
            {label}
          </AppText>
        </View>
      </View>
    </View>
  );
}
const Accounting = ({navigation, route}) => {
  const {t} = useTranslation();
  const [searchText, setSearchText] = useState(null);
  const [filter, setFilter] = useState(0);
  const filters = ['all', 'money_in', 'money_out'];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [graphDate, setGraphDate] = useState({
    start_date: moment().subtract(6, 'months').format('YYYY-MM-DD'),
    end_date: moment(moment()).format('YYYY-MM-DD'),
  });
  const dispatch = useDispatch();

  useEffect(() => {
    crashlytics().log(`Accounting`);
  }, []);

  const queryBalances = useQuery(`BALANCES`, () =>
    mngmtHttp
      .get(`/transactions/balances`)
      .then(response => response.data.data),
  );

  const queryAllTransactions = useQuery(`AllTransactions`, () =>
    mngmtHttp
      .get(
        `/transactions-graph/all-transactions?from=${graphDate.start_date}&to=${
          graphDate.end_date
        }&period=${watch('period')}`,
      )
      .then(response => {
        return response.data.data;
      }),
  );
  const queryMoneyInTransactions = useQuery(`MoneyInTransactions`, () =>
    mngmtHttp
      .get(
        `/transactions-graph/money-in-transactions?from=${
          graphDate.start_date
        }&to=${graphDate.end_date}&period=${watch('period')}`,
      )
      .then(response => response.data),
  );
  const queryMoneyOutTransactions = useQuery(`MoneyOutTransactions`, () =>
    mngmtHttp
      .get(
        `/transactions-graph/money-out-transactions?from=${
          graphDate.start_date
        }&to=${graphDate.end_date}&period=${watch('period')}`,
      )
      .then(response => response.data),
  );

  const queryTransactions = useQuery(`TRANSACTIONS_${searchText}`, () =>
    mngmtHttp
      .get(`/transactions`, {
        params: {
          page: searchText ? 1 : currentPage,
          filter_type: filters[filter],
          search: searchText,
        },
      })
      .then(response => {
        setPages(response.data.meta.last_page);
        return response.data.data;
      })
      .catch(e => console.log(e.response, '----')),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      // dispatch(setLoading(true));
      queryTransactions.refetch();
      queryMoneyOutTransactions.refetch();
      queryMoneyInTransactions.refetch();
      queryAllTransactions.refetch();
    });
  }, []);

  useEffect(() => {
    if (queryTransactions.data) {
      currentPage > 1
        ? setData([...data, ...queryTransactions.data])
        : setData(queryTransactions.data);
    } else {
      setData(queryTransactions.data);
      // setData([]);
    }
  }, [queryTransactions?.data]);

  useEffect(() => {
    dispatch(setLoading(queryTransactions.isLoading));
  }, [queryTransactions.isLoading]);

  useEffect(() => {
    queryTransactions.refetch();
  }, [currentPage]);

  const updateSearchText = event => {
    setSearchText(event.nativeEvent.text);
  };
  useEffect(() => {
    setCurrentPage(1);
    queryTransactions.refetch();
  }, [searchText]);

  useEffect(() => {
    dispatch(setLoading(true));
    queryTransactions.refetch().then(() => {
      dispatch(setLoading(false));
    });
  }, [filter]);

  const role = useSelector(state => state.user.data.role);

  const totlaBalances =
    queryBalances.data?.paid +
    queryBalances.data?.outstanding +
    queryBalances.data?.overdue_in;

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const {
    control,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      start_date: '',
      end_date: '',
      period: 'MONTH',
    },
  });
  useEffect(() => {
    queryAllTransactions.refetch();
    queryMoneyInTransactions.refetch();
    queryMoneyOutTransactions.refetch();
  }, [watch('period')]);

  //
  return (
    <View style={styles.container} key={`${searchText}`}>
      <Header
        name={t(role == Tenant ? 'paymentsTab' : 'accountingTab')}
        navigation={navigation}
        tabs={true}
      />
      <AppButtonGroup
        state={[filter, setFilter]}
        buttons={[
          t('accounting.all'),
          t('accounting.moneyIn'),
          t('accounting.moneyOut'),
        ]}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={styles.container}
          // scrollEventThrottle={400}
          // onScroll={({nativeEvent}) => {
          //   if (isCloseToBottom(nativeEvent)) {
          //     if (currentPage < pages) {
          //       setCurrentPage(currentPage + 1);
          //     }
          //   }
          // }}
        >
          <View style={styles.infoContainer}>
            <Transactions
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              pages={pages}
              headerComponent={() => {
                return (
                  <>
                    {role === Admin && (
                      <GraphCard
                        t={t}
                        control={control}
                        data={
                          filter === 0
                            ? queryAllTransactions.data
                            : filter === 1
                            ? queryMoneyInTransactions.data
                            : queryMoneyOutTransactions.data
                        }
                        filter={filter}
                        period={watch('period')}
                      />
                    )}
                    <SearchBox
                      t={t}
                      search={searchText}
                      setSearchText={setSearchText}
                      updateSearchText={updateSearchText}
                    />
                  </>
                );
              }}
              filteredData={data}
              showBottomLoader={pages > currentPage}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {!!filter && (
        <Can I={CREATE} a={TRANSACTIONS}>
          <Plus
            onPress={() => {
              navigation.navigate('CreateTransaction', {
                type: filter == 1 ? 'in' : 'out',
              });
            }}
          />
        </Can>
      )}
    </View>
  );
};
export default Accounting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  pieContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: theme.whiteColor,
    marginHorizontal: 20,
    borderRadius: 6,
    // paddingHorizontal: 10,
    paddingVertical: 17,
    shadowColor: theme.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    // flex: 1,
    // backgroundColor: 'pink',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  infoContainer: {
    flex: 3,
    //
  },
  summaryOuterContainer: {
    flex: 1,
  },
  summaryContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  graphBars: {
    flex: 1,
    marginRight: 15,
    marginLeft: 7.5,
  },
  summrySec: {
    justifyContent: 'center',
    // alignItems: 'center',
    // alignContent:'center',
    // alignContent:"center",
    // backgroundColor:'red',
    // flexDirection: 'row',
    height: '100%',
    // width: '50%',
    flex: 1,
    marginLeft: 15,
    marginRight: 7.5,
  },
  summaryItem: {
    flexDirection: 'row',
  },
  summaryItemColorContainer: {
    marginEnd: WP(3),
  },
  summaryItemContainer: {
    marginVertical: HP(0.75),
  },
});

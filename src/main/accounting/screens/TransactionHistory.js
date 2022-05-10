import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import AppTextInput from '../../../components/AppTextInput';
import Header from '../../../components/Header';
import Transactions from '../components/Transactions';
import {setLoading} from '../../../redux/misc';
import {mngmtHttp} from '../../../utils/http/Http';
import {theme} from '../../../utils/design';

const TransactionHistory = ({navigation, route}) => {
  const {contact} = route.params;

  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [pages, setPages] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const queryTransactions = useQuery(`TRANSACTIONS`, () =>
    mngmtHttp.get(`/contacts/${contact}/transactions`).then(response => {
      setPages(response?.data?.meta?.last_page);
      return response.data?.data;
    }),
  );

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter(
          value =>
            value.category?.name
              ?.toLowerCase()
              .includes(`${searchText.toLowerCase()}`) ||
            value.assignee
              ?.toLowerCase()
              .includes(`${searchText.toLowerCase()}`),
        ),
      );
    }
  }, [searchText, data]);

  useEffect(() => {
    if (queryTransactions) {
      currentPage > 1
        ? setData([...data, ...queryTransactions.data])
        : setData(queryTransactions.data);
    }
  }, [queryTransactions?.data]);

  useEffect(() => {
    dispatch(setLoading(queryTransactions.isLoading));
  }, [queryTransactions.isLoading]);

  useFocusEffect(
    useCallback(() => {
      queryTransactions.refetch();
    }, [currentPage]),
  );

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  return (
    <View style={styles.container}>
      <Header name={t(route.name)} navigation={navigation} />
      <View
        style={styles.container}
        scrollEventThrottle={400}
        // onScroll={({nativeEvent}) => {
        //   if (isCloseToBottom(nativeEvent)) {
        //     if (currentPage < pages) {
        //       setCurrentPage(currentPage + 1);
        //     }
        //   }
        // }}
      >
        <View style={styles.searchContainer}>
          <AppTextInput
            placeholder={t('contacts.searchPlaceholder')}
            placeholderTextColor={'#7c7c7c'}
            backgroundColor={'#F5F5F5'}
            style={{
              height: 45,
              borderColor: '#E9EDF1',
              borderRadius: 150,
              // marginHorizontal: 20,
            }} // borderColor={'red'}
            leftIcon={'search'}
            leftIconColor="#2A3D47"
            disabledTitle={1}
            onChangeText={text => setSearchText(text)}
          />
        </View>
        <View style={styles.infoContainer}>
          <Transactions
            filteredData={filteredData}
            showBottomLoader={pages != currentPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pages={pages}
          />
        </View>
      </View>
    </View>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  infoContainer: {
    flex: 1,
  },
});

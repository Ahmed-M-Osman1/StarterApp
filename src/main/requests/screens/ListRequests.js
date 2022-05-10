import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import Header from '../../../components/Header';
import RequestItem from '../components/RequestItem';
import NoData from '../../../components/NoData';
import Plus from '../../../components/Plus';
import {Can} from '../../../utils/Can';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {REQUESTS} from '../../../utils/constants/PermissionSubject';
import {mngmtHttp} from '../../../utils/http/Http';
import {setLoading} from '../../../redux/misc';
import {
  Admin,
  Maintenance,
  Management,
  Security,
  Tenant,
} from '../../../utils/constants/Role';
import {theme} from '../../../utils/design';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/core';
import CancelRequestModel from '../components/CancelRequestModal';
import EarningCard from '../components/EarningCard';
import {AlertHelper} from '../../../utils/AlertHelper';
import TaskModal from '../components/TaskModal';

const moment = require('moment');

const ListRequests = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(0);
  const [filterData, setFilterData] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [visitorData, setVisitorData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const isLoading = useSelector(state => state.misc.loading);

  const updateSearchText = event => {
    setSearchText(event.nativeEvent.text);
  };

  // States for Maintenance
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const role = useSelector(state => state.user.data.role);
  const query = useQuery(
    [
      `requests_${role}_${
        role != Maintenance && role != Security ? +filter + 1 : +filter + 2
      }_${filterData}`,
      searchText,
    ],
    () =>
      mngmtHttp
        .get(
          `/requests/by-type/${filterData}?search=${searchText}&page=${currentPage}`,
        )
        .then(response => {
          setPages(response?.data?.meta?.last_page);
          return response.data;
        }),
    {keepPreviousData: true},
  );

  const wallet = useQuery(`/professional_wallet`, () =>
    role !== Admin &&
    role !== Management &&
    role !== Security &&
    role !== Tenant
      ? mngmtHttp
          .get(`/professional-wallet`)
          .then(resp => resp.data)
          .catch(e => {
            console.log(e);
            AlertHelper.showMessage('error', JSON.stringify(e.message));
          })
          .finally(() => {})
      : () => {},
  );

  const listOfAvailableRequestCategories = useQuery(
    'listOfAvailableRequestCategories',
    () =>
      mngmtHttp
        .get(`/request-category`)
        .then(resp => resp.data)
        .catch(e => console.log(e)),
  );

  useEffect(() => {
    crashlytics().log(`Listing requests filter: ${filter}`);
  }, []);

  useEffect(() => {
    query.refetch();
  }, [filter, filterData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      // dispatch(setLoading(true));
      query.refetch();
      if (
        role !== Admin &&
        role !== Management &&
        role !== Security &&
        role !== Tenant
      ) {
        wallet.refetch();
      }
    });
  }, []);

  useEffect(() => {
    if (query.data) {
      currentPage > 1
        ? setData([...data, ...query.data.data])
        : setData(query.data.data);
    }
  }, [query.data]);

  useFocusEffect(
    useCallback(() => {
      query.refetch();
    }, [currentPage]),
  );

  useEffect(() => {
    dispatch(setLoading(query.isLoading || query.isFetching));
  }, [query.isLoading, query.isFetching]);

  const sampleData = [10, 30, 42, 20, 30, 60];

  const handleCancelPress = () => {
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header
        name={
          role === Maintenance
            ? t('professtional.task')
            : role === Security
            ? t('dashboardTab')
            : t('requestsTab')
        }
        navigation={navigation}
        tabs={true}
      />
      <View style={{height: 20}} />
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
          onChangeText={() => {}}
          onSubmitEditing={updateSearchText}
        />
      </View>

      {role == Maintenance && (
        <View style={{margin: 20}}>
          <EarningCard
            data={
              !!wallet?.data?.walletHistory?.length
                ? wallet?.data?.walletHistory?.map(i => i.amount ?? 0)
                : sampleData
              // wallet?.data?.walletHistory?.map(i => i.amount ?? 0).length >  ?? sampleData
              // sampleData
            }
            wallet={wallet.data}
          />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginLeft: 20,
            marginVertical: 10,
          }}>
          <AppText
            regular
            fontSize={theme.s1.size}
            fontWeight={theme.s1.fontWeight}
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {I18nManager.isRTL && t('common.list') + ' '}
            {role === Maintenance
              ? t('professtional.task')
              : t('requestsTab')}{' '}
            {!I18nManager.isRTL && t('common.list')}
          </AppText>
          <View style={{height: 5}} />
          <AppText
            regular
            Tcolor={theme.greyColor}
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            textAlign={'left'}>
            {moment().format('DD-MM-YYYY')}
          </AppText>
        </View>
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 30,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('VisitorRequestHistoryList')}
            activeOpacity={0.5}
            style={{
              flex: 1,
              width: 130,
              justifyContent: 'center',
            }}>
            <AppText
              regular
              fontSize={theme.p1.size}
              fontWeight={theme.p1.fontWeight}
              Tcolor={theme.primaryColor}
              textAlign={'right'}>
              {t('common.viewHistory')}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        {data && data.length > 0 ? (
          <FlatList
            data={data}
            // horizontal={true}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <View style={{height: 15}} />}
            ItemSeparatorComponent={() => <View style={{height: 15}} />}
            renderItem={({item, index}) => (
              <RequestItem
                navigation={navigation}
                item={item}
                query={query}
                setSelectedRequest={setSelectedRequest}
                handleCancelPress={handleCancelPress}
                listOfAvailableRequestCategories={
                  listOfAvailableRequestCategories
                }
              />
            )}
            keyExtractor={item => item.id}
            onRefresh={() => {
              query.refetch();
            }}
            ListEmptyComponent={<NoData />}
            refreshing={isLoading}
            ListFooterComponent={() => {
              return currentPage != pages ? (
                <View style={{marginVertical: 20}}>
                  <ActivityIndicator color={theme.tertiaryColor} />
                </View>
              ) : (
                <View style={{height: 80}} />
              );
            }}
            onEndReached={() => {
              if (currentPage < pages) {
                setCurrentPage(currentPage + 1);
              }
            }}
          />
        ) : (
          <NoData />
        )}
      </View>
      <View style={{zIndex: 0}}>
        {role === Security ? (
          !visible ? (
            <Plus
              onPress={() => {
                navigation.navigate('VisitorReq');
              }}
            />
          ) : (
            <></>
          )
        ) : (
          <Can I={CREATE} a={REQUESTS}>
            <Plus
              onPress={() => {
                navigation.navigate('NewRequest');
              }}
            />
          </Can>
        )}
      </View>

      <CancelRequestModel
        setVisible={setVisible}
        request={selectedRequest}
        visible={visible}
        navigation={navigation}
      />

      <TaskModal
        visible={isTaskModalVisible}
        request={selectedRequest}
        navigation={navigation}
        refresh={() => query.refetch()}
        setVisible={evt => {
          setIsTaskModalVisible(evt);
          setSelectedRequest({});
        }}
      />
    </View>
  );
};

export default ListRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

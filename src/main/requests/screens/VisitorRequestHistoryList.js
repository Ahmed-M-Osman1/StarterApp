import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../../../components/Header';
import {theme} from '../../../utils/design';
import {useTranslation} from 'react-i18next';
import AppTextInput from '../../../components/AppTextInput';
import AppText from '../../../components/AppText';
import AppDropDownSortFilter from '../../../components/AppDropDownSortFilter';
import {RequestFilter} from '../../../utils/constants/Filter';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {mngmtHttp} from '../../../utils/http/Http';
import AppFlatList from '../../../components/AppFlatList';
import NoData from '../../../components/NoData';
import RequestItem from '../components/RequestItem';

const VisitorRequestHistoryList = ({navigation}) => {
  const {t} = useTranslation();
  // const [searchText, setSearchText] = useState('');
  // const [filter, setFilter] = useState(0);
  const [filterData, setFilterData] = useState(-1);

  const role = useSelector(state => state.user.data.role);
  const query = useQuery(`requestsHistory`, () =>
    mngmtHttp.get(`/requests/by-type/${filterData}`).then(response => {
      return response.data;
    }),
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
    query.refetch();
  }, [filterData]);

  return (
    <View style={styles.container}>
      <Header name={t('requestsTab')} navigation={navigation} />
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
          onChangeText={text => setSearchText(text)}
        />
      </View>
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
            History
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
          <AppDropDownSortFilter
            state={[filterData, setFilterData]}
            data={{
              data: RequestFilter,
            }}
            clear={true}
            placeholder={t('properties.filter')}
            icon={'filter'}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        {query?.data?.data && query?.data?.data?.length > 0 ? (
          <AppFlatList
            data={query.data.data}
            renderItem={({item}) => (
              <View style={{marginVertical: 10, marginHorizontal: 20}}>
                <RequestItem
                  key={item.id}
                  navigation={navigation}
                  item={item}
                  query={query}
                  listOfAvailableRequestCategories={
                    listOfAvailableRequestCategories
                  }
                />
              </View>
            )}
            ListHeaderComponent={<View style={{height: 10}} />}
            ListFooterComponent={<View style={{height: 80}} />}
          />
        ) : (
          <NoData />
        )}
      </View>
    </View>
  );
};
export default VisitorRequestHistoryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

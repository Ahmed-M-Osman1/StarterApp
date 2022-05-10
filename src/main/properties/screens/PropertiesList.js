import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useAbility} from '@casl/react';
import {useDispatch} from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import Header from '../../../components/Header';
import AppDropDownSortFilter from '../../../components/AppDropDownSortFilter';
import AppButtonGroup from '../../../components/AppButtonGroup';
import PropertyItem from '../components/PropertyItem';
import WhiteSpace from '../../../components/WhiteSpace';
import NoData from '../../../components/NoData';
import UnitItem from '../components/UnitItem';
import Plus from '../../../components/Plus';
import {setLoading} from '../../../redux/misc';
import {mngmtHttp} from '../../../utils/http/Http';
import {AbilityContext} from '../../../utils/Can';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {
  BUILDINGS,
  COMMUNITIES,
  PROPERTY,
  UNITS,
} from '../../../utils/constants/PermissionSubject';
import {Sort} from '../../../utils/constants/Sort';
import {Filter} from '../../../utils/constants/Filter';
import {HP, theme, WP} from '../../../utils/design';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';

const PropertiesList = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const ability = useAbility(AbilityContext);

  const updateSearchText = event => {
    setSearchText(event.nativeEvent.text);
  };

  const ref = useRef();
  const [filter, setFilter] = useState(0);
  const [sortData, setSortData] = useState(2); // Default value for Sorting = 2 FYI: Reference from  web.
  const [filterData, setFilterData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');

  const query = useQuery(
    [`properties_${filter}`, currentPage, filter, filterData, searchText],
    () =>
      mngmtHttp
        .get(
          filter == 0
            ? `/complexes?sort_dir=${Sort.find(obj => obj.id == sortData)?.key}`
            : filter == 1
            ? `/properties?type=2&sort_dir=${
                Sort.find(obj => obj.id == sortData)?.key
              }`
            : `/properties?type=1&sort_dir=${
                Sort.find(obj => obj.id == sortData)?.key
              }&availability=${
                filterData &&
                (Filter.find(obj => obj.id == filterData)?.key ?? 'All')
              }`,
          {
            params: {
              page: currentPage,
              search: searchText,
            },
          },
        )
        .then(response => {
          setPages(response?.data?.meta?.last_page);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        }),
    {keepPreviousData: true},
  );

  useEffect(() => {
    crashlytics().log(`Listing properties filter: ${filter}`);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    if (query) {
      currentPage > 1
        ? setData([...data, ...query.data?.data])
        : setData(query.data?.data);
    }
  }, [query?.data]);

  useEffect(() => {
    setCurrentPage(1);
    // dispatch(setLoading(true));
    // query.refetch().then(() => dispatch(setLoading(false)));
    query.refetch();
    ref && ref.current?.scrollToOffset({animated: true, offset: 0});
  }, [filter, sortData, filterData]);

  useEffect(() => {
    // dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      // dispatch(setLoading(true));
      query.refetch();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Header name={t('propertiesTab')} navigation={navigation} tabs={true} />
      <View style={{height: 10}} />
      {/* <View style={styles.searchContainer}>
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
      </View> */}
      <View style={{height: 10}} />
      <AppButtonGroup
        state={[filter, setFilter]}
        buttons={[
          t('properties.communities'),
          t('properties.buildings'),
          t('properties.units'),
        ]}
      />
      <View style={{height: 10}} />
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginHorizontal: 20,
          }}>
          <AppText
            regular
            fontWeight={theme.c1.fontWeight}
            Tcolor={theme.greyColor}
            fontSize={theme.c1.size}>
            {`${
              filter == 0
                ? t('properties.communities')
                : filter == 1
                ? t('properties.buildings')
                : t('properties.units')
            }: ${query.data?.meta?.total ? query.data?.meta?.total : 0}`}
          </AppText>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginHorizontal: 20,
          }}>
          <AppDropDownSortFilter
            state={[sortData, setSortData]}
            data={{
              data: Sort,
            }}
            placeholder={t('properties.sort')}
            icon={'sort'}
          />
          {filter == 2 && (
            <AppDropDownSortFilter
              state={[filterData, setFilterData]}
              data={{
                data: Filter,
              }}
              placeholder={t('properties.filter')}
              icon={'filter'}
            />
          )}
        </View>
      </View>
      <WhiteSpace variant={1} />
      <View style={{flex: 1}}>
        {query?.data?.data?.length > 0 ? (
          <FlatList
            ref={input => (ref.current = input)}
            data={data}
            keyExtractor={(item, idx) => `${item.id}-${item.name}-${idx}`}
            onEndReachedThreshold={0}
            onEndReached={() => {
              if (currentPage < pages) {
                setCurrentPage(currentPage + 1);
                query.refetch();
              }
            }}
            renderItem={({item}) =>
              filter == 2 ? (
                <UnitItem item={item} fromParent={false} navigation={navigation} />
              ) : (
                <View style={{marginHorizontal: 20}}>
                  <PropertyItem
                    variant={filter}
                    item={item}
                    navigation={navigation}
                    prev="PropertiesList"
                  />
                </View>
              )
            }
            ListHeaderComponent={() => <View style={{height: 20}} />}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListFooterComponent={() => {
              return currentPage != pages ? (
                <View style={{marginVertical: 20}}>
                  <ActivityIndicator color={theme.primaryColor} />
                </View>
              ) : (
                <View style={{height: 50}} />
              );
            }}
          />
        ) : (
          query?.data && <NoData />
        )}
      </View>
      {(ability.can(CREATE, COMMUNITIES) && filter == 0) ||
      (ability.can(CREATE, BUILDINGS) && filter == 1) ||
      ability.can(CREATE, PROPERTY) ||
      (ability.can(CREATE, UNITS) && filter == 2) ? (
        <Plus
          onPress={() => {
            if (filter == 2) {
              navigation.navigate('NewUnit');
              // navigation.navigate('NewProperty', {
              //   variant: 2,
              //   prev: 'PropertiesList',
              // });
            } else {
              navigation.navigate('NewProperty', {
                variant: filter,
                prev: 'PropertiesList',
              });
            }
          }}
        />
      ) : undefined}
    </View>
  );
};
export default PropertiesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

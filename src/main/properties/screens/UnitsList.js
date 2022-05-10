import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {useAbility} from '@casl/react';
import {useFocusEffect} from '@react-navigation/core';
import Header from '../../../components/Header';
import AppButtonGroup from '../../../components/AppButtonGroup';
import WhiteSpace from '../../../components/WhiteSpace';
import NoData from '../../../components/NoData';
import UnitItem from '../components/UnitItem';
import Plus from '../../../components/Plus';
import {setLoading} from '../../../redux/misc';
import {AbilityContext} from '../../../utils/Can';
import {mngmtHttp} from '../../../utils/http/Http';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {PROPERTY, UNITS} from '../../../utils/constants/PermissionSubject';
import AppDropDownSortFilter from '../../../components/AppDropDownSortFilter';
import {Sort} from '../../../utils/constants/Sort';
import {Filter} from '../../../utils/constants/Filter';
import {HP, theme, WP} from '../../../utils/design';
import AppText from '../../../components/AppText';

const UnitsList = ({route, navigation}) => {
  const {item} = route.params;

  const ref = useRef();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(0);
  const [sortData, setSortData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [data, setData] = useState([]);

  const ability = useAbility(AbilityContext);

  const query = useQuery(
    [`BUILDING UNITS`, currentPage],
    () =>
      mngmtHttp
        .get(`/multi-units/${item.id}/single-units`, {
          params: {
            page: currentPage,
            sort_dir: sortData && Sort.find(obj => obj.id == sortData).key,
            availability:
              filterData && Filter.find(obj => obj.id == filterData).key,
          },
        })
        .then(response => {
          setPages(response?.data?.meta?.last_page);
          return response.data;
        }),
    {keepPreviousData: true},
  );

  useEffect(() => {
    if (query) {
      currentPage > 1
        ? setData([...data, ...query.data?.data])
        : setData(query.data?.data);
    }
  }, [query?.data]);

  useEffect(() => {
    setCurrentPage(1);
    dispatch(setLoading(true));
    query.refetch();
    dispatch(setLoading(false));

    ref && ref.current?.scrollToOffset({animated: true, offset: 0});
  }, [filter, sortData, filterData]);

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
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
      <Header name={item?.name} navigation={navigation} />
      <WhiteSpace variant={1} />
      <AppButtonGroup
        state={[filter, setFilter]}
        buttons={[t('properties.units')]}
      />
      <WhiteSpace variant={0.5} />
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <AppText
            style={{marginTop: HP(1), fontFamily: null, fontWeight: '500'}}
            Tcolor={theme.greyColor}
            fontSize={theme.subTitleFontSize}>{`${t(
            'properties.units',
          )} count: ${
            query.data?.meta?.total ? query.data?.meta?.total : 0
          }`}</AppText>
        </View>
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: WP(3),
          }}>
          <AppDropDownSortFilter
            state={[sortData, setSortData]}
            data={{
              data: Sort,
            }}
            placeholder={t('properties.sort')}
            icon={'sort'}
          />
          <AppDropDownSortFilter
            state={[filterData, setFilterData]}
            data={{
              data: Filter,
            }}
            placeholder={t('properties.filter')}
            icon={'filter'}
          />
        </View>
      </View>
      <WhiteSpace variant={1} />
      {query?.data?.data && (
        <>
          {query?.data?.data?.length > 0 ? (
            <FlatList
              ref={input => (ref.current = input)}
              data={data}
              keyExtractor={(item, idx) => `${item?.id}-${item?.name}-${idx}`}
              onEndReachedThreshold={0}
              onEndReached={() => {
                if (currentPage < pages) {
                  setCurrentPage(currentPage + 1);
                  query.refetch();
                }
              }}
              renderItem={({item}) => (
                <UnitItem
                  variant={filter + 2}
                  item={item}
                  fromParent={true}
                  navigation={navigation}
                  prev={'UnitsList'}
                />
              )}
              ListFooterComponent={() => {
                return (
                  currentPage != pages && (
                    <View style={{marginVertical: HP(2)}}>
                      <ActivityIndicator color={theme.primaryColor} />
                    </View>
                  )
                );
              }}
            />
          ) : (
            query.data?.data && <NoData />
          )}

          {ability.can(CREATE, PROPERTY) ||
          (ability.can(CREATE, UNITS) && filter + 2 == 2) ? (
            <Plus
              onPress={() => {
                navigation.navigate('NewUnit', {parent: {...item, building: { id: item?.id, name: item?.name }}, fromParent: true });
                // navigation.navigate('NewProperty', {
                //   variant: filter + 2,
                //   id: item.id,
                //   prev: 'UnitsList',
                // });
              }}
            />
          ) : undefined}
        </>
      )}
    </View>
  );
};
export default UnitsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

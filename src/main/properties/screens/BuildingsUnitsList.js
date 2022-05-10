import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {useAbility} from '@casl/react';
import {useFocusEffect} from '@react-navigation/core';
import Header from '../../../components/Header';
import AppButtonGroup from '../../../components/AppButtonGroup';
import PropertyItem from '../components/PropertyItem';
import WhiteSpace from '../../../components/WhiteSpace';
import AppFlatList from '../../../components/AppFlatList';
import AppDropDownSortFilter from '../../../components/AppDropDownSortFilter';
import NoData from '../../../components/NoData';
import UnitItem from '../components/UnitItem';
import Plus from '../../../components/Plus';
import {mngmtHttp} from '../../../utils/http/Http';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {
  BUILDINGS,
  PROPERTY,
  UNITS,
} from '../../../utils/constants/PermissionSubject';
import {AbilityContext} from '../../../utils/Can';
import {setLoading} from '../../../redux/misc';
import {Sort} from '../../../utils/constants/Sort';
import {Filter} from '../../../utils/constants/Filter';
import {HP, theme, WP} from '../../../utils/design';
import AppText from '../../../components/AppText';

const BuildingsUnitsList = ({route, navigation}) => {
  const {item} = route.params;
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState(0);
  const [sortData, setSortData] = useState(null);
  const [filterData, setFilterData] = useState(null);

  const ability = useAbility(AbilityContext);
  const query = useQuery('PROPERTIES IN COMPLEX', () =>
    mngmtHttp
      .get(`/complexes/${item.id}/${filter == 0 ? `multi` : `single`}-units`, {
        params: {
          sort_dir: sortData && Sort.find(obj => obj.id == sortData).key,
          availability:
            filterData && Filter.find(obj => obj.id == filterData).key,
        },
      })
      .then(response => response.data),
  );

  useFocusEffect(
    useCallback(() => {
      query.refetch();
    }, []),
  );

  useEffect(() => {
    query.refetch();
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
      <Header name={item.name} navigation={navigation} />
      <WhiteSpace variant={1} />
      <AppButtonGroup
        state={[filter, setFilter]}
        buttons={[t('properties.buildings'), t('properties.units')]}
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
            fontSize={theme.subTitleFontSize}>{`${
            filter == 0 ? t('properties.buildings') : t('properties.units')
          } count: ${
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
          {filter == 1 && (
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
      {query?.data?.data && (
        <>
          {query?.data?.data?.length > 0 ? (
            <AppFlatList
              data={query.data?.data}
              renderItem={({item}) =>
                filter == 0 ? (
                  <PropertyItem
                    variant={filter + 1}
                    item={item}
                    navigation={navigation}
                    prev={'BuildingsUnitsList'}
                  />
                ) : (
                  <UnitItem
                    variant={filter + 1}
                    item={item}
                    fromParent={true}
                    navigation={navigation}
                    prev={'BuildingsUnitsList'}
                  />
                )
              }
            />
          ) : (
            query?.data?.data && <NoData />
          )}
          {(ability.can(CREATE, BUILDINGS) && filter + 1 == 1) ||
          ability.can(CREATE, PROPERTY) ||
          (ability.can(CREATE, UNITS) && filter + 1 == 2) ? (
            <Plus
              onPress={() => {
                if (filter == 1) {
                  navigation.navigate('NewUnit', {parent: { ...item, community: { id: item?.id, name: item?.name } }});
                  // navigation.navigate('NewProperty', {
                  //   variant: 1,
                  //   id: item.id,
                  //   prev: 'BuildingsUnitsList',
                  // });
                } else {
                  navigation.navigate('NewProperty', {
                    variant: filter + 1,
                    id: item.id,
                    prev: 'BuildingsUnitsList',
                    parent: item,
                  });
                }
              }}
            />
          ) : undefined}
        </>
      )}
    </View>
  );
};
export default BuildingsUnitsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

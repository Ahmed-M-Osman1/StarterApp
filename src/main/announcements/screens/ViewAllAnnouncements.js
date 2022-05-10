import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, SafeAreaView, View} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import AppButtonGroup from '../../../components/AppButtonGroup';
import AppFlatList from '../../../components/AppFlatList';
import Header from '../../../components/Header';
import NoData from '../../../components/NoData';
import Plus from '../../../components/Plus';
import WhiteSpace from '../../../components/WhiteSpace';
import {setLoading} from '../../../redux/misc';
import {Can} from '../../../utils/Can';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {REQUESTS} from '../../../utils/constants/PermissionSubject';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import CarouselCard from '../components/CarouselCard';
import FlatListCard from '../components/FlatListCard';

const ViewAllAnnouncements = ({navigation}) => {
  const [filter, setFilter] = useState(0);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const role = useSelector(state => state.user.data.role);

  const query = useQuery(
    `ANNOUNCEMENT-${filter}-${role}`,
    () =>
      mngmtHttp
        .get(`${filter ? '/announcement-completed' : '/announcement'}`)
        .then(response => {
          return response.data;
        })
        .catch(err => console.log(err)),
  );

  useEffect(() => {
    query.refetch();
  }, [filter]);

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      query.refetch();
    });
  }, []);


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.whiteColor}}>
      <Header navigation={navigation} name="All Announcement" />
      <View style={{height: 10}} />
      {/* <WhiteSpace variant={1} /> */}
      <AppButtonGroup
        state={[filter, setFilter]}
        buttons={[
          t('dashboard.announcements.upcoming'),
          t('dashboard.announcements.previous'),
        ]}
      />

      <View style={{flex: 1, width: '100%', marginTop: 15}}>
        {query?.data?.data?.length > 0 ? (
          role === 'ADMIN' ? (
            <FlatList
              navigation={navigation}
              data={query?.data?.data}
              ListHeaderComponent={() => <View style={{height: 20}} />}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
              renderItem={({item}) => (
                <FlatListCard item={item} navigation={navigation} />
              )}
              ListFooterComponent={<View style={{height: 80}} />}
            />
          ) : (
            <FlatList
              navigation={navigation}
              data={query?.data?.data}
              renderItem={({item}) => (
                <FlatListCard item={item} navigation={navigation} />
              )}
              ListFooterComponent={<View style={{height: 80}} />}
            />
          )
        ) : (
          <NoData />
        )}
      </View>

      {role === 'ADMIN' && (
        <Can I={CREATE} a={REQUESTS}>
          <Plus
            onPress={() => {
              navigation.navigate('NewAnnouncement');
            }}
          />
        </Can>
      )}
    </SafeAreaView>
  );
};

export default ViewAllAnnouncements;

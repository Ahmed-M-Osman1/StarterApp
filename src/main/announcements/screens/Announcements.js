import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../../../components/AppText';
import NoData from '../../../components/NoData';
import WhiteSpace from '../../../components/WhiteSpace';
import {mngmtHttp} from '../../../utils/http/Http';
import {theme, WP} from '../../../utils/design';
import {setLoading} from '../../../redux/misc';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/core';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CarouselCard from '../components/CarouselCard';

const Announcements = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const query = useQuery(`Announcements`, () =>
    mngmtHttp.get(`/announcement`).then(response => response.data.data),
  );

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({item, index}) => {
    return <CarouselCard item={item} key={item.id} navigation={navigation} />;
  };

  const pagination = () => {
    return (
      <Pagination
        dotsLength={
          query.data?.length &&
          query?.data.filter((filter, index) => filter.is_visible && index < 8)
            ?.length
        }
        activeDotIndex={activeIndex}
        dotStyle={styles.dotStyle}
        inactiveDotOpacity={0.1}
        inactiveDotScale={1}
      />
    );
  };

  const role = useSelector(state => state.user.data.role);

  return (
    <View style={styles.container}>
      <WhiteSpace variant={0.5} />
      <SafeAreaView style={{flex: 1, paddingTop: 50}}>
        <View style={styles.carouselContainer}>
          {query?.data?.length > 0 ? (
            <Carousel
              layout={'default'}
              data={
                query.data?.length &&
                query?.data.filter(
                  (filter, index) => filter.is_visible && index < 8,
                )
              }
              sliderWidth={WP(15)}
              keyExtractor={(item, index) => index.toString()}
              itemWidth={WP(100)}
              renderItem={renderItem}
              useScrollView={true}
              onSnapToItem={index => setActiveIndex(index)}
            />
          ) : (
            // <NoData />
            <View style={{height: 30}} />
          )}
        </View>
      </SafeAreaView>
      {role !== 'ADMIN' && pagination()}
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.whiteColor,
  },
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: theme.primaryColor,
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

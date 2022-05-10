import React, {Fragment, useRef} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useQuery} from 'react-query';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import Header from '../../../components/Header';
import WhiteSpace from '../../../components/WhiteSpace';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import EventCard from '../components/EventCard';
import sampleImage from '../../../../assets/images/images/announcement-placholder.png';
import NoData from '../../../components/NoData';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import AppImage from '../../../components/AppImage';

const moment = require('moment');
const HEADER_MAX_HEIGHT = Dimensions.get('window').height / 2.5;
// Dimensions.get('window').height / 4.5;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT + 1300;

const EventDetails = ({route, navigation}) => {
  const query = useQuery(`EventDetails`, () =>
    mngmtHttp
      .get(`/announcement/${route.params.id}`)
      .then(response => response.data.data),
  );
  const {t} = useTranslation();

  const scrollAnim = useRef(new Animated.Value(0));

  const headerTranslateY = () =>
    scrollAnim.current.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

  const imageTranslateY = () =>
    scrollAnim.current.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

  const headers = useSelector(state => state.user);

  const getTime = (value) => {
    let time = value.split(':');
    var formatted = moment().set({
      'hour': time[0],
      'minute': time[1],
      'second': 0
    }).format('hh:mm A');
    return formatted;
  }

  return (
    <>
      <View style={{backgroundColor: theme.whiteColor, zIndex: 99}}>
        <Header
          navigation={navigation}
          // textColor={theme.whiteColor}
          LeftIconColor={theme.whiteColor}
          name="Event Details"
        />
      </View>
      <View style={{flex: 1, backgroundColor: theme.whiteColor}}>
        {query?.data ? (
          <Animated.ScrollView
            contentContainerStyle={{
              paddingTop: HEADER_MAX_HEIGHT,
              marginHorizontal: 20,
            }}
            bounces={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollAnim.current}}}],
              {useNativeDriver: true},
            )}>
            <WhiteSpace variant={1} />
            <AppText
              fontSize={theme.superTitleFontSize}
              fontWeight={'600'}
              Tcolor={theme.blackColor}
              textAlign="left">
              {query?.data?.title}
            </AppText>
            <WhiteSpace variant={1} />
            <View style={styles.calendarContainer}>
              <FontAwesome5Icon name="calendar" color={theme.blackColor} size={theme.iconSize} />
              <View>
                <AppText
                  fontSize={theme.titleFontSize}
                  fontWeight={'600'}
                  Tcolor={theme.blackColor}
                  textAlign="left">
                  {moment(query?.data?.start_date).format('MMMM d')} - {moment(query?.data?.end_date).format('MMMM d')}
                </AppText>
                <AppText
                  fontSize={theme.subTitleFontSize}
                  Tcolor={theme.greyColor}
                  fontWeight={'600'}
                  style={{marginVertical: 5}}
                  textAlign="left">
                  {getTime(query?.data?.start_time)} - {getTime(query?.data?.end_time)}
                </AppText>
                <AppText
                  fontSize={theme.subTitleFontSize}
                  Tcolor={theme.primaryColor}
                  fontWeight={'600'}
                  textAlign="left">
                  Add to Calendar
                </AppText>
              </View>
            </View>
            <View style={styles.locationContainer}>
              <FontAwesome5Icon name="map-marker-alt" color={theme.blackColor} size={theme.iconSize} />
              <View>
                <AppText
                  fontSize={theme.titleFontSize}
                  fontWeight={'600'}
                  Tcolor={theme.blackColor}
                  textAlign="left">
                  {query?.data && query?.data?.location}
                </AppText>
                <WhiteSpace variant={0.2} />
                {/* <AppText
                  fontSize={theme.subTitleFontSize}
                  Tcolor={theme.greyColor}
                  fontWeight={'600'}
                  style={{marginVertical: 5}}
                  textAlign="left">
                  Dubai Main road
                </AppText> */}
              </View>
            </View>
            <View style={{height: 10}} />
            <View>
              <AppText
                fontWeight={'600'}
                Tcolor={theme.blackColor}
                textAlign="left">
                About
              </AppText>
              <AppText textAlign="left" Tcolor={theme.blackColor} >
                {query?.data && query?.data?.description}
              </AppText>
            </View>
            <WhiteSpace variant={1} />
            <EventCard navigation={navigation} />

            <View style={{flexDirection: 'row', marginVertical: 20}}>
              <AppButton
                title={'Will Not Attend'}
                rounded={8}
                half
                customMargin={0}
                Tcolor={theme.primaryColor}
                style={{
                  borderColor: theme.primaryColor,
                  borderWidth: 2,
                }}
              />
              <AppButton
                title={'Will Attend'}
                rounded={8}
                customMargin={0}
                half
                Bcolor={theme.primaryColor}
                Tcolor={theme.whiteColor}
                style={{
                  marginHorizontal: 10,
                }}
              />
            </View>
          </Animated.ScrollView>
        ) : (
          <NoData />
        )}
        <Animated.View
          style={[
            styles.header,
            {transform: [{translateY: headerTranslateY()}]},
            {zIndex: -1},
          ]}>
          {query?.data?.images?.length ? (
             <AppImage uri={query?.data?.images[0].url} resizeMode={'cover'} />
          ) : (
            <Animated.Image
              style={[
                styles.headerBackground,
                {
                  transform: [{translateY: imageTranslateY()}],
                },
              ]}
              source={sampleImage}
            />
          )}
        </Animated.View>
      </View>
    </>
  );
};
export default EventDetails;

const styles = StyleSheet.create({
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginVertical: 10,
    flex: 1,
  },
  headerRow: {
    paddingVertical: 5,
    width: '100%',
    // position: 'absolute',
    // bottom: '5%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: '#62d1bc',

    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    width: '100%',
    resizeMode: 'cover',
  },
});

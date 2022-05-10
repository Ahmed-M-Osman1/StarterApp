import moment from 'moment';
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import {HP, theme, WP} from '../../../utils/design';
import sampleImage from '../../../../assets/images/images/announcement-placholder.png';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import AppImage from '../../../components/AppImage';
import Card from '../../../components/Card';
const FlatListCard = ({item, navigation}) => {
  const {t} = useTranslation();
  const headers = useSelector(state => state.user);

  const getTime = value => {
    if(!value){
      return '';
    }
    let time = value?.split(':');
    var formatted = moment()
      .set({
        hour: time[0],
        minute: time[1],
        second: 0,
      })
      .format('hh:mm A');
    return formatted;
  };

  const getNotifiedTypes = () => {
    switch (item?.notify) {
      case 1:
        return 'All';
      case 2:
        return item?.notified_users?.length
          ? t('announcements.custom')
          : `${t('announcements.all')} ${t('announcements.managers')}`;
      case 3:
        return item?.notified_users?.length
          ? t('announcements.custom')
          : `${t('announcements.all')} ${t('announcements.tenants')}`;
      case 4:
        return item?.notified_users?.length
          ? t('announcements.custom')
          : `${t('announcements.all')} ${t('announcements.tenants')}`;
      default:
        return '';
    }
  };

  return (
    <Card variant={2.6}>
      <Pressable
        style={styles.pressableContainer}
        onPress={() =>
          navigation.navigate('EventDetails', {
            id: item.id,
          })
        }>
        <View style={styles.itemsContainer}>
          <View style={{height: '70%', borderTopLeftRadius: 20}}>
            {item?.images?.length ? (
              <AppImage uri={item?.images[0]?.url} resizeMode={'cover'} />
            ) : (
              <Image
                source={sampleImage}
                style={{width: '100%', height: '100%'}}
              />
            )}
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.01)',
                'rgba(0,0,0,0.3)',
                'rgba(0,0,0,0.7)',
              ]}
              style={styles.lineargradient}>
              <AppText
                Tcolor={theme.whiteColor}
                textAlign="left"
                fontWeight={theme.s1.fontWeight}
                fontSize={theme.s1.size}>
                {item.title}
              </AppText>
              <WhiteSpace variant={0.4} />
              <AppText Tcolor={theme.whiteColor} fontSize={theme.s2.size} fontWeight={theme.s2.fontWeight} textAlign="left">
                <FontAwesome5Icon
                  name="map-marker-alt"
                  color={theme.whiteColor}
                />{' '}
                {item.location}
              </AppText>
            </LinearGradient>
            <View></View>
          </View>
          <View style={styles.subContainer}>
            <View
              style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <FontAwesome5Icon
                  name={'calendar'}
                  color={theme.primaryColor}
                  size={theme.iconSize - 7}
                />
                <AppText
                  fontSize={theme.c2.size - 2}
                  Tcolor={theme.blackColor}
                  textAlign={'left'}>
                  {moment(item.start_date).format('LL')} To{' '}
                  {moment(item.end_date).format('LL')}
                </AppText>
              </View>
              <WhiteSpace variant={0.5} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <FontAwesome5Icon
                  name={'user-friends'}
                  color={theme.primaryColor}
                  size={theme.iconSize - 7}
                />
                <AppText
                  fontSize={theme.c2.size - 2}
                  Tcolor={theme.blackColor}
                  textAlign={'left'}>
                  {getNotifiedTypes()}
                </AppText>
              </View>
            </View>
            {(item?.start_time && item?.end_time) && (
              <View style={styles.centeredView}>
                  <FontAwesome5Icon
                    name={'clock'}
                    color={theme.primaryColor}
                    size={theme.iconSize - 4}
                  />
                  <AppText
                    fontSize={theme.c2.size - 2}
                    Tcolor={theme.blackColor}
                    textAlign={'left'}>
                    {getTime(item?.start_time)} - {getTime(item?.end_time)}
                  </AppText>
                </View>
              )}
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    display: 'flex',
    position: 'relative',
    backgroundColor: 'black',
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
    height: 250,
  },
  itemsContainer: {
    // flexDirection: 'row',
    // marginVertical: 13,
    overflow: 'hidden',
    display: 'flex',
    borderRadius: 10,
    position: 'relative',
  },
  lineargradient: {
    position: 'absolute',
    height: 80,
    paddingTop: 20,
    bottom: 0,
    width: '100%',
  },
  centeredView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableContainer: {
    width: '100%',
    backgroundColor: theme.whiteColor,
    // height: 200,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#dddddd50',
    borderWidth: 1,
    shadowColor: '#dddddd90',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  subContainer: {
    height: 80,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',

    paddingVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  viewDetailsButton: {
    width: WP(30),
    height: HP(4),
    alignSelf: 'center',
  },
  dateContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    position: 'absolute',
    top: '8%',
    left: '5%',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default FlatListCard;

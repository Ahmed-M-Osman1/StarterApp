import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import {HP, theme, WP} from '../../../utils/design';
import sampleImage from '../../../../assets/images/images/announcement-placholder.png';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import AppImage from '../../../components/AppImage';
import {useTranslation} from 'react-i18next';
import Card from '../../../components/Card';
const moment = require('moment');

const CarouselCard = ({item, data, navigation}) => {
  const {t} = useTranslation();

  const headers = useSelector(state => state.user);
  return (
    <Card variant={2.6}>
    <View style={styles.container}>
   
      {item?.images?.length ? (
        <AppImage
          uri={item?.images[0]?.url}
          resizeMode={'cover'}
          style={{width: '100%', height: '70%', borderTopLeftRadius: 10, borderTopRightRadius: 10,}}
        />
      ) : (
        <Image source={sampleImage} style={{width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, height: '70%'}} />
      )}

      <View style={styles.subContainer}>
        <View style={{ width: '60%' }}>
          <AppText
            fontWeight={'700'}
            fontSize={theme.titleFontSize}
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {item?.title ?? ''}
          </AppText>
          <WhiteSpace variant={0.3} />
          <AppText
            Tcolor={theme.greyColor}
            fontSize={theme.subTitleFontSize}
            numberOfLines={1}
            textAlign={'left'}>
            <FontAwesome5Icon
              name={'map-marker-alt'}
              color={theme.primaryColor}
              size={theme.iconSize - 4}
            />
            {'  '}
            {item?.location ?? ''}
          </AppText>
        </View>
        <View>
          <AppButton
            onPress={() =>
              navigation.navigate('EventDetails', {
                id: item.id,
              })
            }
            title={t('announcements.viewDetails')}
            Bcolor={theme.primaryColor}
            rounded={8}
            fontSize={12}
            customMargin={0}
            Tcolor={theme.whiteColor}
            style={styles.viewDetailsButton}
          />
        </View>
      </View>
      {/* <View style={styles.dateContainer}>
        <AppText
          Tcolor={theme.primaryColor}
          fontWeight={'700'}
          fontSize={theme.titleFontSize}>
          {moment(item?.start_date).format('DD')}
        </AppText>
        <AppText Tcolor={theme.primaryColor} fontSize={theme.subTitleFontSize}>
          {moment(item?.start_date).format('MMM')}
        </AppText>
      </View> */}
   
    </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.whiteColor,
    // height: 200,
    borderWidth: 1,
    paddingTop: 1,
    marginTop: 10,
    overflow: 'hidden',
    display: 'flex',
    borderRadius: 10,
    position: 'relative',
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
    backgroundColor: theme.whiteColor,
    paddingVertical: 0,
    alignItems: 'center',
    paddingHorizontal: 13,
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

export default CarouselCard;

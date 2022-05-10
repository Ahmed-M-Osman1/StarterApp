import {Dimensions, PixelRatio, Platform} from 'react-native';
import config from 'react-native-ultimate-config';

const widthPercentageToDP = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const heightPercentageToDP = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
const scale = Dimensions.get('window').width / 320;
const normalize = size => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const theme = {
  whiteColor: '#ffffff',
  blackColor: '#333333',
  greyColor: '#989999',
  tabInactiveColor: '#A6A6A6',
  lightColor: '#f6f8fa',
  backgroundColor: '#f6f9fc',
  red: '#FF0000',
  orange: '#eb7200',
  green: '#22AA6F',
  yellow: '#dba400',
  purple: '#0f62fe',
  blue: '#0f62fe',
  primaryColor: config.PRIMARY_COLOR,
  secondaryColor: config.SECONDARY_COLOR,
  tertiaryColor: '#424242',
  superTitleFontSize: 26,
  titleFontSize: Math.min(normalize(14), 20),
  subTitleFontSize: Math.min(normalize(11), 16),
  h1: {size: 36, fontWeight: '800'},
  h2: {size: 32, fontWeight: '800'},
  h3: {size: 30, fontWeight: '800'},
  h4: {size: 26, fontWeight: '800'},
  h5: {size: 22, fontWeight: '800'},
  h6: {size: 18, fontWeight: '800'},
  s1: {size: 15, fontWeight: '600'},
  s2: {size: 13, fontWeight: '600'},
  p1: {size: 15, fontWeight: '400'},
  p2: {size: 13, fontWeight: '400'},
  c1: {size: 12, fontWeight: '400'},
  c2: {size: 12, fontWeight: '600'},
  label: {size: 12, fontWeight: '800'},

  iconSize: 20,
  borderRadius: {
    default: 8,
  },
  transparent: 'rgba(0,0,0,0)',
};
export {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
  normalize as norm,
  theme,
};

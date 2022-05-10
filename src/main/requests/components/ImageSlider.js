import React from 'react';
import {View} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, WP} from '../../../utils/design';

const SliderFooterComponent = ({imageIndex, length}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        alignItems: 'center',
      }}>
      {Array.from({length: length})
        .fill(1)
        .map((item, idx) => {
          let selected = imageIndex === idx;

          return (
            <Icon
              key={idx}
              name={'circle'}
              size={selected ? WP(4) : WP(3.5)}
              color={selected ? theme.primaryColor : '#004256'}
            />
          );
        })}
    </View>
  );
};

const ImageSlider = ({
  isModalVisible,
  setIsModalVisible,
  media,
  imageIndex,
}) => {
  return (
    <ImageView
      imageIndex={imageIndex}
      images={media?.map(img => ({uri: img.path || img.url}))}
      visible={isModalVisible}
      animationType={'slide'}
      doubleTapToZoomEnabled={true}
      swipeToCloseEnabled={true}
      backgroundColor={theme.blackColor}
      onRequestClose={() => setIsModalVisible(false)}
      FooterComponent={({imageIndex}) => (
        <SliderFooterComponent length={media.length} imageIndex={imageIndex} />
      )}
    />
  );
};
export default ImageSlider;

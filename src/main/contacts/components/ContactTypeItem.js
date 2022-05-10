import React from 'react';
import {StyleSheet, Pressable, View, Image} from 'react-native';
import AppText from '../../../components/AppText';
import Card from '../../../components/Card';
import {HP, theme, WP} from '../../../utils/design';

const ContactTypeItem = ({text, onPress, img, backgroundColor}) => {
  return (
    <Card variant={1.8} style={styles.cardContainer}>
      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: backgroundColor,
          borderRadius: 10,
        }}
        onPress={onPress}>
        <View
          style={{
            flex: 2,
            width: WP(42),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            resizeMode={'contain'}
            source={img}
            style={styles.contactImg}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AppText Tcolor={theme.greyColor} fontSize={theme.titleFontSize}>
            {text}
          </AppText>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: WP(42),
    borderRadius: 10,
    marginHorizontal: WP(3),
  },
  card: {
    backgroundColor: '#eee',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    elevation: 5,
    aspectRatio: 1,
  },
  contactImgContainer: {
    alignItems: 'center',
  },
  contactImg: {
    height: HP(8),
  },
});
export default ContactTypeItem;

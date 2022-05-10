import React from 'react';
import {View, Text, Pressable} from 'react-native';
import AppText from '../../../components/AppText';
import {HP, theme, WP} from '../../../utils/design';

const TwoButton = ({title, names, onPress, activeId}) => {
  return (
    <View>
      <AppText Tcolor={theme.greyColor} textAlign={'left'}>
        {title}
      </AppText>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: WP(5),
          marginVertical: HP(2),
        }}>
        <Pressable
          onPress={() => {
            onPress(0);
          }}
          style={{
            height: HP(4.5),
            width: WP(19),
            borderWidth: 0.25,
            borderColor: theme.primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: WP(4),
            borderRadius: 8,
            backgroundColor:
              activeId == 0 ? theme.primaryColor : theme.whiteColor,
          }}>
          <Text
            style={{
              fontSize: theme.subTitleFontSize,
              color: activeId == 0 ? theme.whiteColor : theme.blackColor,
            }}>
            {names[0]}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            onPress(1);
          }}
          style={{
            height: HP(4.5),
            width: WP(19),
            borderWidth: 0.25,
            borderColor: theme.primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor:
              activeId == 1 ? theme.primaryColor : theme.whiteColor,
          }}>
          <Text
            style={{
              fontSize: theme.subTitleFontSize,
              color: activeId == 1 ? theme.whiteColor : theme.blackColor,
            }}>
            {names[1]}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TwoButton;

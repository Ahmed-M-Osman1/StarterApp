import React from 'react';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Card from '../../../components/Card';
import AppText from '../../../components/AppText';
import {HP, theme, WP} from '../../../utils/design';
import shadeColor from '../../../utils/shadeColors';

const IconTextCard = ({prev, navigation, item, image, backgroundColor}) => {
  const {id, code} = item;
  const {t} = useTranslation();
  return (
    <Card variant={1.7} style={styles.cardContainer}>
      <Pressable
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          backgroundColor: backgroundColor,
          shadowColor: Platform.OS === 'android' ? '#c4c4c4' : '#eeeeee',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.8,
          shadowRadius: 10,

          elevation: 10,
          borderWidth: 1,
          borderRadius: 4,
          borderColor: shadeColor(backgroundColor, -3),
        }}
        onPress={() => {
          if (prev == 'NewRequest' && code == 1) {
            navigation.navigate('MaintenanceIssue');
          } else if (prev == 'NewRequest' && code == 4) {
            navigation.navigate('VisitorReq');
          } else if (prev == 'MaintenanceIssue') {
            navigation.navigate('AdditionalInfo', {type: 1, subtype: code});
          } else {
            navigation.navigate('AdditionalInfo', {type: code});
          }
        }}>
        <View
          style={{
            flex: 2,
            width: '90%',
            marginVertical: HP(1),
            borderRadius: 3,
            // backgroundColor: theme.greyColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={image}
            style={{
              height: theme.h3.size * 2,
              width: theme.h3.size * 2,
              resizeMode: 'contain',
            }}
          />
          {/* <FontAwesome
            name={icon}
            color={'#22AA6F'}
            size={}
          /> */}
        </View>
        <View style={{flex: 1}}>
          <AppText
            regular={true}
            textAlign={'center'}
            textTransform={'uppercase'}
            Tcolor={theme.greyColor}
            fontWeight={theme.s2.fontWeight}
            fontSize={theme.s2.size}>
            {t(`requestsCategories.${item.name}`, {defaultValue: item.name})}
          </AppText>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '45%',
    marginHorizontal: '2.5%',
  },
});

export default IconTextCard;

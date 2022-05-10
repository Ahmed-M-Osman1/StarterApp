import React from 'react';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Card from '../../../components/Card';
import AppText from '../../../components/AppText';
import {HP, theme, WP} from '../../../utils/design';

const DashboardIconTextCard = ({
  prev,
  navigation,
  item,
  image,
  backgroundColor,
}) => {
  const [value, key] = item;
  const {t} = useTranslation();

  return (
    <Card variant={1.7} style={styles.cardContainer}>
      <Pressable
        style={[styles.cardView, {backgroundColor: backgroundColor}]}
        onPress={() => {
          if (prev == 'NewRequest' && key == 1) {
            navigation.navigate('MaintenanceIssue');
          } else if (prev == 'NewRequest' && key == 4) {
            navigation.navigate('VisitorReq');
          } else if (prev == 'MaintenanceIssue') {
            navigation.navigate('AdditionalInfo', {type: 1, subtype: key});
          } else {
            navigation.navigate('AdditionalInfo', {type: key});
          }
        }}>
        <View style={{marginTop: HP(2)}}>
          <AppText Tcolor={theme.primaryColor} fontSize={16}>
            {t(`requestsCategories.${value}`)}
          </AppText>
        </View>
        <View style={styles.imageView}>
          <Image source={image} style={styles.imageCard} />
          {/* <FontAwesome
            name={icon}
            color={'#22AA6F'}
            size={}
          /> */}
        </View>
        <View style={styles.createText}>
          <AppText Tcolor={theme.whiteColor} fontSize={14}>
            {t(`dashboard.createNew`)}
          </AppText>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 190,
    height: 170,
    marginRight: 10,
  },
  createText: {
    width: '100%',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 12,
    backgroundColor: theme.primaryColor,
  },
  imageCard: {
    height: theme.iconSize + WP(7),
    tintColor: theme.primaryColor,
    width: theme.iconSize + WP(7),
    resizeMode: 'contain',
  },
  imageView: {
    flex: 1,
    width: '90%',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default DashboardIconTextCard;

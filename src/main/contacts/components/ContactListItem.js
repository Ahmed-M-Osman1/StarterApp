import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {Icon} from 'react-native-elements';
import AppText from '../../../components/AppText';
import Card from '../../../components/Card';
import {HP, theme, WP} from '../../../utils/design';
import {Tenant, Owner} from '../../../utils/constants/Role';

const IconText = ({icon, text}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <View
        style={{
          flex: 0.08,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: HP(-0.3),
        }}>
        <FontAwesome
          name={icon}
          color={theme.primaryColor}
          size={theme.iconSize - 6}
        />
      </View>
      <View style={{flex: 0.92}}>
        <AppText
          Tcolor={theme.blackColor}
          regular={true}
          fontSize={theme.subTitleFontSize}
          textAlign={'left'}>
          {text}
        </AppText>
      </View>
    </View>
  );
};
const ContactListItem = ({item, onPress, style, type, navigation}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Card style={styles.card} variant={0.8}>
        <View style={styles.headerContaier}>
          <AppText
            Tcolor={theme.blackColor}
            fontSize={theme.subTitleFontSize}
            textAlign="left">
            {item.name}
          </AppText>
          {/* <View>
            <FontAwesome
              name={'ellipsis-h'}
              color={theme.blackColor}
              size={theme.iconSize - 4}
              style={{margin: 15}}
            />
          </View> */}
        </View>
        <View style={styles.detailsContainer}>
          {type === Tenant && item.rented_units?.length ? (
            <View style={styles.unitContainer}>
              <IconText
                icon={'map-marker-alt'}
                text={`${item.rented_units[0].name}, ${
                  item.rented_units[0].community?.name ||
                  item.rented_units[0].district.name
                }`}
              />
            </View>
          ) : null}
          {type === Owner && item.owned_units?.length ? (
            <View style={styles.unitContainer}>
              <IconText
                icon={'map-marker-alt'}
                text={`${item.owned_units[0].name}, ${
                  item.owned_units[0].community?.name ||
                  item.owned_units[0].district.name
                }`}
              />
            </View>
          ) : null}
        </View>
        {/* <View>
          <AppText textAlign="left">{item.name}</AppText>
          {type === Tenant && item.rented_units.length ? (
            <View style={styles.unitContainer}>
              <Icon
                name="map-marker-alt"
                type="font-awesome-5"
                color={theme.primaryColor}
              />
              <AppText>
                {item.rented_units[0].name},{' '}
                {item.rented_units[0].community?.name ||
                  item.rented_units[0].district.name}
              </AppText>
            </View>
          ) : null}

          {type === Owner && item.owned_units.length ? (
            <View style={styles.unitContainer}>
              <Icon
                name="map-marker-alt"
                type="font-awesome-5"
                color={theme.primaryColor}
              />
              <AppText>
                {item.owned_units[0].name},{' '}
                {item.owned_units[0].community?.name ||
                  item.owned_units[0].district.name}
              </AppText>
            </View>
          ) : null}
        </View> */}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.whiteColor,
    shadowColor: 'rgba(65, 201, 142, 0.15)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  unitContainer: {
    flexDirection: 'row',
    paddingHorizontal: WP('3'),
    alignItems: 'center',
  },
  headerContaier: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: HP(1),
  },
  detailsContainer: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
});

export default ContactListItem;

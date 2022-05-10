import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import ContactTypeItem from '../components/ContactTypeItem';
import AppTextInput from '../../../components/AppTextInput';
import WhiteSpace from '../../../components/WhiteSpace';
import Header from '../../../components/Header';
import * as Role from '../../../utils/constants/Role';
import {theme, WP} from '../../../utils/design';

const ContactTypes = ({navigation}) => {
  const {t} = useTranslation();
  const roles = [
    {
      name: t('contacts.roles.CUSTOMER'),
      value: Role.Tenant,
      img: require('../../../../assets/images/contacts-icons/tenants.png'),
    },
    {
      name: t('contacts.roles.OWNER'),
      value: Role.Owner,
      img: require('../../../../assets/images/contacts-icons/owners.png'),
    },
    {
      name: t('contacts.roles.MANAGEMENT'),
      value: Role.Management,
      img: require('../../../../assets/images/contacts-icons/managers.png'),
    },
    {
      name: t('contacts.roles.PROFESSIONALS'),
      value: Role.Maintenance,
      img: require('../../../../assets/images/contacts-icons/maintenance.png'),
    },
    // {
    //   name: t('contacts.roles.CLEANING'),
    //   value: Role.Cleaner,
    //   img: require('../../../../assets/images/contacts-icons/cleaners.png'),
    // },
    // {
    //   name: t('contacts.roles.SECURITY'),
    //   value: Role.Security,
    //   img: require('../../../../assets/images/contacts-icons/security.png'),
    // },
  ];
  const icons = ['home', 'crown', 'user-tie', 'tools', 'shield-alt'];
  const colors = [
    '#E3FBFB',
    '#FDFBEB',
    '#EFFFF0',
    '#FEF5ED',
    '#FFF3F3',
    '#E9FBFF',
    '#FDFBEB',
    '#FEF7F0',
    '#F3F9FF',
    '#F6F6FF',
  ];

  return (
    <View style={styles.rootContainer}>
      <Header name={t('contactsTab')} navigation={navigation} tabs={true} />
      {/* <AppTextInput
        placeholder={t('contacts.searchPlaceholder')}
        placeholderTextColor={'#7C7C7C'}
        backgroundColor={'#F5F5F5'}
        disabledTitle={true}
        style={{
          height: 45,
          borderColor: '#E9EDF1',
          borderRadius: 150,
        }}
        leftIcon={'search'}
        leftIconColor="#2A3D47"
        editable={false}
      /> */}
      <WhiteSpace variant={1} />
      <View style={{alignItems: 'center', flex: 1}}>
        <FlatList
          data={roles}
          numColumns={2}
          keyExtractor={(item, index) => index}
          renderItem={role => (
            <ContactTypeItem
              key={role.index}
              backgroundColor={colors[role.index]}
              icon={icons[role.index]}
              text={role.item.name}
              img={role.item.img}
              onPress={() =>
                navigation.navigate('ContactsList', {
                  type: role.item.value,
                  title: role.item.name,
                })
              }
            />
          )}
        />
      </View>
    </View>
  );
};

export default ContactTypes;

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: theme.whiteColor,
    flex: 1,
  },
});

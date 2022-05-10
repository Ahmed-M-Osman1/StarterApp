import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import crashlytics from '@react-native-firebase/crashlytics';
import {useFocusEffect} from '@react-navigation/core';
import WhiteSpace from '../../../components/WhiteSpace';
import {HP, theme} from '../../../utils/design';
import {CONTACTS} from '../../../utils/constants/QueryKey';
import {mngmtHttp} from '../../../utils/http/Http';
import ContactListItem from '../components/ContactListItem';
import {Can} from '../../../utils/Can';
import Plus from '../../../components/Plus';
import Header from '../../../components/Header';
import NoData from '../../../components/NoData';
import {CREATE} from '../../../utils/constants/PermissionAction';
import {useDispatch} from 'react-redux';
import {setLoading} from '../../../redux/misc';
import AppTextInput from '../../../components/AppTextInput';
import ContactCardItem from '../components/ContactCardItem';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import {
  Maintenance,
  Management,
  Owner,
  Tenant,
} from '../../../utils/constants/Role';
import {AlertHelper} from '../../../utils/AlertHelper';

const ContactsListByType = ({navigation, route}) => {
  const {i18n} = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [inviteList, setInviteList] = useState([]);
  const dispatch = useDispatch();
  const {type} = route.params;

  const contacts = useQuery([CONTACTS, {type}], () =>
    mngmtHttp
      .get(
        `contacts?page=${currentPage}&search=${
          searchText[0] === '0' ? searchText.substring(1) : searchText
        }`,
        {
          params: {
            role: type,
          },
        },
      )
      .then(response => {
        setPages(response?.data?.meta?.last_page);
        setTotal(response?.data?.meta?.total);
        return response.data.data;
      }),
  );

  const NAVIGATE_TO = {
    MAINTENANCE: {view: 'ViewProfessional', create: 'CreateProfessional'},
    CLEANING: {view: 'ViewProfessional', create: 'CreateProfessional'},
    CUSTOMER: {view: 'ViewTenent', create: 'CreateTenant'},
    OWNER: {view: 'ViewOwner', create: 'CreateOwner'},
    MANAGEMENT: {view: 'ViewManager', create: 'CreateManager'},
    SECURITY: {view: 'ContactCU', create: 'ContactCU'},
  };

  useEffect(() => {
    dispatch(setLoading(contacts.isLoading));
  }, [contacts.isLoading]);

  useEffect(() => {
    if (contacts) {
      currentPage > 1
        ? setData([...data, ...contacts.data])
        : setData(contacts.data);
    }
  }, [contacts.data]);

  useEffect(() => {
    crashlytics().log(`Listing contacts type: ${type}`);
  }, []);

  useFocusEffect(
    useCallback(() => {
      contacts.refetch();
    }, [currentPage]),
  );

  useFocusEffect(
    useCallback(() => {
      contacts.refetch();
    }, [searchText]),
  );

  const updateInviteList = item => {
    if (inviteList.includes(item)) {
      setInviteList(inviteList.filter(i => i != item));
    } else {
      const newInviteList = [...inviteList, item];
      setInviteList([...newInviteList]);
    }
  };

  const sendBulkInvite = () => {
    dispatch(setLoading(true))
    mngmtHttp
      .post(`contacts/bulk-invite`, {
        users: inviteList,
      })
      .then(response => {
        setShowSelector(!showSelector);
        setInviteList([]);
        AlertHelper.showMessage(
          'success',
          `Invite has been sent to ${inviteList.length} users`,
        );
      })
      .catch(e => {
        console.log(e);
        AlertHelper.showMessage('error', e.response.data.message);
      })
      .finally(() => {
        dispatch(setLoading(false));
        contacts.refetch();  
      });
  };

  return (
    <View style={styles.rootContainer}>
      <Header
        name={i18n.t(
          `contacts.roles.${type === Maintenance ? 'PROFESSIONALS' : type}`,
        )}
        navigation={navigation}
      />
      <View style={{height: 20}} />
      <AppTextInput
        placeholder={i18n.t('contacts.searchPlaceholder')}
        placeholderTextColor={theme.greyColor}
        backgroundColor={'#fff'}
        disabledTitle={true}
        keyboardType={'default'}
        style={{
          height: 45,
          borderColor: theme.greyColor,
          borderRadius: 150,
        }}
        leftIcon={'search'}
        leftIconColor={theme.blackColor}
        editable={true}
        onChangeText={setSearchText}
        value={searchText}
      />

      <View style={{flex: 1, marginHorizontal: 20}}>
        <View style={{height: 10}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText
            Tcolor={theme.greyColor}
            regular={true}
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            textAlign={'left'}>
            {type === Tenant
              ? `${i18n.t('dashboard.contracts.total')} ${i18n.t(
                  'contacts.roles.CUSTOMER',
                )}: ${total ?? 0}`
              : type === Owner
              ? `${i18n.t('dashboard.contracts.total')} ${i18n.t(
                  'contacts.roles.OWNER',
                )}: ${total ?? 0}`
              : type === Management
              ? `${i18n.t('dashboard.contracts.total')} ${i18n.t(
                  'contacts.roles.MANAGEMENT',
                )}: ${total ?? 0}`
              : type === Maintenance
              ? `${i18n.t('dashboard.contracts.total')} ${i18n.t(
                  'contacts.roles.PROFESSIONALS',
                )}: ${total ?? 0}`
              : ''}
          </AppText>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setShowSelector(!showSelector)}>
            <AppText
              Tcolor={theme.primaryColor}
              regular={true}
              fontSize={theme.c2.size}
              fontWeight={theme.c2.fontWeight}
              textAlign={'left'}>
              {showSelector
                ? i18n.t('common.cancel')
                : i18n.t('UserDetailsForm.sendInvite')}
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={{height: 10}} />
        <FlatList
          data={data}
          // onEndReachedThreshold={0}
          onEndReached={() => {
            if (currentPage < pages) {
              setCurrentPage(currentPage + 1);
            }
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{height: 10}} />}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          renderItem={({item, index}) => (
            <ContactCardItem
              type={type}
              item={item}
              showSelector={showSelector}
              inviteList={inviteList}
              updateInviteList={updateInviteList}
              navigation={navigation}
              onPress={() =>
                navigation.navigate(NAVIGATE_TO[type].view, {
                  type: type,
                  item: item,
                })
              }
            />
          )}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={<NoData />}
          contentContainerStyle={
            contacts.data?.length ? null : styles.listContentConatiner
          }
          ListFooterComponent={() => {
            return currentPage != pages ? (
              <View style={{marginVertical: 20}}>
                <ActivityIndicator color={theme.tertiaryColor} />
              </View>
            ) : (
              <View style={{height: !showSelector && 80}} />
            );
          }}
        />
      </View>
      {showSelector && (
        <AppButton
          title={i18n.t('common.send')}
          onPress={() => sendBulkInvite()}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
          rounded={8}
        />
      )}
      {!showSelector && (
        <View style={styles.floatingBtn}>
          <Can I={CREATE} a={CONTACTS}>
            <Plus
              onPress={() =>
                navigation.navigate(NAVIGATE_TO[type].create, {type})
              }
            />
          </Can>
        </View>
      )}
    </View>
  );
};

export default ContactsListByType;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },

  // list: {
  //   backgroundColor: 'white',
  //   // marginHorizontal: 8,
  //   // borderRadius: theme.borderRadius.default,
  // },
  // listContentConatiner: {
  //   flexGrow: 1,
  //   justifyContent: 'center',
  // },
  // typesContainer: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  // },
  // contactTypeItem: {
  //   width: '50%',
  // },
  // floatingBtn: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },
});

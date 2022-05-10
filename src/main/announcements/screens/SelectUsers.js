import React, {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Switch, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Searchbar} from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useQuery} from 'react-query';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import {CardWithShadow} from '../../../components/CardWithShadow';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import Header from '../../../components/Header';
import WhiteSpace from '../../../components/WhiteSpace';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';

const SelectUsers = ({navigation, route}) => {
  const {t} = useTranslation();
  const [options, setOptions] = useState('ALL');
  const [inviteToggle, setInviteToggle] = useState(false);
  const [customType, setCustomType] = useState('COMMUNITY');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  const getUserType = type => {
    switch (type) {
      case 'Manager':
        return 'MANAGEMENT';
      case 'Tenant':
        return 'CUSTOMER';
      case 'Professional':
        return 'MAINTENANCE';
      default:
        return '';
    }
  };

  const query = useQuery(`NewAnnouncement-Contact-${getUserType(route.params.name)}`, () =>
    mngmtHttp
      .get(`/contacts/lite-list?role=${getUserType(route.params.name)}`)
      .then(response => response.data.data),
  );
  

  useEffect(() => {
    if(route?.params){
      if (route.params?.users?.length) {
        setUsers(route.params?.users);
      }
      setInviteToggle(route?.params?.toggle);
    }
  }, [route]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      community: '',
      unit: '',
      building: '',
    },
  });

  const unitQuery = useQuery(`ListOfUnitsInRequest`, () =>
    mngmtHttp
      .get(`/single-units/lite-list`)
      .then(response => response.data.data),
  );

  const buildingQuery = useQuery(`ListOfBuildingInRequest`, () =>
    mngmtHttp
      .get(`/multi-units/lite-list`)
      .then(response => response.data.data),
  );
  const communityQuery = useQuery(`ListOfCommunityInRequest`, () =>
    mngmtHttp.get(`/complexes/lite-list`).then(response => response.data.data),
  );

  const RenderItem = ({item, index, onPress}) => {
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={onPress}
        activeOpacity={1}>
        <CardWithShadow>
          <AppText
            textAlign="left"
            fontWeight={'600'}
            Tcolor={theme.blackColor}
            fontSize={theme.titleFontSize}>
            {item.name}
          </AppText>
          <WhiteSpace variant={0.2} />
          <AppText textAlign="left" Tcolor={theme.greyColor}>
            {item.email ? item.email : 'NA'}
          </AppText>
          <WhiteSpace variant={0.3} />
          <AppText textAlign="left"  Tcolor={theme.blackColor}>+966 - {item.phone_number}</AppText>
          {users.some(some => some.id === item.id) && (
            <View style={styles.tickContainer}>
              <FontAwesome5Icon name="check" color={theme.whiteColor} />
            </View>
          )}
        </CardWithShadow>
      </TouchableOpacity>
    );
  };

  const handleUsers = item => {
    if (!users.some(some => some.id === item.id)) {
      setUsers([...users, item]);
    } else {
      setUsers(users.filter(ele => ele.id !== item.id));
    }
  };

  const filterZones = useMemo(() => {
    return (
      query?.data &&
      query?.data.filter(listItem =>
        listItem?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    );
  }, [query, searchQuery]);

  return (
    <View style={{flex: 1, backgroundColor: theme.whiteColor}}>
      <Header
        name={`${t('newAnnouncement.select')} ${route.params.name}`}
        navigation={navigation}
      />
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 20,
          marginHorizontal: 20,
          marginVertical: 20,
          justifyContent: 'space-around',
          // backgroundColor: 'pink',
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setOptions('ALL');
          }}
          style={styles.radioContainer}>
          <View
            style={{
              borderRadius: 50,
              borderWidth: 1,
              borderColor: options === 'ALL' ? theme.primaryColor : '#ddd',
              backgroundColor:
                options === 'ALL' ? theme.primaryColor : theme.whiteColor,
              width: 15,
              height: 15,
              marginRight: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.blackColor}>
            All {route.params.name}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          // onPress={() => {
          //   setOptions('CUSTOM');
          // }}
          style={[styles.radioContainer, {marginLeft: 20}]}>
          <View
            style={{
              borderRadius: 50,
              borderWidth: 1,
              borderColor: options === 'CUSTOM' ? theme.primaryColor : '#ddd',
              backgroundColor:
                options === 'CUSTOM' ? theme.primaryColor : theme.whiteColor,
              width: 15,
              height: 15,
              marginRight: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.blackColor}>
            Custom
          </AppText>
        </TouchableOpacity>
      </View>
      {options === 'CUSTOM' && (
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            marginRight: 20,
            marginVertical: 10,
            justifyContent: 'space-around',
            // backgroundColor: 'pink',
          }}>
          <RadioController
            title={t('properties.community')}
            name="COMMUNITY"
            marginLeft={20}
            type={customType}
            setType={type => setCustomType(type)}
          />
          <RadioController
            title={t('properties.building')}
            name="BUILDING"
            marginLeft={10}
            type={customType}
            setType={type => setCustomType(type)}
          />
          <RadioController
            title={t('properties.unit')}
            name="UNIT"
            marginLeft={10}
            type={customType}
            setType={type => setCustomType(type)}
          />
        </View>
      )}
      {options === 'CUSTOM' && (
        <View style={{marginHorizontal: 20, marginBottom: 20}}>
          <AppDropDownController
            half={false}
            // disabled={lease}
            name={
              customType === 'COMMUNITY'
                ? 'community'
                : customType === 'UNIT'
                ? 'unit'
                : 'building'
            }
            placeholder={
              customType === 'COMMUNITY'
                ? t('properties.community')
                : customType === 'UNIT'
                ? t('properties.unit')
                : t('properties.building')
            }
            data={
              customType === 'COMMUNITY'
                ? communityQuery
                : customType === 'UNIT'
                ? unitQuery
                : buildingQuery
            }
            control={control}
            withHeader={false}
            noMargin
            // error={errors.duration?.id}
          />
        </View>
      )}
      <Searchbar
        style={{
          marginHorizontal: 20,
          shadowOpacity: 0,
          backgroundColor: '#eeeeee',
          borderRadius: 999,
        }}
        inputStyle={{
          fontSize: theme.subTitleFontSize,
        }}
        placeholder={t('newAnnouncement.searchPlaceholder')}
        onChangeText={e => setSearchQuery(e)}
      />
      <View style={styles.inviteContainer}>
        <AppText fontSize={theme.subTitleFontSize} Tcolor={theme.blackColor} textAlign="left">
          {t('newAnnouncement.inviteAllUsers')}
        </AppText>
        <Switch
          style={{transform: [{scaleX: 0.5}, {scaleY: 0.5}]}}
          trackColor={{false: '#767577', true: theme.primaryColor}}
          thumbColor={inviteToggle ? theme.whiteColor : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setInviteToggle(!inviteToggle)}
          value={inviteToggle}
        />
      </View>
      <View style={{flex: 1}}>
        {!inviteToggle && (
          <View style={{flex: 1}}>
            <FlatList
              data={searchQuery?.length ? filterZones : query.data}
              renderItem={({item, index}) => (
                <RenderItem
                  item={item}
                  index={index}
                  onPress={() => handleUsers(item)}
                />
              )}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 20,
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}>
        <AppButton
          title="Cancel"
          half
          onPress={() => navigation.goBack()}
          rounded={8}
          customMargin={0}
          Bcolor={theme.whiteColor}
          Tcolor={theme.primaryColor}
          style={{
            borderColor: theme.primaryColor,
            borderWidth: 1,
          }}
        />
        <AppButton
          title="Save"
          half
          onPress={() => {
            route.params.onSelect({ users, toggle: inviteToggle });
            navigation.goBack();
          }}
          customMargin={0}
          rounded={8}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
        />
      </View>
    </View>
  );
};

export default SelectUsers;

const RadioController = ({setType, type, name, marginLeft, title}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        setType(name);
      }}
      style={[styles.radioContainer, {marginLeft}]}>
      <View
        style={{
          borderRadius: 50,
          borderWidth: 1,
          borderColor: type === name ? theme.primaryColor : '#ddd',
          backgroundColor:
            type === name ? theme.primaryColor : theme.whiteColor,
          width: 15,
          height: 15,
          marginRight: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <AppText
        regular
        fontSize={theme.c1.size}
        fontWeight={theme.c1.fontWeight}
        Tcolor={theme.blackColor}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inviteContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioContainer: {
    width: '25%',
    flex: 1,
    height: 45,
    backgroundColor: theme.whiteColor,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  userContainer: {
    height: 80,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 15,
  },
  tickContainer: {
    borderRadius: 50,
    backgroundColor: theme.primaryColor,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '20%',
    right: '5%',
  },
});

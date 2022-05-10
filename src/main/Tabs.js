import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useAbility} from '@casl/react';
import DashboardStack from './dashboard/DashboardStack';
import PropertiesStack from './properties/PropertiesStack';
import Requests from './requests/Requests';
import AccountingStack from './accounting/AccountingStack';
import Contacts from './contacts/Contacts';
import {theme} from '../utils/design';
import {AbilityContext} from '../utils/Can';
import {
  BUILDINGS,
  CAR_CLEANING_REQUEST,
  COMMUNITIES,
  CONTACTS,
  DASHBOARD,
  HOME_CLEANING_REQUEST,
  MAINTENANCE_REQUEST,
  OTHER,
  PROPERTY,
  REQUESTS,
  TRANSACTIONS,
  UNITS,
  VISITOR_ACCESS_REQUEST,
} from '../utils/constants/PermissionSubject';
import {VIEW} from '../utils/constants/PermissionAction';
import {
  Admin,
  Maintenance,
  Management,
  Security,
  Tenant,
} from '../utils/constants/Role';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';
import {
  AccountingIcon,
  ContactsIcon,
  DashboardIcon,
  PropertiesIcon,
  RequestsIcon,
} from '../../assets/icons/TabsIcons';

const Tab = createMaterialBottomTabNavigator();
const Tabs = () => {
  const {t} = useTranslation();
  const ability = useAbility(AbilityContext);
  const role = useSelector(state => state.user.data.role);
  const navigation = useNavigation();

  const svgIcons = (color, size, focused) => ({
    dashboardTab: <DashboardIcon color={color} size={size} focused={focused} />,
    propertiesTab: (
      <PropertiesIcon color={color} size={size} focused={focused} />
    ),
    accountingTab: <RequestsIcon color={color} size={size} focused={focused} />,
    paymentsTab: <AccountingIcon color={color} size={size} focused={focused} />,
    requestsTab: <AccountingIcon color={color} size={size} focused={focused} />,
    contactsTab: <ContactsIcon color={color} size={size} focused={focused} />,
  });

  const showPolicies = async () => {
    let firstTime = await AsyncStorage.getItem('firstTime');

    if (firstTime !== 'true') {
      await AsyncStorage.setItem('firstTime', 'true');
      navigation.navigate('Policies', {
        firstTime: true,
        title: t('drawer.termsAndConditions'),
        url:
          'https://app.termly.io/document/terms-of-use-for-saas/420f723a-13d3-4a0e-8a96-dfffeea507f4',
      });
    }
  };

  useEffect(() => {
    showPolicies();
  }, []);

  const requestTabListener = ({navigation, route}) => ({
    tabPress: e => {
      e.preventDefault();
      navigation.navigate('requestsTab', {screen: 'ListRequests'});
    },
  });

  return (
    <Tab.Navigator
      initialRouteName="dashboardTab"
      labeled={true}
      shifting={false}
      sceneAnimationEnabled={false}
      activeColor={theme.primaryColor}
      inactiveColor={theme.primaryColor}
      barStyle={[
        {
          backgroundColor: '#F4FBF9',
        },
        role === Maintenance || role === Security
          ? {
              display: 'none',
            }
          : {},
      ]}
      activeTabStyle={{backgroundColor: '#d02a2a'}}
      screenOptions={({route}) => ({
        tabBarLabel: null,
        tabBarIcon: ({color, size, focused}) => {
          return (
            <View
              style={{
                flexDirection: 'column',
                width: 66,
                justifyContent: 'flex-start',
              }}>
              <View style={{alignItems: 'center'}}>
                {svgIcons(color, size, focused)[`${route.name}`]}
                <Text
                  style={{
                    color: focused ? theme.primaryColor : theme.greyColor,
                    fontSize: theme.c2.size - 1,
                    fontWeight: focused
                      ? theme.c2.fontWeight
                      : theme.c1.fontWeight,
                    ...Platform.select({
                      ios: { marginTop: 5 }
                    })
                  }}>
                  {t(route.name)}
                </Text>
              </View>
            </View>
          );
        },
      })}>
      {ability.can(VIEW, DASHBOARD) &&
      (role === Admin || role === Tenant) &&
      ability.can(VIEW, DASHBOARD) ? (
        <Tab.Screen name="dashboardTab" component={DashboardStack} />
      ) : null}
      {(ability.can(VIEW, PROPERTY) ||
        ability.can(VIEW, UNITS) ||
        ability.can(VIEW, BUILDINGS) ||
        ability.can(VIEW, COMMUNITIES)) &&
      (role === Management || role === Admin) ? (
        <Tab.Screen name="propertiesTab" component={PropertiesStack} />
      ) : null}
      {ability.can(VIEW, REQUESTS) ||
      ability.can(VIEW, MAINTENANCE_REQUEST) ||
      ability.can(VIEW, CAR_CLEANING_REQUEST) ||
      ability.can(VIEW, HOME_CLEANING_REQUEST) ||
      ability.can(VIEW, VISITOR_ACCESS_REQUEST) ||
      ability.can(VIEW, OTHER) ? (
        <Tab.Screen
          name="requestsTab"
          component={Requests}
          listeners={requestTabListener}
          options={{tabBarStyle: {display: 'none'}}}
        />
      ) : null}
      {ability.can(VIEW, TRANSACTIONS) &&
      (role === Management || role === Admin) ? (
        <Tab.Screen
          name={role == Tenant ? 'paymentsTab' : 'accountingTab'}
          component={AccountingStack}
        />
      ) : null}
      {ability.can(VIEW, CONTACTS) &&
      (role === Management || role === Admin) ? (
        <Tab.Screen name="contactsTab" component={Contacts} />
      ) : null}
    </Tab.Navigator>
  );
};

export default Tabs;

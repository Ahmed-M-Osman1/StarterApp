import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ContactTypes from './screens/ContactTypes';
import ContactsListByType from './screens/ContactsListByType';
import ContactCU from './screens/ContactCU';
import TransactionHistory from '../accounting/screens/TransactionHistory';
import TransactionOverview from '../accounting/screens/TransactionOverview';
import CreateProfessional from './screens/CreateProfessional';
import ViewProfessional from './screens/ViewProfessional';
import ViewTenent from './screens/ViewTenent';
import CreateManager from './screens/CreateManager';
import ViewManager from './screens/ViewManager';
import CreateTenant from './screens/CreateTenant';
import CreateOwner from './screens/CreateOwner';
import ViewOwner from './screens/ViewOwner';
import TenantRequestLists from './screens/TenantRequestLists';
import TenantComplaintLists from './screens/TenantComplaintLists';

const Stack = createStackNavigator();
const Contacts = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ContactTypes" component={ContactTypes} />
      <Stack.Screen name="ContactsList" component={ContactsListByType} />
      <Stack.Screen name="ContactCU" component={ContactCU} />
      <Stack.Screen name="CreateProfessional" component={CreateProfessional} />
      <Stack.Screen name="ViewProfessional" component={ViewProfessional} />
      <Stack.Screen name="CreateTenant" component={CreateTenant} />
      <Stack.Screen name="CreateOwner" component={CreateOwner} />
      <Stack.Screen name="ViewOwner" component={ViewOwner} />
      <Stack.Screen name="ViewTenent" component={ViewTenent} />
      <Stack.Screen name="CreateManager" component={CreateManager} />
      <Stack.Screen name="ViewManager" component={ViewManager} />
      <Stack.Screen name="TenantRequestList" component={TenantRequestLists} />
      <Stack.Screen name="TenantComplaintLists" component={TenantComplaintLists} />

      <Stack.Screen
        name="TransactionOverview"
        component={TransactionOverview}
      />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
    </Stack.Navigator>
  );
};

export default Contacts;

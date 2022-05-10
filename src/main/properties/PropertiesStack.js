import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PropertiesList from './screens/PropertiesList';
import BuildingsUnitsList from './screens/BuildingsUnitsList';
import UnitsList from './screens/UnitsList';
import NewProperty from './screens/NewProperty';
import EditForm from './screens/EditForm/EditForm';
import AssignTenant from './screens/EditForm/AssignTenant';
import AssignOwner from './screens/EditForm/AssignOwner';
import MoveOut from './screens/EditForm/MoveOut';
import EditLease from './screens/EditForm/EditLease';
import AssignCommunity from './screens/EditForm/AssignCommunity';
import AssignBuilding from './screens/EditForm/AssignBuilding';
import NewUnit from './screens/NewUnit';
import NewUnitForm from './screens/NewUnitForm';

const Stack = createStackNavigator();
const PropertiesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="PropertiesList" component={PropertiesList} />
      <Stack.Screen name="BuildingsUnitsList" component={BuildingsUnitsList} />
      <Stack.Screen name="UnitsList" component={UnitsList} />
      <Stack.Screen name="NewProperty" component={NewProperty} />
      <Stack.Screen name="EditForm" component={EditForm} />
      <Stack.Screen name="AssignTenant" component={AssignTenant} />
      <Stack.Screen name="AssignOwner" component={AssignOwner} />
      <Stack.Screen name="AssignCommunity" component={AssignCommunity} />
      <Stack.Screen name="AssignBuilding" component={AssignBuilding} />
      <Stack.Screen name="MoveOut" component={MoveOut} />
      <Stack.Screen name="EditLease" component={EditLease} />
      <Stack.Screen name="NewUnit" component={NewUnit} />
      <Stack.Screen name="NewUnitForm" component={NewUnitForm} />
    </Stack.Navigator>
  );
};

export default PropertiesStack;

import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from './Dashboard';
import CreateTransaction from '../accounting/screens/CreateTransaction';
import NewRequest from '../requests/screens/NewRequest';
import MaintenanceIssue from '../../main/requests/screens/MaintenanceIssue';
import AdditionalInfo from '../../main/requests/screens/AdditionalInfo';
import VisitorReq from '../../main/requests/screens/VisitorReq';
import ReqTimeDate from '../../main/requests/screens/ReqTimeDate';
import EventDetails from '../announcements/screens/EventDetails';
import ViewAllAnnouncements from '../announcements/screens/ViewAllAnnouncements';
import NewAnnouncement from '../announcements/screens/NewAnnouncement';
import SelectUsers from '../announcements/screens/SelectUsers';


const Stack = createStackNavigator();
const DashboardStack = () => {
  const [render, setRender] = useState(false);

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Dashboard"
        component={Dashboard}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CreateTransaction"
        component={CreateTransaction}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="NewRequest"
        component={NewRequest}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="MaintenanceIssue"
        component={MaintenanceIssue}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AdditionalInfo"
        component={AdditionalInfo}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="VisitorReq"
        component={VisitorReq}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="ReqTimeDate"
        component={ReqTimeDate}
        initialParams={{dashboard: true}}
      /> 
      <Stack.Screen
        options={{headerShown: false}}
        name="EventDetails"
        component={EventDetails}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AllAnnouncements"
        component={ViewAllAnnouncements}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="NewAnnouncement"
        component={NewAnnouncement}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SelectUsers"
        component={SelectUsers}
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;

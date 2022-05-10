import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ListRequests from './screens/ListRequests';
import NewRequest from './screens/NewRequest';
import MaintenanceIssue from './screens/MaintenanceIssue';
import AdditionalInfo from './screens/AdditionalInfo';
import VisitorReq from './screens/VisitorReq';
import ReqTimeDate from './screens/ReqTimeDate';
import AssignToReq from './screens/AssignToReq';
import ReqDetails from './screens/ReqDetails';
import Cam from './screens/Cam';
import ApproveRequest from './screens/ApproveRequest';
import StartRequest from './screens/StartRequest';
import VisitorRequestHistoryList from './screens/VisitorRequestHistoryList';

const Stack = createStackNavigator();
const Requests = ({navigation, route}) => {
  useEffect(() => {
    route.params?.goTo && navigation.navigate(route.params.goTo, route.params);
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="ListRequests"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ListRequests" component={ListRequests} />
      <Stack.Screen name="NewRequest" component={NewRequest} />
      <Stack.Screen name="MaintenanceIssue" component={MaintenanceIssue} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} />
      <Stack.Screen name="VisitorReq" component={VisitorReq} />
      <Stack.Screen name="ReqTimeDate" component={ReqTimeDate} />
      <Stack.Screen name="AssignToReq" component={AssignToReq} />
      <Stack.Screen name="ReqDetails" component={ReqDetails} />
      <Stack.Screen name="ApproveRequest" component={ApproveRequest} />
      <Stack.Screen name="StartRequest" component={StartRequest} />
      <Stack.Screen
        name="VisitorRequestHistoryList"
        component={VisitorRequestHistoryList}
      />
      <Stack.Screen name="Cam" component={Cam} />
    </Stack.Navigator>
  );
};

export default Requests;

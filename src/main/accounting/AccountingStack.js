import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateTransaction from './screens/CreateTransaction';
import PaymentCU from './screens/PaymentCU';
import Accounting from './screens/Accounting';
import TransactionOverview from './screens/TransactionOverview';
import TransactionHistory from './screens/TransactionHistory';

const Stack = createStackNavigator();
const AccountingStack = ({navigation, route}) => {
  useEffect(() => {
    route.params?.goTo && navigation.navigate(route.params.goTo, route.params);
  }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AccountingScreen" component={Accounting} />
      <Stack.Screen name="CreateTransaction" component={CreateTransaction} />
      <Stack.Screen name="PaymentCU" component={PaymentCU} />
      <Stack.Screen
        name="TransactionOverview"
        component={TransactionOverview}
      />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
    </Stack.Navigator>
  );
};

export default AccountingStack;

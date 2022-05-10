import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignIn from '../Screens/Auth/Managers/SignIn/SignIn'
import SignUp from '../Screens/Auth/Managers/SignUp/SignUp'
import RegistrationStatus from '../Screens/Auth/Managers/RegistrationStatus/RegistrationStatus'
import BottomTabs from './BottomNavigator'
import Dummy from '../Screens/Dummy/Dummy'
import CloudSignIn from '../Screens/Auth/AtarCloud/SignIn/CloudSignIn'
import CloudSignUp from '../Screens/Auth/AtarCloud/SignUp.js/CloudSignUp'
import CloudOTP from '../Screens/Auth/AtarCloud/CloudOTP/CloudOTP'
import CreateBussinessUsername from '../Screens/Auth/AtarCloud/CreateBussinessUsername.js/CreateBussinessUsername'
import WelcomeScreen from '../Screens/Auth/AtarCloud/WelcomeScreen/WelcomeScreen'
import AddProperty from '../Screens/Auth/AtarCloud/WelcomeScreen/AddProperty/AddProperty'
import UploadEJARFile from '../Screens/Auth/AtarCloud/WelcomeScreen/AddProperty/UploadEJARFile/UploadEJARFile'
import BulkUpload from '../Screens/Auth/AtarCloud/WelcomeScreen/AddProperty/BulkUpload/BulkUpload'
import ManualEntry from '../Screens/Auth/AtarCloud/WelcomeScreen/AddProperty/ManualEntry/ManualEntry'
import Uploading from '../Screens/Auth/AtarCloud/WelcomeScreen/AddProperty/Uploading/Uploading'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown : false
        }}>
          <Stack.Screen name='Dummy' component={Dummy}/>
          <Stack.Screen name='ManagerSignIn' component={SignIn}/>
          <Stack.Screen name='ManagerSignUp' component={SignUp}/>
          <Stack.Screen name='RegistrationStatus' component={RegistrationStatus}/>
          <Stack.Screen name='BottomTabs' component={BottomTabs}/>
          <Stack.Screen name='CloudSignIn' component={CloudSignIn}/>
          <Stack.Screen name='CloudSignUp' component={CloudSignUp}/>
          <Stack.Screen name='CloudOTP' component={CloudOTP}/>
          <Stack.Screen name='CreateBussinessUsername' component={CreateBussinessUsername}/>
          <Stack.Screen name='WelcomeScreen' component={WelcomeScreen}/>
          <Stack.Screen name='AddProperty' component={AddProperty}/>
          <Stack.Screen name='UploadEJARFile' component={UploadEJARFile}/>
          <Stack.Screen name='BulkUpload' component={BulkUpload}/>
          <Stack.Screen name='ManualEntry' component={ManualEntry}/>
          <Stack.Screen name='Uploading' component={Uploading}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator
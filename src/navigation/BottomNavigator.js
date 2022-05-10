import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import {Text, Image} from 'react-native'
import { IMAGES } from '../Common/images'
import Accounting from '../Screens/Accounting/Accounting'
import Contacts from '../Screens/Contacts/Contacts'
import Dashboard from '../Screens/Dashboard/Dashboard'
import Requests from '../Screens/Requests/Requests'
import styles from './BNStyles'
import PropertiesNavigator from './Properties'

const Tab = createBottomTabNavigator()

const BottomTabs = () => {
    return(
        <Tab.Navigator
            initialRouteName='Dashboard'
            screenOptions={{
                tabBarStyle : styles.tapStyles,
            }}>
            <Tab.Screen 
                name='Dashboard'
                component={Dashboard}
                options={{
                    headerShown : false,
                    tabBarLabel : ({focused, color, size}) => {
                        return(
                            <Text style={[styles.label, focused ? styles.activeLabel : null]}>Dashboard</Text>
                        )
                    },
                    tabBarIcon: ({focused, color, size}) => {
                    return focused ? (
                        <Image
                            source={IMAGES.activeDashborad}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    ) : (
                        <Image
                            source={IMAGES.dashboard}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    )
                    },
                }}/>
            <Tab.Screen 
                name='PropertiesNavigator'
                component={PropertiesNavigator}
                options={{
                    headerShown : false,
                    tabBarLabel : ({focused, color, size}) => {
                        return(
                            <Text style={[styles.label, focused ? styles.activeLabel : null]}>Properties</Text>
                        )
                    },
                    tabBarIcon: ({focused, color, size}) => {
                    return focused ? (
                        <Image
                            source={IMAGES.activeProperties}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    ) : (
                        <Image
                            source={IMAGES.properties}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    )
                    },
                }}/>
            <Tab.Screen 
                name='Requests'
                component={Requests}
                options={{
                    headerShown : false,
                    tabBarLabel : ({focused, color, size}) => {
                        return(
                            <Text style={[styles.label, focused ? styles.activeLabel : null]}>Requests</Text>
                        )
                    },
                    tabBarIcon: ({focused, color, size}) => {
                    return focused ? (
                        <Image
                            source={IMAGES.activeRequests}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    ) : (
                        <Image
                            source={IMAGES.requests}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    )
                    },
                }}/>
            <Tab.Screen 
                name='Accounting'
                component={Accounting}
                options={{
                    headerShown : false,
                    tabBarLabel : ({focused, color, size}) => {
                        return(
                            <Text style={[styles.label, focused ? styles.activeLabel : null]}>Accounting</Text>
                        )
                    },
                    tabBarIcon: ({focused, color, size}) => {
                    return focused ? (
                        <Image
                            source={IMAGES.activeAccounting}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    ) : (
                        <Image
                            source={IMAGES.accounting}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    )
                    },
                }}/>
            <Tab.Screen 
                name='Contacts'
                component={Contacts}
                options={{
                    headerShown : false,
                    tabBarLabel : ({focused, color, size}) => {
                        return(
                            <Text style={[styles.label, focused ? styles.activeLabel : null]}>Contacts</Text>
                        )
                    },
                    tabBarIcon: ({focused, color, size}) => {
                    return focused ? (
                        <Image
                            source={IMAGES.activeContacts}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    ) : (
                        <Image
                            source={IMAGES.contacts}
                            resizeMode='contain'
                            style={styles.img}
                        />
                    )
                    },
                }}/>
        </Tab.Navigator>
    )
}

export default BottomTabs
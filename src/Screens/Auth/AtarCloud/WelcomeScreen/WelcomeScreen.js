import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { IMAGES } from '../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../components/AtarCloudLogo'

const WelcomeScreen = (props) => {
    
  return (
    <SafeAreaView style={styles.main}>
        <AtarCloudLogo />
        <View style={styles.container}>
            <Image 
                source={IMAGES.welcome}
                resizeMode='contain'
                style={styles.logo} />
            <Text style={styles.welcome}>{'Welcome,Haseeb!'}</Text>
            <Text style={styles.setup}>{"Let's set up your account so you can start taking control of your\nproperties"}</Text>
            <TouchableOpacity 
                onPress={() => props.navigation.navigate('AddProperty')}
                style={styles.buttonContainer}>
                <Text style={styles.signText}>{"Let's Go!"}</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    main : {
        flex : 1,
        backgroundColor : '#fff',
    },
    container : {
        flex :1,
        justifyContent : 'center',
        alignItems : 'center',
        marginHorizontal : wp('5%')
    },
    logo : {
        height : hp('15%'),
        width : wp('29%')
    },
    welcome : {
        fontSize : 20,
        color : '#51b179',
        fontWeight : '800',
        marginTop : hp('5%'),
        marginBottom : hp('1.5%')
    },
    setup : {
        fontSize : 13,
        color : '#4a4a4a',
        fontWeight : '800',
        textAlign : 'center'
    },
    buttonContainer : {
        backgroundColor : '#4fab6f',
        marginTop : hp('5%'),
        alignItems : 'center',
        borderRadius : 8,
        width : wp('80%')
    },
    signText : {
        color : '#fff',
        fontSize : 16,
        fontWeight : '600',
        paddingVertical : hp('1.75%')
    },
    
})
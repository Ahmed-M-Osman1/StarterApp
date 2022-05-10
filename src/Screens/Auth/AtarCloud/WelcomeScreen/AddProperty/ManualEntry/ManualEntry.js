import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IMAGES } from '../../../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../../../Components/AtarCloudLogo'

const ManualEntry = (props) => {
    
  return (
    <SafeAreaView style={styles.main}>
        <AtarCloudLogo />
        <TouchableOpacity 
            onPress={() => props.navigation.goBack()}
            style={styles.logoContainer}>
            <Image 
            source={IMAGES.cloudBack}
            resizeMode='contain'
            style={styles.back} />
        </TouchableOpacity> 
        <View style={styles.greeting}>
            <Text style={styles.welcome}>{"Manual Entry"}</Text>
            <Text style={styles.signIn}>{'Please select your unit type'}</Text>
        </View>
        <TouchableOpacity style={styles.content}>
            <Image 
                source={IMAGES.office}
                resizeMode='contain'
                style={styles.office}/>
            <Text style={styles.text}>{'Commercial '}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.content}>
            <Image 
                source={IMAGES.build}
                resizeMode='contain'
                style={styles.office}/>
            <Text style={styles.text}>{'Residential'}</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ManualEntry

const styles = StyleSheet.create({
    main : {
        flex : 1,
        backgroundColor : '#fff',
    },
    logoContainer : {
        top : hp('3.5%'),
    },
    back : {
        height : hp('5%'),
        width : wp('9%'),  
        marginLeft : wp('2%')
    },
    greeting : {
        marginTop : hp('5%'),
        marginLeft : wp('5%'),
        marginBottom : hp('3.5%')
    },
    welcome : {
        color : '#000',
        fontSize : 21,
        fontWeight : 'bold'
    },
    signIn : {
        color : '#a0a0a0',
        fontSize : 13,
        fontWeight : '700',
        // marginTop : hp('0.5%'),
        lineHeight : hp('2.4%')
    },
    create : {
        textAlign : 'center',
        fontSize : 14,
        fontWeight : '600',
        marginTop : hp('2.5%')
    },
    content : {
        borderWidth : 2,
        borderColor : '#e2f1ea',
        borderRadius : 8,
        marginHorizontal : wp('20%'),
        marginTop : hp('4%'),
        alignItems : 'center',
        paddingVertical : hp('2.5%')
    },
    office : {
        height : hp('15%'),
        width : wp('30%')
    },
    text : {
        color : '#353535',
        fontSize : 16,
        fontWeight : '600',
        marginTop : hp('1.5%')
    }
})
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IMAGES } from '../../../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../../../Components/AtarCloudLogo'

const UploadEJARFile = (props) => {
    
  return (
    <SafeAreaView style={styles.main}>
        <View>
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
                <Text style={styles.welcome}>{"Upload your EJAR contract files"}</Text>
                <Text style={styles.signIn}>{'Login to '}<Text style={styles.link}>{'https://www.ejar.sa '}</Text>{'to download your contracts,\nthen upload your pdf files below.'}</Text>
            </View>
            <View  style={styles.border}>
                <Image 
                    source={IMAGES.cloud}
                    resizeMode='contain'
                    style={styles.cloud}/>
                <Text  style={styles.selectText}>{'File Size - Upto 10MB'}</Text>
                <TouchableOpacity style={styles.chooseContainer}>
                    <Text style={styles.chooseText}>{'Choose File'}</Text>
                </TouchableOpacity>
            </View>
        </View>
        <TouchableOpacity 
            style={styles.buttonContainer}>
            <Text style={styles.signText}>{'Continue And Review Uploads'}</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default UploadEJARFile

const styles = StyleSheet.create({
    main : {
        flex : 1,
        backgroundColor : '#fff',
        justifyContent : 'space-between'
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
        marginLeft : wp('5%')
    },
    welcome : {
        color : '#000',
        fontSize : 21,
        fontWeight : 'bold'
    },
    signIn : {
        color : '#adadad',
        fontSize : 14,
        fontWeight : '700',
        marginTop : hp('0.5%'),
        lineHeight : hp('2.5%')
    },
    link : {
        color : '#55bb8c'
    },
    border : {
        borderWidth : 2,
        borderColor : '#e7e7e7',
        borderStyle : 'dotted',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : hp('4.5%'),
        borderRadius : 10,
        marginHorizontal : wp('5%'),
        paddingVertical : hp('5%')
    },
    cloud : {
        height : hp('7.5%'),
        width : wp('15%')
    },
    selectText : {
        fontSize : 14,
        color : '#b8b8b8',
        fontWeight : '700',
        marginTop : hp('1%')
    },
    chooseContainer : {
        backgroundColor : '#edfdf7',
        borderRadius : 5,
        marginTop : hp('4%')
    },
    chooseText : {
        fontSize : 16,
        color : '#56be8e',
        fontWeight : '700',
        paddingVertical : hp('1%'),
        paddingHorizontal : wp('18%'),
        borderRadius : 10
    },
    buttonContainer : {
        backgroundColor : '#4fab6f',
        marginHorizontal : wp('5%'),
        marginTop : hp('5%'),
        alignItems : 'center',
        borderRadius : 8,
        marginBottom : hp('2.5%')
    },
    signText : {
        color : '#fff',
        fontSize : 16,
        fontWeight : '600',
        paddingVertical : hp('1.75%')
    },
    create : {
        textAlign : 'center',
        fontSize : 14,
        fontWeight : '600',
        marginTop : hp('2.5%')
    },
})
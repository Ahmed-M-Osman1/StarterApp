import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IMAGES } from '../../../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../../../Components/AtarCloudLogo'

const BulkUpload = (props) => {
    
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
                <Text style={styles.welcome}>{"Bulk Upload"}</Text>
                <Text style={styles.signIn}>{'1. Download the bulk upload Excel Template '}<Text style={styles.link}>{'Download'}</Text></Text>
                <Text style={styles.signIn}>{'2. Fill in the information. Please make sure that no changes are\n\t\tmade to the file structure and column headers in order to avoid\n\t\tupload issues'}</Text>
                <Text style={styles.signIn}>{'3. Upload your file for processing '}</Text>
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

export default BulkUpload

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
        color : '#202020',
        fontSize : 13,
        fontWeight : '700',
        // marginTop : hp('0.5%'),
        lineHeight : hp('2.4%')
    },
    link : {
        color : '#55bb8c',
        textDecorationLine : 'underline'
    },
    border : {
        borderWidth : 2,
        borderColor : '#e7e7e7',
        borderStyle : 'dotted',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : hp('2.5%'),
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
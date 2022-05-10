import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IMAGES } from '../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../components/AtarCloudLogo'

const CreateBussinessUsername = (props) => {
    const [state, setState] = useState('')
    const [valid, setvalid] = useState(null)

    const validateUserName = (username) => {
        let usernameRegex = /^[a-zA-Z0-9]+$/;
        return usernameRegex.test(username);
    }

    useEffect(() => {
        if (state === '') {
            setvalid(null)
        } else{
            setvalid(validateUserName(state))
        }

    }, [state])
    
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
                <Text style={styles.welcome}>{"Create Your Business Username"}</Text>
                <Text style={styles.signIn}>{'Your username will be the primary ID used to access your\naccount. if you are a company, it is best practice to use\nyour company name as a username.'}</Text>
            </View>
            <View style={[styles.inputContainer, valid === null ? null : valid ? styles.valid : styles.notValid]}>
            <TextInput 
                onChangeText={val => setState(val)}
                placeholder='E.g. AtarCloud'
                placeholderTextColor='#dddddd'
                style={styles.input}/>
                {valid !== null ?
                <Image 
                    source={valid === null ? null : valid ? IMAGES.correct : IMAGES.wrong}
                    resizeMode='contain'
                    style={styles.correct} /> :
                null}
            </View>
            <View style={styles.infoContainer}>
                <Image 
                    source={IMAGES.info}
                    resizeMode='contain'
                    style={styles.infoIcon}/>
                <Text style={[styles.signIn, styles.info]}>{'Username must be in English and have no spaces or special\ncharacters (-,/,$ ! etc.)'}</Text>
            </View>
        </View>

      <KeyboardAvoidingView  behavior='position'
      style={{marginBottom:80}}
      >
        <TouchableOpacity 
            disabled={!valid}
            onPress={() => props.navigation.navigate('WelcomeScreen')}
            style={[styles.buttonContainer, !valid ? styles.disabled : null]}>
            <Text style={styles.signText}>{'Next'}</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CreateBussinessUsername

const styles = StyleSheet.create({
    main : {
        flex : 1,
        backgroundColor : '#fff',
        justifyContent : 'space-between'
    },
    logoContainer : {
        top : hp('3%'),
    },
    back : {
        height : hp('5%'),
        width : wp('9%'),  
        marginLeft : wp('2%')
    },
    greeting : {
        marginTop : hp('4.5%'),
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
        marginTop : hp('0.5%')
    },
    inputContainer : {
        borderWidth : 2,
        borderColor : '#e8e8e8',
        borderRadius : 10,
        marginTop : hp('2.5%'),
        height : hp('5.5%'),
        marginHorizontal : wp('5%'),
        paddingLeft : wp('2.5%'),
        flexDirection : 'row',
        alignItems : 'center'
    },
    input : {
        width : wp('80%')
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
    info : {
        marginLeft : wp('2.5%'),
        fontSize : 12.4,
        
    },
    infoContainer : {
        flexDirection : 'row',
        marginHorizontal : wp('5%'),
        marginTop : hp('1.5%'),
        alignItems : 'flex-start'
    },
    infoIcon : {
        height : hp('3%'),
        width : wp('4%'),
    },
    disabled : {
        backgroundColor : '#c7c7c7'
    },
    correct : {
        height : hp('2.5'),
        width : wp('4.7%')
    },
    valid : {
        borderColor : '#53ae50'
    },
    notValid : {
        borderColor : '#ef4535'
    }

})
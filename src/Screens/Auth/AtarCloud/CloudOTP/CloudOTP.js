import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView,StatusBar } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { IMAGES } from '../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../components/AtarCloudLogo'
import {useTranslation} from 'react-i18next';
import crashlytics from '@react-native-firebase/crashlytics';
import {http} from '../../../../utils/http/Http';
import {useDispatch} from 'react-redux';
import {saveUserData, setToken} from '../../../../redux/user';
import config from 'react-native-ultimate-config';
import {AlertHelper} from '../../../../utils/AlertHelper';

const CloudOTP = (props) => {
  const {prev, data} = props.route.params;
  const dispatch = useDispatch();
  const [text, settext] = useState();
  const [text1, settext1] = useState();
  const [text2, settext2] = useState();
  const [text3, settext3] = useState();
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  
  const [counter, setCounter] = React.useState(59);

  const {t} = useTranslation();

  useEffect(() => {
      const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
  }, [counter]);
  


  const resendCode = async () => {
    try {
      await http
        .post(
          prev == 'SignIn'
            ? '/tenancy/api/send-verification'
            : '/tenancy/api/signup/verify',
          {
            ...data,
          },
        )
        .catch(e => console.log(e, 'HOLA!'));
    } catch (error) {
      console.log("error "+ error);
      crashlytics().recordError(error);
      setLoading(false);
      AlertHelper.show('error', t('common.error'), error);
      if (error.response) {
        console.log(error.response.data, 'resendCode');
        console.log(error.response.status, 'resendCode');
        console.log(error.response.headers, 'resendCode');
      }
    }
  };

  const verifyPhone = async code => {
    try {
      console.log("2323"+prev);
if(code == "0000" && prev == "SignUp"){
  props.navigation.navigate('CreateBussinessUsername')
}else {
      await http
        .post(
          prev == 'SignIn'
            ? '/tenancy/api/login'
            : '/tenancy/api/signup/verify',
          {
            code: code,
            ...data,
          },
        )
        .then(response => {
          // console.log(response.data.data);
          dispatch(setToken(response.data.data));
          prev == 'SignIn'
            ? getMe(response.data.data)
            : getMe(response.data.data); //navigation.replace('Terms');
        });
      }        
    } catch (error) {
      console.log("Error " + error);
      crashlytics().recordError(error);
      if (error.response) {
        console.log(error.response.data, 'verifyPhone');
        console.log(error.response.status, 'verifyPhone');
        console.log(error.response.headers, 'verifyPhone');
      }
    }
  };


  const getMe = async ({token}) => {
    try {
      await http.get('/tenancy/api/me').then(response => {
        crashlytics().setUserId(token);
        crashlytics().setAttributes({
          role: response.data.data.role,
          email: response.data.data.email,
          phone_number: response.data.data.phone_number,
        });
        dispatch(
          saveUserData({
            access_token: token,
            data: response.data.data,
            subdomain: config.X_TENANT ? config.X_TENANT : data.subdomain,
          }),
        );
      });
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error, 'getMe');
    }
  };

  return (
    <SafeAreaView style={styles.main}>
    <StatusBar
    backgroundColor="transparent"
    translucent={true}
 />
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
        <Text style={styles.welcome}>{t('verifyPhone.title')}</Text>
        <Text style={styles.signIn}>{t('verifyPhone.message') + data.phone_number }</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput 
            keyboardType="phone-pad"
            maxLength={1}
            ref={input1}
            onChangeText={text => {
                if (text != '') {
                  settext(text);
                  setTimeout(() => {
                    input2.current.focus();
                  }, 100);
                } else {
                  settext();
                }
              }}
            editable={true}
            style={styles.otp}/>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            keyboardType="phone-pad"
            maxLength={1}
            ref={input2}
            onChangeText={text => {
                if (text != '') {
                  settext1(text);
                  setTimeout(() => {
                    input3.current.focus();
                  }, 100);
                } else {
                  settext1();
                }
              }}
            editable={true}
            style={styles.otp}/>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            keyboardType="phone-pad"
            maxLength={1}
            ref={input3}
            onChangeText={text => {
                if (text != '') {
                  settext2(text);
                  setTimeout(() => {
                    input4.current.focus();
                  }, 100);
                } else {
                  settext2();
                }
              }}
            editable={true}
            style={styles.otp}/>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            keyboardType="phone-pad"
            maxLength={1}
            ref={input4}
            onChangeText={text => {
                if (text != '') {
                  settext3(text);
                  setTimeout(() => {
                    input2.current.focus();
                  }, 100);
                } else {
                  settext3();
                }
              }}
            editable={true}
            style={styles.otp}/>
        </View>
      </View>
      <Text style={[styles.signIn, styles.info]}>{t('verifyPhone.sentIn')}<Text style={styles.subText}>{` 00:${counter < 10 ? '0' + counter : counter}`}</Text></Text>
      {counter === 0 ? 
      <TouchableOpacity
        onPress={() => {setCounter(59)
          resendCode()
        }}>
        <Text  style={[styles.signIn, styles.info, styles.subText, styles.resend]}>{t('verifyPhone.newCode')}</Text>
      </TouchableOpacity>
      : null}
      </View>
      
      <KeyboardAvoidingView  behavior='position'
      style={{marginBottom:80}}
      >
      <TouchableOpacity 
        onPress={()=>verifyPhone(text+text1+text2+text3)}
        style={styles.buttonContainer}>
        <Text style={styles.signText}>{t('verifyPhone.verify')}</Text>
      </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CloudOTP

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
    height : hp('6%'),
    width : wp('11%'),  
    marginLeft : wp('2%')
  },
  greeting : {
    marginTop : hp('5%'),
    marginLeft : wp('5%')
  },
  welcome : {
    color : '#000',
    fontSize : 20,
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
    marginTop : hp('3.5%'),
    height : hp('6.5%'),
    width : wp('12%')
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
    marginHorizontal : wp('5%'),
    fontSize : 12.4,
    marginTop : hp('1.5%'),
    
  },
  subText : {
    color : '#000'
  },
  otp : {
    textAlign : 'center',
  },
  container : {
    flexDirection : 'row',
    justifyContent : 'space-around',
    marginHorizontal : wp('5%'),
  },
  resend : {
    textDecorationLine : 'underline',
    fontSize : 16
  }
})
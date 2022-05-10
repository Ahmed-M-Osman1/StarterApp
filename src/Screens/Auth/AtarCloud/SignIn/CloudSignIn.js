import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar} from 'react-native'
import React, { useState,useEffect } from 'react'
import { IMAGES } from '../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../components/AtarCloudLogo'
import PhoneInput from "react-native-phone-number-input";
import LangButton from '../../../../components/LangButton'
import {useForm} from 'react-hook-form';
import config from 'react-native-ultimate-config';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import crashlytics from '@react-native-firebase/crashlytics';
import AppButton from '../../../../components/AppButton'
import {useDispatch} from 'react-redux';
import {setCurrSubDomain} from '../../../../redux/user';
import {useFormik} from 'formik';
import {http} from '../../../../utils/http/Http';

const CloudSignIn = (props) => {
  const [formattedValue, setFormattedValue] = useState("");
  const dispatch = useDispatch();

  const phoneInput = React.useRef()
  useEffect(() => {
    crashlytics().log('Signin mounted');
  }, []);

  const {t} = useTranslation();

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = yup.object().shape({
    subdomain: yup.string().required(t('signUp.errorCompanyID')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
  });

  const onCountryCodeSelect = item => {
    formik.setFieldValue('phone_country_code', {
      id: item,
    },);
  };


  const formik = useFormik({
    initialValues: {
      subdomain: '',
      phone_number: "",
      phone_country_code: {
        id: 'SA',
      },
    },
    validationSchema,
    onSubmit: async values => {
      dispatch(setCurrSubDomain(values.subdomain));
      try {
        console.log("hirr");
        await http.post('/tenancy/api/send-verification', values).then(response => {
          console.log("<<<<<<" + response.data);
          props.navigation.navigate('CloudOTP', {
            prev: 'SignIn',
            data: {
              ...values,
              vid: response.data.data.vid,
            },
          });
        });
      } catch (error) {
        console.log("errrorrrror "+error);
        crashlytics().recordError(error);
        if (error.response) {
          console.log(error.response.data, 'signIn');
          console.log(error.response.status, 'signIn');
        }
      }
    },
  });

  return (
    <View style={styles.main}>
    <StatusBar
   backgroundColor="transparent"
   translucent={true}
/>
    <AtarCloudLogo />
    <LangButton />
      <View style={styles.logoContainer}>
        <Image 
          source={IMAGES.atarLogo}
          resizeMode='contain'
          style={styles.logo} />
      </View> 
      <View style={styles.greeting}>
        <Text style={styles.welcome}>{t('signIn.welcome')}<Text style={styles.cloud}>{t('signIn.appName')}</Text></Text>
        <Text style={styles.signIn}>{t('signIn.hello')}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder={t('signUp.subdomain')}
          placeholderTextColor='#dddddd'
          style={styles.usernameInput}
          value={formik.values.subdomain}
          onChangeText={formik.handleChange('subdomain')}
          error={formik.errors.subdomain}
          />
      </View>
      <PhoneInput
      ref={phoneInput}
      defaultCode="SA"
      //layout="second"
      value={formik.values.phone_number}
      onChangeText={formik.handleChange('phone_number')}
      onChangeCountry={val => {onCountryCodeSelect(val.cca2)
        setFormattedValue(val.cca2)
      }}
      containerStyle={styles.phoneContainer}
      textContainerStyle={styles.textContainer}
      placeholder={t('signUp.mobile')}
      textInputProps={{placeholderTextColor: '#dddddd'}}
      codeTextStyle={{color: '#7a7a7a'}}
      countryPickerButtonStyle={styles.countryPicker}
      renderDropdownImage={<Image source={IMAGES.phoneDown} resizeMode='contain' style={styles.down}/>}
      error={formik.errors.phone_number}
    />
      <TouchableOpacity 
      onPress={formik.handleSubmit}
        style={styles.buttonContainer}>
        <Text style={styles.signText}>{t('signIn.signIn')}</Text>
      </TouchableOpacity>
      <Text style={styles.create}>{t('signIn.signUpText')}<Text onPress={() => props.navigation.navigate('SignUp')} style={styles.up}>{t('signIn.signUp')}</Text></Text>
    </View>
  )
}

export default CloudSignIn

const styles = StyleSheet.create({
  main : {
    flex : 1,
    backgroundColor : '#fff'
  },
  logoContainer : {
    top : hp('6.5%'),
    marginLeft : wp('5%')
  },
  logo : {
    height : hp('6%'),
    width : wp('32%'),
  },
  greeting : {
    marginTop : hp('14%'),
    marginLeft : wp('5%')
  },
  welcome : {
    color : '#000',
    fontSize : 22,
    fontWeight : 'bold'
  },
  cloud : {
    color : '#4fad73'
  },
  signIn : {
    color : '#adadad',
    fontSize : 13,
    fontWeight : '700',
    marginTop : hp('0.5%')
  },
  inputContainer : {
    borderWidth : 2,
    borderColor : '#f6f8f7',
    marginHorizontal : wp('5%'),
    borderRadius : 8,
    marginTop : hp('4.5%'),
    height : hp('5.5%'),
    paddingLeft : wp('2.5%')
  },
  phoneContainer : {
    marginTop: hp('2.5%'),
    marginHorizontal : wp('5%'),
    overflow: 'hidden',
    backgroundColor : '#fff',
    height : hp('7%'),
    width : wp('90%')
  },
  textContainer : {
      backgroundColor: '#fff',
      paddingVertical: hp('0.5%'),
      // marginVertical: hp('0%'),
      borderRadius: 8,
      borderWidth : 1,
      borderColor : '#f6f8f7',
      flexGrow : 1
  },
  countryPicker : {
      backgroundColor:'#fff',
      borderRadius: 8,
      marginRight: wp('2.5%'),
      borderWidth : 1,
      borderColor : '#f6f8f7',
  },
  down : {
      height : hp('4%'),
      width : wp('8%'),
  },
  buttonContainer : {
    backgroundColor : '#4fab6f',
    marginHorizontal : wp('5%'),
    marginTop : hp('3.5%'),
    alignItems : 'center',
    borderRadius : 8,
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
  up : {
    color : '#58be92',
    fontWeight : '600',
  },
  usernameInput : {
    height : hp('6%'),
  }
})
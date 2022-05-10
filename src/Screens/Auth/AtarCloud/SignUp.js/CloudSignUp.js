import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { IMAGES } from '../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../components/AtarCloudLogo'
import PhoneInput from "react-native-phone-number-input";
import { http } from '../../../../utils/http/Http';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios'

const CloudSignUp = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();


  const [formattedValue, setFormattedValue] = useState("");
  const [isLoading, setLoading] = useState(false);


  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    // email: yup.string().email().required(t('signUp.errorEmail')),
    subdomain: yup.string().required(t('signUp.errorCompanyID')),
    company_name: yup.string().required(t('signUp.errorCompanyName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone_number: '',
      phone_country_code: 'SA',
    },
    onSubmit: async values => {
      const sendData = {
        phone_number: values.phone_number,
        phone_country_code: values.phone_country_code,
      }
      console.log(sendData);

      try {
        await axios.post('https://a3g3suie.hectare.app/tenancy/api/signup/send-verification', sendData)
          .then(response => {
            console.log("+>"+JSON.stringify(response.data));
            navigation.navigate('VerifyPhone', {
              prev: 'SignUp',
              data: {
                ...data,
                vid: response.data.data.vid,
              },
            });
          });
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }
      props.navigation.navigate('CloudOTP', {
        prev: 'SignUp',
        data: {
          ...values,
          vid: values.company_name
        },
      });
    }
  })


  const signUp = async data => {
    dispatch(setCurrSubDomain(data.subdomain));
    setLoading(true);
    try {
      console.log("hhh");
      await http
        .post('/tenancy/api/signup/send-verification', data)
        .then(response => {
          setLoading(false);
          navigation.navigate('VerifyPhone', {
            prev: 'SignUp',
            data: {
              ...data,
              vid: response.data.data.vid,
            },
          });
        });
    } catch (error) {
      crashlytics().recordError(error);
      setLoading(false);
      if (error.response) {
        AlertHelper.show('error', t('common.error'), error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };


  return (
    <View style={styles.main}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
      />
      <AtarCloudLogo />
      <View style={styles.logoContainer}>
        <Image
          source={IMAGES.atarLogo}
          resizeMode='contain'
          style={styles.logo} />
      </View>
      <View style={styles.greeting}>
        <Text style={styles.welcome}>{t('signUp.hello')}</Text>
        <Text style={styles.signIn}>{t('signUp.welcome')}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          placeholder={t('signUp.name')}
          placeholderTextColor='#dddddd'
          style={styles.usernameInput} />
      </View>
      <PhoneInput
        defaultCode="SA"
        //layout="second"
        value={formik.values.phone_number}
        onChangeText={formik.handleChange('phone_number')}
        onChangeCountry={val => {
          formik.handleChange('phone_country_code')
          setFormattedValue(val.cca2)
        }}
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textContainer}
        placeholder={t('signUp.mobile')}
        textInputProps={{ placeholderTextColor: '#dddddd' }}
        codeTextStyle={{ color: '#7a7a7a' }}
        countryPickerButtonStyle={styles.countryPicker}
        renderDropdownImage={<Image source={IMAGES.phoneDown} resizeMode='contain' style={styles.down} />}
      />
      <View style={[styles.inputContainer, styles.subInput]}>
        <TextInput

          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          placeholder={t('signUp.email')} placeholderTextColor='#dddddd'
          keyboardType='email-address'
          style={styles.usernameInput} />
      </View>
      <Text style={[styles.signIn, styles.info]}>{t('signUp.byContinuing')}<Text style={styles.subText}>{t('signUp.TermsOfServices')}</Text>{t('signUp.and')}<Text style={styles.subText}>{t('signUp.PrivacyPolicy')}</Text></Text>
      <TouchableOpacity
        onPress={formik.handleSubmit}
        style={styles.buttonContainer}>
        <Text style={styles.signText}>{t('signUp.title')}</Text>
      </TouchableOpacity>
      <Text style={styles.create}>{t('signUp.haveAccount')}<Text onPress={() => props.navigation.navigate('CloudSignIn')} style={styles.up}>{t('signIn.SignIn')}</Text></Text>
    </View>
  )
}

export default CloudSignUp

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },
  logoContainer: {
    top: hp('6.5%'),
    marginLeft: wp('5%')
  },
  logo: {
    height: hp('6%'),
    width: wp('32%'),
  },
  greeting: {
    marginTop: hp('14%'),
    marginLeft: wp('5%')
  },
  welcome: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold'
  },
  signIn: {
    color: '#adadad',
    fontSize: 13,
    fontWeight: '700',
    marginTop: hp('0.5%'),
    textAlign: 'center'
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#f6f8f7',
    marginHorizontal: wp('5%'),
    borderRadius: 8,
    marginTop: hp('4.5%'),
    height: hp('5.5%'),
    paddingLeft: wp('2.5%')
  },
  phoneContainer: {
    marginTop: hp('2.5%'),
    marginHorizontal: wp('5%'),
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: hp('7%'),
    width: wp('90%')
  },
  textContainer: {
    backgroundColor: '#fff',
    paddingVertical: hp('0.5%'),
    // marginVertical: hp('0%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f6f8f7',
    flexGrow: 1
  },
  countryPicker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#f6f8f7',
  },
  down: {
    height: hp('4%'),
    width: wp('8%'),
  },
  buttonContainer: {
    backgroundColor: '#4fab6f',
    marginHorizontal: wp('5%'),
    marginTop: hp('5%'),
    alignItems: 'center',
    borderRadius: 8
  },
  signText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: hp('1.75%')
  },
  create: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: hp('2.5%')
  },
  up: {
    color: '#58be92',
    fontWeight: '600',
  },
  subInput: {
    marginTop: hp('1.5%')
  },
  info: {
    marginHorizontal: wp('5%'),
    fontSize: 12.4,
    marginTop: hp('1.5%')
  },
  subText: {
    color: '#000'
  },
  usernameInput: {
    height: hp('5.5%'),
    marginTop: hp('0%'),
    marginHorizontal: wp('0.5%'),
    paddingVertical: hp('0.5%'),
  }
})
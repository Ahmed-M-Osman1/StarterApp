import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import styles from './styles'
import PhoneInput from "react-native-phone-number-input";
import { IMAGES } from '../../../../Common/images'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Input from '../../../../Components/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignIn = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef();

  return (
    <SafeAreaView
      style={styles.mainView}>
      
      <LinearGradient colors={['#56bb7f', '#4ba17a']} style={{flex : 1}}>
      <KeyboardAwareScrollView>
      <View style={styles.header}>
        <Image 
          source={IMAGES.signUp}
          resizeMode='contain'
          style={styles.signUp}/>
        <View style={styles.subHeader}>
          <Text style={styles.welcome}>{'Hi there!'}</Text>
          <Text style={styles.logIN}>{"Let's Get Started"}</Text>
        </View>
      </View>
      <Input 
        img={IMAGES.userName}
        placeholder='Name*'
        backgroundColor='#50af7d'/>
      <PhoneInput
        defaultCode="SA"
        layout="second"
        value={phoneNumber}
        onChangeText={val => setPhoneNumber(val)}
          onChangeFormattedText={text => {
            setFormattedValue(text);
          }}
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textContainer}
        placeholder={'Mobile Number*'}
        textInputProps={{placeholderTextColor: '#fff'}}
        codeTextStyle={{color: '#fff'}}
        countryPickerButtonStyle={styles.countryPicker}
        renderDropdownImage={<Image source={IMAGES.down} resizeMode='contain' style={styles.down}/>}
      />
      <Input 
        img={IMAGES.email}
        placeholder='Email'
        backgroundColor='#4eab79'/>
      <Input 
        img={IMAGES.companyname}
        placeholder='Company Name*'
        backgroundColor='#4ca876'/>
      <View style={[styles.inputContainer, styles.subInput]}>
        <Image 
          source={IMAGES.companyID}
          resizeMode='contain'
          style={styles.companyID}/>
        <TextInput 
          placeholder='Company ID'
          placeholderTextColor='#c0e4d4'
          style={[styles.input, styles.companyName]}/>
        <View style={styles.domain}>
          <Text style={styles.domainText}>{'.AtarCloud.com'}</Text>
        </View>
      </View>
      <Text style={styles.text}>By continuing, You accept the<Text style={styles.subText}> Terms of conditions</Text> and <Text style={styles.subText}>Privacy Policy</Text></Text>
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('RegistrationStatus', {fail : false})}
          style={styles.footerButton}>
          <Text style={styles.footerText}>{'Continue'}</Text>
        </TouchableOpacity>
        <Text style={[styles.text, styles.lastText]}>{'Already have an account?'}<Text onPress={() => props.navigation.navigate('ManagerSignIn')} style={[styles.subText, styles.lastText]}>{' Login'}</Text></Text>
        </KeyboardAwareScrollView>
      </LinearGradient>
      
    </SafeAreaView>
  )
}

export default SignIn
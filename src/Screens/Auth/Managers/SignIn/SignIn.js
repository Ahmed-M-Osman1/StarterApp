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
          <Text style={styles.welcome}>{'Welcome Back!'}</Text>
          <Text style={styles.logIN}>{'Please, Log In'}</Text>
        </View>
      </View>
      <Input 
        img={IMAGES.companyID}
        placeholder='Company ID'
        backgroundColor='#50b287'/>
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
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('RegistrationStatus', {fail : true})}
          style={styles.footerButton}>
          <Text style={styles.footerText}>{'Continue'}</Text>
        </TouchableOpacity>
        <View style={styles.subHeader}>
          <Text style={styles.or}>{'OR'}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('ManagerSignUp')}
          style={styles.footerButton}>
          <Text style={styles.footerText}>{'Create an account'}</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default SignIn
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { IMAGES } from '../../../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AtarCloudLogo from '../../../../../Components/AtarCloudLogo'

const AddProperty = (props) => {

  return (
    <View style={styles.main}>
        <View>
            <AtarCloudLogo />
            <View style={styles.logoContainer}>
                <Image 
                source={IMAGES.atarLogo}
                resizeMode='contain'
                style={styles.logo} />
            </View> 
            <View style={styles.greeting}>
                <Text style={styles.welcome}>{"Start by adding your properties"}</Text>
            </View>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('UploadEJARFile')} 
                style={styles.inputContainer}>
                <Image 
                    source={IMAGES.ejar}
                    resizeMode='contain'
                    style={styles.icon} />
                <View>
                    <Text style={styles.upload}>{'Upload EJAR contracts'}</Text>
                    <Text style={styles.info}>{'Upload all your EJAR contracts and leave the rest to us.'}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('BulkUpload')} 
                style={styles.inputContainer}>
                <Image 
                    source={IMAGES.excel}
                    resizeMode='contain'
                    style={styles.icon} />
                <View>
                    <Text style={styles.upload}>{'Excel Upload'}</Text>
                    <Text style={styles.info}>{'For this service please use our web app.'}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('ManualEntry')} 
                style={styles.inputContainer}>
                <Image 
                    source={IMAGES.manual}
                    resizeMode='contain'
                    style={styles.icon} />
                <View>
                    <Text style={styles.upload}>{'Manual Entry'}</Text>
                    <Text style={styles.info}>{'Add a single property manually.'}</Text>
                </View>
            </TouchableOpacity>
        </View>
      <View>
        <TouchableOpacity>
          <Text style={styles.do}>{'Do it later'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.buttonContainer}>
            <Text style={styles.signText}>{'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddProperty

const styles = StyleSheet.create({
  main : {
    flex : 1,
    backgroundColor : '#fff',
    justifyContent : 'space-between'
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
    marginTop : hp('12%'),
    marginLeft : wp('5%')
  },
  welcome : {
    color : '#000',
    fontSize : 22,
    fontWeight : 'bold'
  },
  inputContainer : {
    borderWidth : 2,
    borderColor : '#f6f8f7',
    marginHorizontal : wp('5%'),
    borderRadius : 8,
    marginTop : hp('2.5%'),
    height : hp('7.5%'),
    flexDirection : 'row',
    alignItems : 'center',
    paddingLeft : wp('2.5%')
  },
  icon : {
    height : hp('3%'),
    width : wp('12%'),
    marginRight : wp('2.5%')
  },
  upload : {
    fontSize : 18,
    color : '#53b683',
    fontWeight : '600'
  },
  info : {
    fontSize : 11,
    color : '#9a9a9a',
    fontWeight : '500'
  },
  buttonContainer : {
    backgroundColor : '#4fab6f',
    marginHorizontal : wp('5%'),
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
  do : {
      textAlign : 'center',
      marginBottom : hp('2.5%'),
      fontSize : 14,
      fontWeight : '600',
      color : '#55bc8f'
  }
})
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import styles from './styles'
import { IMAGES } from '../../../../Common/images'

const RegistrationStatus = (props) => {
  const {fail} = props.route.params
  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('ManagerSignIn')}>
          <Text style={styles.logout}>{'Logout'}</Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('BottomTabs')}
          style={styles.logoContainer}>
            <Image 
              source={IMAGES.atarLogo}
              resizeMode='contain'
              style={styles.logo}/>
        </TouchableOpacity>
        <View style={styles.content}>
          <Image 
            source={fail ? IMAGES.decline :  IMAGES.pending}
            resizeMode='contain'
            style={styles.pending}/>
          <Text style={styles.statusText}>{'Your Registration Status'}</Text>
          <Text style={{textAlign : 'center'}}>
            {fail ?
          <Text style={styles.declineInfo}>
            {'Due to a high volume of signup requests, your AtarCloud account \ncannot be approved at this time. Please contact us at '}
            <Text style={styles.email}>{'\ninfo@goatar.com'}</Text> 
            <Text>{'for further information'}</Text></Text> :
          <Text style={styles.info}>{'Thank you for signing up to AtarCloud. Your account is currently under review by the AtarCloud team. You will be notified by \nemail and SMS with further instructions.'}</Text> }
          </Text>
          
        </View>
    </View>
  )
}

export default RegistrationStatus
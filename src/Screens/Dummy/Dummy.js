import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Dummy = (props) => {
  return (
    <View
        style={{flex : 1, backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('ManagerSignIn')}
          style={{borderWidth : 1, alignItems : 'center', width : 200, marginBottom : 10}}>
          <Text style={{fontSize : 20, paddingVertical : 10}}>{'Atar Managers'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('CloudSignIn')}
          style={{borderWidth : 1, alignItems : 'center', width : 200}}>
          <Text style={{fontSize : 20, paddingVertical : 10}}>{'Atar Cloud'}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Dummy
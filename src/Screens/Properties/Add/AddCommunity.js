import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, TextInput } from 'react-native'
import React from 'react'
import { IMAGES } from '../../../Common/images'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const AddCommunity = (props) => {
    const Input = (props) => {
        return(
            <View>
                
            </View>
        )
    }
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}>
              <Image
                source={IMAGES.back}
                resizeMode='contain'
                style={styles.headerIcon}/>
          </TouchableOpacity>
          <Text style={styles.title}>{'Community Information'}</Text>
          <View />
      </View>
      <View style={styles.content}>
        <View>
        <Text style={styles.label}>{'Name*'}</Text>
        <View style={styles.container}>
            <TextInput 
                placeholder='Community Name'
                placeholderTextColor='#3d4f58'
                style={styles.input}/>
        </View>
        <Text style={styles.label}>{'City*'}</Text>
        <TouchableOpacity style={[styles.container, styles.select]}>
            <Text>{'Select City'}</Text>
            <Image 
                source={IMAGES.drop}
                resizeMode='contain'
                style={styles.drop} />
        </TouchableOpacity>
        <Text style={styles.label}>{'Distract*'}</Text>
        <TouchableOpacity style={[styles.container, styles.select]}>
            <Text>{'Select Distract'}</Text>
            <Image 
                source={IMAGES.drop}
                resizeMode='contain'
                style={styles.drop} />
        </TouchableOpacity>
        <Text style={styles.label}>{'Upload Photo'}</Text>
        <View style={styles.border}>
            <Image 
                source={IMAGES.addImage}
                resizeMode='contain'
                style={styles.addImage} />
            <Text style={styles.selectText}>{'Select a photo from your gallery'}</Text>
            <TouchableOpacity style={styles.chooseContainer}>
                <Text style={styles.chooseText}>{'Choose File'}</Text>
            </TouchableOpacity>
        </View>
        </View>
        <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.save}>{'Save'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default AddCommunity

const styles = StyleSheet.create({
    main : {
        flex : 1,
        backgroundColor : '#fff'
    },
    header : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        marginHorizontal : wp('5%'),
        marginTop : hp('3.5%')
    },
    headerIcon : {
        height : wp('8%'),
        width : wp('8%')
    },
    title : {
        fontSize : 18,
        fontWeight : 'bold',
        color : '#222222',
        letterSpacing : 0.5
    },
    content : {
        marginHorizontal : wp('5%'),
        justifyContent : 'space-between',
        flexGrow : 1
    },
    label : {
        marginTop : hp('2.5%'),
        fontSize : 14,
        fontWeight : '600',
        color : '#b8b6b6',
        letterSpacing : 0.5
    },
    container : {
        borderColor : '#edf6f1',
        borderWidth : 2,
        borderRadius : 5,
        marginTop : hp('1%'),
        height : hp('5%')
    },
    input : {
        paddingLeft : wp('5%')
    },
    select : {
        justifyContent : 'space-between',
        paddingLeft : wp('5%'),
        paddingRight : wp('2.5%'),
        alignItems : 'center',
        flexDirection : 'row',
        
    },
    drop : {
        height : wp('6%'),
        width : wp('6%')
    },
    border : {
        borderWidth : 2,
        borderColor : '#edf6f1',
        borderRadius : 1,
        borderStyle : 'dotted',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : hp('1%'),
        borderRadius : 10
    },
    addImage : {
        height : wp('15%'),
        width : wp('15%'),
        marginTop : hp('4%'),
        // marginBottom :hp('1%')
    },
    selectText : {
        fontSize : 14,
        color : '#b8b8b8',
        fontWeight : '700',
        marginBottom : hp('2.5%')
    },
    chooseContainer : {
        backgroundColor : '#edfdf7',
        borderRadius : 5,
        marginBottom : hp('2.5%')
    },
    chooseText : {
        fontSize : 16,
        color : '#56be8e',
        fontWeight : '700',
        paddingVertical : hp('1%'),
        paddingHorizontal : wp('18%'),
        borderRadius : 10
    },
    footerButton : {
        backgroundColor : '#4fab6f',
        borderRadius : 10,
        marginBottom : hp('1.5%')
    },
    save : {
        color : '#fff',
        fontWeight : '700',
        fontSize : 16,
        textAlign : 'center',
        paddingVertical : hp('1.5%')
    }
})
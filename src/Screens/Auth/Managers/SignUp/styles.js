import { StyleSheet } from "react-native";
import { COLORS } from "../../../../Common/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    mainView : {
        flex : 1, 
    },
    header : {
        marginTop : hp('2.5%'),
        alignItems : 'center'
    },
    signUp : {
        height : hp('25%'),
        width : wp('55%'),
    },
    subHeader : {
        marginTop : hp('1%')
    },
    welcome : {
        fontSize : 16,
        fontWeight : '600',
        color : COLORS.singInWelcome,
        textAlign : 'center'
    },
    logIN : {
        color : '#ffffff',
        fontSize : 22,
        fontWeight : 'bold'
    },
    inputContainer : {
        flexDirection : 'row',
        borderWidth : 2,
        borderColor : '#70c4a1',
        marginHorizontal : wp('10%'),
        backgroundColor : '#4da977',
        marginTop : hp('1.5%'),
        borderRadius : 15,
        alignItems : 'center',
        paddingLeft : wp('2.5%'),
        overflow : 'hidden'
    },
    companyID : {
        height : hp('2.5%'),
        width : wp('5%'),
    },
    input : {
        fontSize : 14,
        fontWeight : 'bold',
        width : wp('70%'),
        paddingLeft : wp('2.5%')
    },
    phoneContainer : {
        marginTop: hp('2.5%'),
        marginHorizontal : wp('10%'),
        overflow: 'hidden',
        backgroundColor : '#50ae7c',
    },
    textContainer : {
        backgroundColor: '#51b387',
        paddingVertical: hp('0.5%'),
        marginVertical: hp('0%'),
        borderRadius: 15,
        borderWidth : 1,
        borderColor : '#70c4a1',
    },
    countryPicker : {
        backgroundColor:'#51b387',
        borderRadius: 15,
        marginRight: wp('2.5%'),
        borderWidth : 1,
        borderColor : '#70c4a1',
    },
    down : {
        height : hp('4%'),
        width : wp('8%'),
    },
    footer : {
    },
    footerButton : {
        backgroundColor : '#56bb7f',
        borderRadius : 30,
        marginHorizontal : wp('10%'),
        alignItems : 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    footerText : {
        color : '#fff',
        fontSize : 20,
        paddingVertical : hp('1.5%')
    },
    or : {
        color : '#fff',
        fontWeight : '600',
        textAlign : 'center',
        fontSize : 16
    },
    company : {
        flexDirection : 'row'
    },
    subInput : {
        backgroundColor : '#4dac82'
    },
    companyName : {
        width : wp('40%'),
    },
    domain : {
        borderLeftWidth : 1,
        borderColor : '#6dbd9a',
        backgroundColor : '#5bb58e'
    },
    domainText : {
        color : '#fff',
        paddingVertical : hp('1.7%'),
        paddingHorizontal : wp('4.4%'),
        fontSize : 14
    },
    text : {
        fontSize : 12,
        color : '#a6d5c0',
        textAlign : 'center',
        marginHorizontal : wp('12.5%'),
        marginVertical : hp('1.5%'),
    },
    subText : {
        fontSize : 13, 
        fontWeight : '600',
        color : '#fff'
    },
    lastText : {
        fontSize : 16
    }

})

export default styles
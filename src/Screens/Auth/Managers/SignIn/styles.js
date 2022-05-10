import { StyleSheet } from "react-native";
import { COLORS } from "../../../../Common/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    mainView : {
        flex : 1, 
    },
    header : {
        marginTop : hp('12.5%'),
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
    phoneContainer : {
        marginTop: hp('2.5%'),
        marginHorizontal : wp('10%'),
        overflow: 'hidden',
        backgroundColor : '#4faa7c',
    },
    textContainer : {
        backgroundColor: '#51b387',
        paddingVertical: hp('0.5%'),
        marginVertical: hp('0%'),
        borderRadius: 15,
    },
    countryPicker : {
        backgroundColor:'#51b387',
        borderRadius: 15,
        marginRight: wp('2.5%'),
    },
    down : {
        height : hp('4%'),
        width : wp('8%'),
    },
    footer : {
        marginTop : hp('5%')
    },
    footerButton : {
        backgroundColor : '#56bb7f',
        borderRadius : 30,
        marginHorizontal : wp('10%'),
        marginTop : hp('1.5%'),
        marginBottom : hp('1%'),
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
    }
})

export default styles
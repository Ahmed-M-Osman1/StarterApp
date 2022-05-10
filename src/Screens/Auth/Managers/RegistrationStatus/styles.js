import {StyleSheet} from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const styles = StyleSheet.create({
    main : {
        flex : 1,
        backgroundColor : '#fff'
    },
    header : {
        marginLeft : wp('80%'),
        marginTop : hp('2.5%')
    },
    logout : {
        fontSize : 16,
        fontWeight : '700',
        color : '#4fab6f'
    },
    logoContainer : {
        alignItems : 'center'
    },
    logo : {
        height : hp('10%'),
        width : wp('45%'),
        marginVertical : hp('5%')
    },
    content : {
        alignItems : 'center',
        marginTop : hp('2.5%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal : wp('5%'),
        backgroundColor : '#fff',
        paddingVertical : hp('5%'),
        paddingHorizontal : wp('2.5%'),
        borderRadius : 15
    },
    pending : {
        height : hp('15%'),
        width : wp('45%'),
    },
    statusText : {
        fontSize : 18,
        fontWeight : '700',
        marginTop : hp('2.5%'),
        color : '#4fab6f'
    },
    info : {
        textAlign : 'center',
        fontSize : 12,
        fontWeight : '500',
    },
    declineInfo : {
        textAlign : 'center',
        fontSize : 11,
        fontWeight : '500',        
    },
    email : {
        color : '#4fad72'
    }
})

export default styles
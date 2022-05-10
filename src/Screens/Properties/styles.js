import {StyleSheet} from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

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
    img : {
        height : wp('3.5%'),
        width : wp('3.5%')
    },
    headerText : {
        fontSize : 18,
        fontWeight : 'bold',
    },
    searchContainer : {
        marginHorizontal : wp('5%'),
        backgroundColor : '#f5f5f5',
        borderRadius : 30,
        flexDirection : 'row',
        marginTop : hp('3.5%'),
        alignItems : 'center',
        paddingLeft : wp('3.5%')
    },
    search : {
        height : wp('3.5%'),
        width : wp('3.5%')
    },
    input : {
        fontSize : 16, 
        color : '#818b91',
        width : wp('80%'),
        paddingLeft : wp('2.5%'),
        fontWeight : '600',
    },
    tabContainer : {
        flexDirection : 'row',
        backgroundColor : '#4fab6f',
        marginHorizontal : wp('5%'),
        borderRadius : 30,
        justifyContent : 'space-between',
        paddingHorizontal : wp('2.5%'),
        paddingVertical : hp('1%'),
        marginTop : hp('2.5%')
    },
    activeTab : {
        backgroundColor : '#fff',
        borderRadius : 30,
        width : wp('25%'),
        justifyContent : 'center'
    },
    tab : {
        width : wp('25%'),
        justifyContent : 'center'
    },
    tabText : {
        fontSize : 16,
        fontWeight : '500',
        color : '#fff',
        paddingVertical : hp('1%'),
        textAlign : 'center'
    },
    activeText : {
        color : '#4fab6f'
    },
    details : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        marginHorizontal : wp('5%'),
        marginTop : hp('2.5%'),
        marginBottom : hp('1%')
    },
    no : {
        color : '#b7b7b7',
        fontSize : 13,
        fontWeight : '600'
    },
    sortContainer : {
        flexDirection : 'row',
        backgroundColor : '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems : 'center',
        justifyContent : 'space-between',
        width : wp('25%'),
        paddingHorizontal : wp('2.5%'),
        borderRadius : 15
    },
    sort : {
        height : wp('4%'),
        width : wp('4%')
    },
    sortText : {
        color : '#747474',
        fontSize : 14,
        paddingVertical : hp('1%'),
        fontWeight : '700'
    },
    drop : {
        height : wp('3'),
        width : wp('3%'),
    },
    plusContainer : {
        backgroundColor : '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        width : wp('12.5%'),
        height : wp('12.5%'),
        borderRadius : 50,
        marginVertical : hp('0.5%'),
        marginHorizontal : wp('43.75%')
    },
    plus : {
        height : wp('12.5%'),
        width : wp('12.5%'),
    },
    list : {
        marginBottom : hp('1%')

    }
})

export default styles
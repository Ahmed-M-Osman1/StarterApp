import React, { Fragment } from 'react';
import { ImageBackground, View } from 'react-native';
import placeholder from '../../../../assets/images/images/event_placeholder.png';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import { HP, theme } from '../../../utils/design';

const EventCard = ({navigation}) => {
    return (
        <>
            <View style={{ height: 'auto', borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <ImageBackground source={placeholder} style={{ height: 'auto', }} imageStyle={{ opacity: 0.4 }}>
                    <View style={{ margin: 20 }}>
                        <AppText fontWeight={'700'} Tcolor={theme.blackColor} textAlign="left" fontSize={theme.superTitleFontSize-4}>
                            Don't miss any event
                        </AppText>
                        <AppText Tcolor={theme.greyColor} textAlign="left" fontSize={theme.subTitleFontSize}>
                            We have lots of events for you
                        </AppText>
                        <WhiteSpace variant={1} />
                        <AppButton
                            title="View Other Events"
                            onPress={() => navigation.navigate('AllAnnouncements')}
                            Bcolor={theme.primaryColor}
                            Tcolor={theme.whiteColor}
                            half
                            fontSize={theme.subTitleFontSize}
                            customWidth={130}
                            height={45}
                            customMargin={10}
                            customHeight={HP(4)}
                            rounded={8}
                        />
                    </View>
                </ImageBackground>
            </View>
        </>
    )
}

export default EventCard;
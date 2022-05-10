import React from 'react';
import {View, Text} from 'react-native';
import {VictoryArea} from 'victory-native';
import AppText from '../../../components/AppText';
import {CardWithShadow} from '../../../components/CardWithShadow';
import {theme} from '../../../utils/design';
import {useTranslation} from 'react-i18next';
import formatNumbers from '../../../utils/formatNumbers';

const EarningCard = ({data = [], wallet}) => {
  const {t} = useTranslation();
  console.log(wallet);
  return (
    <CardWithShadow>
      <View style={{justifyContent: 'center', flexDirection: 'row'}}>
        <View style={{flex: 3}}>
          <AppText
            regular
            // style={{marginTop: 10, fontFamily: null, fontWeight: '500'}}
            textAlign={'left'}
            Tcolor={theme.greyColor}
            fontSize={theme.p2.size}>
            {t('requests.totalEarning')}
          </AppText>
          <View style={{height: 15}} />
          <AppText
            regular
            // style={{marginTop: 10, fontFamily: null, fontWeight: '500'}}
            textAlign={'left'}
            Tcolor={theme.blackColor}
            fontSize={theme.h6.size}
            fontWeight={theme.h6.fontWeight}>
            {t('dashboard.sar')} {formatNumbers(wallet?.balanceOwed ?? 0)}
          </AppText>
          <View style={{height: 5}} />
          <AppText
            regular
            // style={{marginTop: 10, fontFamily: null, fontWeight: '500'}}
            textAlign={'left'}
            Tcolor={theme.greyColor}
            fontSize={theme.p2.size}>
            Last update today at 8 AM
          </AppText>
        </View>
        <View style={{flex: 2}}>
          <VictoryArea
            width={170}
            height={70}
            animate={{
              duration: 1000,
              onLoad: {duration: 1000},
            }}
            padding={{top: 0, bottom: 0, right: 40}}
            interpolation="natural"
            data={data}
            style={{
              data: {
                fill: theme.primaryColor,
                fillOpacity: 0.2,
                stroke: theme.primaryColor,
                strokeWidth: 3,
              },
              labels: {
                fontSize: 15,
                fill: theme.primaryColor,
              },
            }}
          />
        </View>
      </View>
    </CardWithShadow>
  );
};

export default EarningCard;

import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native-animatable';
import AppFlatList from '../../../components/AppFlatList';
import AppText from '../../../components/AppText';
import TripleField from '../../../components/TripleField';
import {theme, WP} from '../../../utils/design';

const TransactionsTable = ({data, headers, fields, binary}) => {
  const pieColors = ['#21a96e', '#5BDEA5', '#22AA6F', '#14CD7C', '#22AEA5'];

  const Item = ({item, index}) => {
    return (
      <TripleField
        border={1}
        Child1={() => (
          <View style={styles.container}>
            <View
              style={[
                styles.circleShape,
                {
                  backgroundColor:
                    pieColors[index < pieColors.length ? index : 1],
                  // binary
                  //   ? Math.floor(item[fields[2]].replace(/,/g, '')) > 0
                  //     ? myColors[2]
                  //     : myColors[4]
                  //   : myColors[index],
                },
              ]}
            />
            <AppText
              Tcolor={theme.greyColor}
              fontSize={theme.subTitleFontSize}
              textAlign={'left'}>
              {item[fields[0]]}
            </AppText>
          </View>
        )}
        Child2={() => (
          <View
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <AppText
              Tcolor={theme.greyColor}
              fontSize={theme.subTitleFontSize}
              textAlign={'left'}>
              {item[fields[1]]}
            </AppText>
          </View>
        )}
        Child3={() => (
          <AppText
            Tcolor={theme.greyColor}
            fontSize={theme.subTitleFontSize}
            textAlign={'left'}>
            {!isNaN(item[fields[2]])
              ? Math.round(item[fields[2]] * 100) / 100
              : item[fields[2]]}
          </AppText>
        )}
      />
    );
  };

  return (
    <>
      <TripleField
        Child1={() => (
          <AppText
            Tcolor={theme.blackColor}
            fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {headers[0]}
          </AppText>
        )}
        Child2={() => (
          <AppText
            Tcolor={theme.blackColor}
            fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {headers[1]}
          </AppText>
        )}
        Child3={() => (
          <AppText
            Tcolor={theme.blackColor}
            fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {headers[2]}
          </AppText>
        )}
      />
      {data?.length > 0 ? <AppFlatList data={data} renderItem={Item} /> : <></>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  circleShape: {
    height: 14,
    width: 14,
    borderRadius: 7,
    marginLeft: WP(5),
  },
});

export default TransactionsTable;

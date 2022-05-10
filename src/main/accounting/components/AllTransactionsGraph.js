import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Svg from 'react-native-svg';
import {
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
} from 'victory-native';
import NoData from '../../../components/NoData';
import {theme} from '../../../utils/design';

const AllTransactionsGraph = ({data = [], height, width, onPress, period}) => {
  // clean the data before anything else
  const cleanData = data?.map(item => ({
    ...item,
    amount: parseInt(item.amount, 10),
    title: item.month ?? item.quarter ?? `${item.year}`,
  }));

  const ChartClick = Platform.select({
    ios: TouchableOpacity,
    android: Svg,
  });

  return (
    <View style={[styles.container]}>
      {!!cleanData.length ? (
        <ChartClick>
          <VictoryChart
            padding={{top: 0, bottom: 30, right: 10, left: 10}}
            margin={0}
            height={height}
            width={width}>
            <VictoryBar
              style={{data: {fill: `${theme.primaryColor}50`}}}
              data={cleanData}
              x="title"
              y="amount"
              alignment="middle"
              barRatio={1}
              animate={{
                duration: 2000,
                onLoad: {duration: 1000},
              }}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          eventKey: 'all',
                          target: 'data',
                          mutation: () => {
                            return {style: {fill: `${theme.primaryColor}50`}};
                          },
                        },
                        {
                          target: 'data',
                          mutation: props => {
                            onPress(props.datum);
                            return {style: {fill: `${theme.primaryColor}`}};
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
            <VictoryAxis
              // the color of the bar
              // tickValues={xLabels}
              style={{axis: {stroke: '#ffffff00'}}}
              tickFormat={t => (period === 'MONTH' ? t.slice(0, 3) : t)}
              tickLabelComponent={<VictoryLabel style={{fontSize: 12}} />}
            />
          </VictoryChart>
        </ChartClick>
      ) : (
        <NoData width={100} height={100} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AllTransactionsGraph;

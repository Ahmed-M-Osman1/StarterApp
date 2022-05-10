import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Svg from 'react-native-svg';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryStack,
} from 'victory-native';
import NoData from '../../../components/NoData';
import {theme} from '../../../utils/design';

const MoneyTransactionsGraph = ({
  data = [],
  height,
  width,
  onPress,
  period,
}) => {
  const titles = {MONTH: 'month_name', QUARTER: 'quarter', YEAR: 'year'};

  const cleanData = data.map(item => ({
    ...item,
    outstanding: Math.abs(parseInt(item.outstanding)),
    overdue: Math.abs(parseInt(item.overdue)),
    paid: Math.abs(parseInt(item.paid)),
  }));

  const xLabels = cleanData?.map(item => '' + item[titles[period]]);

  const paids = cleanData.map(item => ({
    title: '' + item[titles[period]],
    amount: item.paid,
  }));
  const overdues = cleanData.map(item => ({
    title: '' + item[titles[period]],
    amount: item.overdue,
  }));
  const outstandings = cleanData.map(item => ({
    title: '' + item[titles[period]],
    amount: item.outstanding,
  }));

  const ChartClick = Platform.select({
    ios: TouchableOpacity,
    android: Svg,
  });

  return (
    <View style={styles.container}>
      {!!cleanData.length ? (
        <ChartClick>
          <VictoryChart
            padding={{top: 0, bottom: 30, right: 10, left: 10}}
            height={height}
            width={width}>
            {/* <VictoryAxis
            tickValues={xLabels}
            tickFormat={xLabels}
            style={{axis: {stroke: '#ffffff00'}}}
          /> */}
            {/* <VictoryAxis dependentAxis tickFormat={x => `$${x / 1000}k`} /> */}
            <VictoryStack
              events={[
                {
                  childName: 'all',
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          eventKey: 'all',
                          childName: 'paids',
                          target: 'data',
                          mutation: () => {
                            return {style: {fill: `${theme.primaryColor}50`}};
                          },
                        },
                        {
                          eventKey: 'all',
                          childName: 'outstandings',
                          target: 'data',
                          mutation: () => {
                            return {style: {fill: `${theme.orange}50`}};
                          },
                        },
                        {
                          eventKey: 'all',
                          childName: 'overdues',
                          target: 'data',
                          mutation: () => {
                            return {style: {fill: `${theme.red}50`}};
                          },
                        },
                        {
                          childName: 'paids',
                          target: 'data',
                          mutation: props => {
                            onPress(cleanData[props.datum._group]);
                            return {style: {fill: `${theme.primaryColor}`}};
                          },
                        },
                        {
                          childName: 'outstandings',
                          target: 'data',
                          mutation: props => {
                            onPress(cleanData[props.datum._group]);
                            return {style: {fill: `${theme.orange}`}};
                          },
                        },
                        {
                          childName: 'overdues',
                          target: 'data',
                          mutation: props => {
                            onPress(cleanData[props.datum._group]);
                            return {style: {fill: `${theme.red}`}};
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
              //
            >
              <VictoryBar
                name="paids"
                style={{data: {fill: `${theme.primaryColor}50`}}}
                data={paids}
                alignment="middle"
                barRatio={1}
                animate={{
                  duration: 2000,
                  onLoad: {duration: 1000},
                }}
                x="title"
                y={'amount'}
              />
              <VictoryBar
                style={{data: {fill: `${theme.orange}50`}}}
                name="outstandings"
                data={outstandings}
                alignment="middle"
                barRatio={1}
                animate={{
                  duration: 2000,
                  onLoad: {duration: 1000},
                }}
                // events={[
                //   {
                //     target: 'data',
                //     eventHandlers: {
                //       onPressIn: () => {
                //         return [
                //           {
                //             eventKey: 'all',
                //             target: 'data',
                //             mutation: () => {
                //               return {style: {fill: `${theme.orange}50`}};
                //             },
                //           },
                //           {
                //             target: 'data',
                //             mutation: props => {
                //               onPress(cleanData[props.datum._group]);
                //               const fill = props.style && props.style.fill;
                //               return {style: {fill: `${theme.orange}`}};
                //             },
                //           },
                //         ];
                //       },
                //     },
                //   },
                // ]}
                x="title"
                y={'amount'}
              />
              <VictoryBar
                style={{data: {fill: `${theme.red}50`}}}
                name="overdues"
                data={overdues}
                alignment="middle"
                barRatio={1}
                animate={{
                  duration: 2000,
                  onLoad: {duration: 1000},
                }}
                // events={[
                //   {
                //     target: 'data',
                //     eventHandlers: {
                //       onPressIn: () => {
                //         return [
                //           {
                //             eventKey: 'all',
                //             target: 'data',
                //             mutation: () => {
                //               return {style: {fill: `${theme.red}50`}};
                //             },
                //           },
                //           {
                //             target: 'data',
                //             mutation: props => {
                //               onPress(cleanData[props.datum._group]);
                //               const fill = props.style && props.style.fill;
                //               return {style: {fill: `${theme.red}`}};
                //             },
                //           },
                //         ];
                //       },
                //     },
                //   },
                // ]}
                x="title"
                y={'amount'}
              />
            </VictoryStack>
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
        // <VictoryChart
        //   padding={{left: 50, right: 50}}
        //   height={height}
        //   width={width}>
        //   <VictoryBar
        //     style={{data: {fill: `${theme.primaryColor}50`}}}
        //     data={cleanData}
        //     x="month"
        //     y="amount"
        //     alignment="middle"
        //     barRatio={1}
        //     animate={{
        //       duration: 2000,
        //       onLoad: {duration: 1000},
        //     }}
        //     events={[
        //       {
        //         target: 'data',
        //         eventHandlers: {
        //           onPressIn: () => {
        //             return [
        //               {
        //                 eventKey: 'all',
        //                 target: 'data',
        //                 mutation: () => {
        //                   return {style: {fill: `${theme.primaryColor}50`}};
        //                 },
        //               },
        //               {
        //                 target: 'data',
        //                 mutation: props => {
        //                   onPress(props.datum);
        //                   const fill = props.style && props.style.fill;
        //                   return {style: {fill: `${theme.primaryColor}`}};
        //                 },
        //               },
        //             ];
        //           },
        //         },
        //       },
        //     ]}
        //   />
        //   <VictoryAxis
        //     // the color of the bar
        //     style={{axis: {stroke: '#ffffff00'}}}
        //     tickLabelComponent={
        //       <VictoryLabel
        //         style={{fontSize: 14}}
        //         // angle={-90}
        //       />
        //     }
        //   />
        // </VictoryChart>
        <NoData width={100} height={100} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default MoneyTransactionsGraph;

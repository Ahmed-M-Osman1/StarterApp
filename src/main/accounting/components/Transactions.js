import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import AppText from '../../../components/AppText';
import NoData from '../../../components/NoData';
import TransactionItem from './TransactionItem';
import {HP, theme, WP} from '../../../utils/design';

const Transactions = ({
  filteredData,
  showBottomLoader,
  headerComponent,
  currentPage,
  setCurrentPage,
  pages,
}) => {
  const {i18n, t} = useTranslation();

  const monthNames = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthNamesAr = [
    '',
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  return (
    <>
      <View style={styles.infoContainer}>
        <View style={{margin: 10}}>
          <AppText
            fontSize={theme.titleFontSize}
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {t('accounting.history')}
          </AppText>
        </View>
        <AppText
          fontSize={theme.subTitleFontSize}
          Tcolor={theme.greyColor}
          textAlign={'left'}
          regular
          style={{marginLeft: 20}}>
          {`${t('accounting.today')}: ${cDay} ${
            i18n.language == 'en' ? monthNames[cMonth] : monthNamesAr[cMonth]
          } ${cYear}`}
        </AppText>

        <FlatList
          keyExtractor={(item, idx) => item.id.toString() + idx.toString()}
          data={filteredData}
          renderItem={({item, index}) => {
            return filteredData.length > 0 ? (
              <TransactionItem key={index.toString()} item={item} />
            ) : (
              <NoData />
            );
          }}
          onEndReached={() =>
            pages > currentPage && setCurrentPage(currentPage + 1)
          }
          ListHeaderComponent={headerComponent}
          ListFooterComponent={() => {
            return (
              showBottomLoader && (
                <View style={{marginVertical: 20}}>
                  <ActivityIndicator color={theme.tertiaryColor} />
                </View>
              )
            );
          }}
        />
      </View>
    </>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  pieContainer: {
    flex: 3,
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: theme.whiteColor,
    marginHorizontal: 20,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 17,
    shadowColor: theme.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  searchContainer: {
    flex: 1,
    // backgroundColor: 'pink',
    alignContent: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 3,
    // backgroundColor: 'red',
  },
  summaryOuterContainer: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  summaryCol: {
    width: '50%',
  },
  summaryItem: {
    flexDirection: 'row',
  },
  summaryItemColorContainer: {
    marginEnd: WP(3),
  },
  summaryItemContainer: {
    marginVertical: HP(0.75),
  },
});

import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import IconTextCard from '../components/IconTextCard';
import {theme} from '../../../utils/design';
import {RequestType} from '../../../utils/constants/RequestType';
import {useQuery} from 'react-query';
import {mngmtHttp} from '../../../utils/http/Http';

const icons = {
  1: require('../../../../assets/images/images/maintenance-01.png'),
  2: require('../../../../assets/images/images/housecleaning-01.png'),
  3: require('../../../../assets/images/images/carcleaning-01.png'),
  4: require('../../../../assets/images/images/visitoraccess-01.png'),
  5: require('../../../../assets/images/images/atariconsnew-03.png'),
};
const colors = {
  1: '#E9FBFF',
  2: '#FDFBEB',
  3: '#FEF7F0',
  4: '#F3F9FF',
  5: '#F6F6FF',
};
const NewRequest = ({navigation}) => {
  const {t} = useTranslation();

  const listOfAvailableRequestCategories = useQuery(
    'listOfAvailableRequestCategories',
    () =>
      mngmtHttp
        .get(`/request-category`)
        .then(resp => resp.data)
        .catch(e => console.log(e)),
  );

  return (
    <View style={styles.container}>
      <Header name={t('newRequest.title')} navigation={navigation} />
      <WhiteSpace variant={1} />
      <AppText fontSize={theme.titleFontSize} Tcolor={theme.primaryColor}>
        {t('newRequest.message')}
      </AppText>
      <WhiteSpace variant={1.9} />
      <FlatList
        data={listOfAvailableRequestCategories?.data?.data
          .filter(c => !!c.active_service)
          .filter(c => c.name !== 'Complaint')}
        renderItem={({item, index}) => (
          <IconTextCard
            prev={'NewRequest'}
            navigation={navigation}
            item={item}
            image={icons[item.code > 5 ? 5 : item.code]}
            backgroundColor={colors[item.code > 5 ? 5 : item.code]}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{
          marginHorizontal: '2.5%',
        }}
        keyExtractor={(item, index) => item.name.toString()}
      />
      <WhiteSpace variant={1} />
    </View>
  );
};

export default NewRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  btnContainer: {
    // flex: 1,
    justifyContent: 'flex-start',
  },
});

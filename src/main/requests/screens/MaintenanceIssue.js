import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import IconTextCard from '../components/IconTextCard';
import {IssueType} from '../../../utils/constants/IssueType';
import {theme} from '../../../utils/design';
import {useQuery} from 'react-query';
import {mngmtHttp} from '../../../utils/http/Http';

const icons = {
  1: require('../../../../assets/images/images/plumbing-01.png'),
  2: require('../../../../assets/images/images/electrical-01.png'),
  3: require('../../../../assets/images/images/AC-01.png'),
  4: require('../../../../assets/images/images/CARPETNARY.png'),
  5: require('../../../../assets/images/images/appliances-01.png'),
  6: require('../../../../assets/images/images/furniture.png'),
  7: require('../../../../assets/images/images/atariconsnew-03.png'),
};
const colors = {
  1: '#E9FBFF',
  2: '#FDFBEB',
  3: '#FEF7F0',
  4: '#F3F9FF',
  5: '#F6F6FF',
  6: '#E9FBFF',
  7: '#FDFBEB',
};

const MaintenanceIssue = ({navigation}) => {
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
        {t('maintenance.message')}
      </AppText>
      <WhiteSpace variant={1} />
      <FlatList
        data={listOfAvailableRequestCategories?.data?.data
          .find(c => c.code === 1)
          .subCategories.filter(c => !!c.active_service)}
        renderItem={({item, index}) => (
          <IconTextCard
            prev={'MaintenanceIssue'}
            navigation={navigation}
            item={item}
            image={icons[item.code > 7 ? 7 : item.code]}
            backgroundColor={colors[item.code > 7 ? 7 : item.code]}
          />
        )}
        columnWrapperStyle={{
          marginHorizontal: '2.5%',
        }}
        numColumns={2}
        keyExtractor={item => item.name}
      />
      {/* <View style={styles.btnContainer}>
          <AppButton
            title={t('newRequest.btn')}
            Bcolor={'#7C7C7C'}
            Tcolor={theme.whiteColor}
            rounded={8}
            onPress={() => {
              // navigation.navigate('CreateTransaction', {type: 'in'});
            }}
          />
          <WhiteSpace variant={1} />
        </View> */}
    </View>
  );
};

export default MaintenanceIssue;

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

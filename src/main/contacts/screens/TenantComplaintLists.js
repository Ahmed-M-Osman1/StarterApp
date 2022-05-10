import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { theme } from '../../../utils/design';
import { mngmtHttp } from '../../../utils/http/Http';
import Header from '../../../components/Header';
import AppTextInput from '../../../components/AppTextInput';
import { CardWithShadow } from '../../../components/CardWithShadow';
import { RequestStatusAsArray } from '../../../utils/constants/RequestStatus';
import AppText from '../../../components/AppText';
import NoData from '../../../components/NoData';

const TenantComplaintLists = ({navigation, route}) => {
    const {t} = useTranslation();
    const {type, item} = route.params;
    const query = useQuery('Tenant-complaints', () =>
      mngmtHttp
        .get(`/contacts/${item?.id}/all-details?role=CUSTOMER`)
        .then(response => response.data)
        .catch(e => console.log(e)),
    );
    useEffect(() => {
      navigation.addListener('focus', () => {
        // Screen was focused
        query.refetch();
      });
    }, []);

    const ComplaintCardItem = ({t, item, type}) => {
        return (
          <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} activeOpacity={0.8}>
            <CardWithShadow>
              <View
                style={{
                  justifyContent: 'flex-start',
                  width: 310
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppText
                    fontSize={theme.c2.size}
                    fontWeight={theme.c2.fontWeight}
                    regular
                    Tcolor={theme.blackColor}
                    textAlign={'left'}>
                    {`${t('Service Related')}`}
                  </AppText>
                  <View
                    style={{
                      backgroundColor:
                        item?.status === 1
                          ? `${theme.red}20`
                          : item?.status === 2
                          ? `${theme.orange}20`
                          : `${theme.primaryColor}20`,
                      width: 60,
                      height: 20,
                      borderRadius: 4,
                      justifyContent: 'center',
                      // transform: [{scale: 0.8}],
                    }}>
                    <AppText
                      fontSize={10}
                      fontWeight={theme.c1.fontWeight}
                      regular
                      Tcolor={
                        item?.status === 1
                          ? `${theme.red}`
                          : item?.status === 2
                          ? `${theme.orange}`
                          : `${theme.primaryColor}`
                      }
                      textAlign={'center'}>
                      {RequestStatusAsArray[item?.status - 1]}
                    </AppText>
                  </View>
                </View>
      
                <AppText
                  fontSize={theme.c1.size}
                  fontWeight={theme.c1.fontWeight}
                  regular
                  Tcolor={theme.greyColor}
                  textAlign={'left'}>
                  {item?.date ?? ''}
                </AppText>
      
                <View style={{height: 10}} />
      
                <AppText
                  fontSize={theme.c1.size}
                  fontWeight={theme.c1.fontWeight}
                  regular
                  numberOfLines={2}
                  Tcolor={theme.greyColor}
                  textAlign={'left'}>
                  {item?.description ?? ''}
                </AppText>
              </View>
              <View style={{height: 15}} />
              <View
                style={{
                  height: 30,
                  borderColor: theme.primaryColor,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme.whiteColor,
                  borderRadius: 6,
                }}>
                <AppText
                  regular
                  fontSize={theme.p2.size}
                  fontWeight={theme.p2.fontWeight}
                  Tcolor={theme.primaryColor}
                  textAlign={'center'}>
                  {t('ViewTenant.viewDetails')}
                </AppText>
              </View>
            </CardWithShadow>
          </TouchableOpacity>
        );
      };
  
    return(
        <View style={styles.container}>
            <Header
                name={t('ViewTenant.complaints.All Complaints')}
                navigation={navigation}
                tabs={false}
            />
            <View style={{height: 20}} />
             <View>
                <AppTextInput
                    placeholder={t('contacts.searchPlaceholder')}
                    placeholderTextColor={'#7c7c7c'}
                    backgroundColor={'#F5F5F5'}
                    style={{
                        height: 45,
                        borderColor: '#E9EDF1',
                        borderRadius: 150,
                        // marginHorizontal: 20,
                    }} // borderColor={'red'}
                    leftIcon={'search'}
                    leftIconColor="#2A3D47"
                    disabledTitle={1}
                    onChangeText={() => {}}
                    onSubmitEditing={() => {}}
                />
            </View>
            <View style={{height: 20}} />
            <FlatList
                data={query?.data?.data?.complains ?? []}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => <View style={{height: 15}} />}
                ItemSeparatorComponent={() => <View style={{height: 15}} />}
                renderItem={({item, index}) => (
                <ComplaintCardItem
                    key={item?.id}
                    t={t}
                    item={item}
                    type={type}
                />
                )}
                keyExtractor={item => item?.id}
                ListEmptyComponent={
                <View
                    style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: Dimensions.get('window').width,
                    }}>
                    <NoData />
                </View>
                }
                ListFooterComponent={() => (
                <View style={{width:  20 }} />
                )}
            />
        </View>
    )
}

export default TenantComplaintLists;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.whiteColor,
    },
  });
  
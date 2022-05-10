import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';
import {useQuery} from 'react-query';
import AppText from '../../../components/AppText';
import Header from '../../../components/Header';
import NoData from '../../../components/NoData';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import {RequestTypeAsArray} from '../../../utils/constants/RequestType';
import RenderActionButtonsAndStatus, {
    StatusBadge,
  } from '../../requests/components/RenderActionButtonsAndStatus';
import {IssueTypeAsArray} from '../../../utils/constants/IssueType';
import { CardWithShadow } from '../../../components/CardWithShadow';
import AppTextInput from '../../../components/AppTextInput';
import { AlertHelper } from '../../../utils/AlertHelper';
import CancelRequestModel from '../../requests/components/CancelRequestModal';

const TenantRequestLists = ({navigation, route}) => {
  const {t} = useTranslation();
  const {item, type} = route.params;
  const query = useQuery('contact-details', () =>
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

  const cardImgPlaceHolder = [
    {
      img: require('../../../../assets/images/requests/1.png'),
      color: '#E9FBFF',
    },
    {
      img: require('../../../../assets/images/requests/2.png'),
      color: '#FDFBEB',
    },
    {
      img: require('../../../../assets/images/requests/3.png'),
      color: '#FEF7F0',
    },
    {
      img: require('../../../../assets/images/requests/4.png'),
      color: '#F3F9FF',
    },
    {},
    {
      img: require('../../../../assets/images/requests/5.png'),
      color: '#F6F6FF',
    },
  ];

  const [isLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({});

  const handleCancelPress = () => {
    setVisible(true);
  };

  const updateRequestStatus = (request, newStatus) => {
    setLoading(true);
    if (newStatus === 5) {
      setSelectedRequest(request)
      handleCancelPress();
      setLoading(false);
      return null;
    }
    if (newStatus === 1) {
      mngmtHttp
        .put(`/requests/${request.id}/assign-status`, {
          status: newStatus,
        })
        .then(() => {
          setLoading(false);
          AlertHelper.showMessage('success', t('alerts.success'));
        })
        .then(() => {
          query.refetch();
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
          AlertHelper.show('error', t('common.error'), error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    if (request.status === 21 && newStatus === 20) {
      mngmtHttp
        .put(`/requests/${request.id}/assign-status`, {
          status: newStatus,
        })
        .then(() => {
          setLoading(false);
          AlertHelper.showMessage('success', t('alerts.success'));
        })
        .then(() => {
          query.refetch();
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
          AlertHelper.show('error', t('common.error'), error);
        })
        .finally(() => {
          setLoading(false);
        });
      return null;
    }
    if (newStatus === 20 || request.status === 20) {
      navigation.navigate('requestsTab', { screen: 'StartRequest', params: { request: item}});
      setLoading(false);
      return null;
    }
    if (newStatus === 3) {
      navigation.navigate('requestsTab', {
        screen: 'ApproveRequest', params: {
        request: item,
      }});
      setLoading(false);
      return null;
    }
    if (!newStatus) {
      navigation.navigate('requestsTab', { screen: 'AssignToReq' , params: {request: item}});
      setLoading(false);
      return null;
    }

    mngmtHttp
      .put(`/requests/${request.id}/assign-status`, {
        status: newStatus,
      })
      .then(() => {
        setLoading(false);
        AlertHelper.showMessage('success', t('alerts.success'));
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        AlertHelper.show('error', t('common.error'), error);
      })
      .finally(() => {
        setLoading(false);
        query.refetch();
      });
  };


  const RequestCardItem = ({t, item, type}) => {
    return (
      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center'}} activeOpacity={0.8}>
        <CardWithShadow>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%'
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor:
                    cardImgPlaceHolder[item?.type - 1]?.color ?? '#fff',
                  width: 70,
                  height: 80,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                }}>
                <Image
                  resizeMode={'contain'}
                  style={{
                    width: '70%',
                    height: '70%',
                  }}
                  source={cardImgPlaceHolder[item?.type - 1]?.img}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 12,
                justifyContent: 'flex-start',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <AppText
                  fontSize={theme.c1.size}
                  fontWeight={theme.c1.fontWeight}
                  regular
                  Tcolor={theme.greyColor}
                  textAlign={'left'}>
                  {`${t('requests.requestType')}`}
                </AppText>
                {!!item?.is_urgent && (
                  <View
                    style={{
                      backgroundColor: 'rgba(255,0,0,0.06)',
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
                      Tcolor={theme.red}
                      textAlign={'center'}>
                      {t('requests.urgent')}
                    </AppText>
                  </View>
                )}
              </View>

              <AppText
                fontSize={theme.s2.size}
                fontWeight={theme.s2.fontWeight}
                regular
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t(`requestsCategories.${RequestTypeAsArray[item?.type - 1]}`)}
              </AppText>

              <View style={{height: 3}} />

              {item?.subtype && (
                <AppText
                  Tcolor={theme.blackColor}
                  fontSize={theme.c1.size}
                  fontWeight={theme.c1.fontWeight}
                  regular
                  textAlign={'left'}>
                  {IssueTypeAsArray[item?.subtype - 1]}
                </AppText>
              )}

              <View style={{height: 10}} />

              <AppText
                fontSize={theme.c1.size}
                fontWeight={theme.c1.fontWeight}
                regular
                Tcolor={theme.greyColor}
                textAlign={'left'}>
                {`${t('requests.status')}`}
              </AppText>

              <View style={{height: 5}} />
              <StatusBadge request={item} regular={true} />
              <View style={{height: 10}} />
            </View>
          </View>
          <View style={{height: 15}} />
          
            <RenderActionButtonsAndStatus isLoading={isLoading} updateRequestStatus={updateRequestStatus}  isCard={true} request={item} />
        
        </CardWithShadow>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        name={t('ViewTenant.requests.All Request')}
        navigation={navigation}
      />
      <View style={{height: 20}} />
      <View style={styles.searchContainer}>
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
        data={query?.data?.data?.active_requests ?? []}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 15}} />}
        ItemSeparatorComponent={() => <View style={{height: 15}} />}
        renderItem={({item, index}) => (
          <RequestCardItem
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
       <CancelRequestModel
        setVisible={setVisible}
        screenTo={{ parent: 'contactsTab', child: 'TenantRequestList' }}
        request={selectedRequest}
        visible={visible}
        navigation={navigation}
      />
    </View>
  );
};

export default TenantRequestLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

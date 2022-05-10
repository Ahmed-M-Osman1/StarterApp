import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import i18n from 'i18next';
import {useAbility} from '@casl/react';
import {useSelector} from 'react-redux';
import AppText from '../../../components/AppText';
import {RequestTypeAsArray} from '../../../utils/constants/RequestType';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';

import {IssueTypeAsArray} from '../../../utils/constants/IssueType';
import {AlertHelper} from '../../../utils/AlertHelper';
import {CardWithShadow} from '../../../components/CardWithShadow';
import RenderActionButtonsAndStatus, {
  renderActionButtonsAndStatusObj,
  StatusBadge,
} from './RenderActionButtonsAndStatus';
import {Security} from '../../../utils/constants/Role';

const moment = require('moment');

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

const requstStatusBadgeTextAndColor = {
  1: {text: 'new'},
  1: {text: 'inProgress'},
};

const RequestItem = ({
  navigation,
  item,
  query,
  setSelectedRequest,
  handleCancelPress,
  listOfAvailableRequestCategories,
}) => {
  const [isLoading, setLoading] = useState(false);

  // const ability = useAbility(AbilityContext);
  const role = useSelector(state => state.user.data.role);

  //
  const updateRequestStatus = (request, newStatus) => {
    setLoading(true);
    if (newStatus === 5) {
      setSelectedRequest(request);
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
          AlertHelper.showMessage('success', i18n.t('alerts.success'));
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
          AlertHelper.show('error', i18n.t('common.error'), error);
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
          AlertHelper.showMessage('success', i18n.t('alerts.success'));
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
          AlertHelper.show('error', i18n.t('common.error'), error);
        })
        .finally(() => {
          setLoading(false);
        });
      return null;
    }
    if (newStatus === 20 || request.status === 20) {
      navigation.navigate('StartRequest', {request: item});
      setLoading(false);
      return null;
    }
    if (newStatus === 3) {
      navigation.navigate('ApproveRequest', {
        request: item,
      });
      setLoading(false);
      return null;
    }
    if (!newStatus) {
      navigation.navigate('AssignToReq', {request: item});
      setLoading(false);
      return null;
    }

    mngmtHttp
      .put(`/requests/${request.id}/assign-status`, {
        status: newStatus,
      })
      .then(() => {
        setLoading(false);
        AlertHelper.showMessage('success', i18n.t('alerts.success'));
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        AlertHelper.show('error', i18n.t('common.error'), error);
      })
      .finally(() => {
        setLoading(false);
        query.refetch();
      });
  };

  const checkSecurityHistory = item => {
    return (
      role == Security &&
      moment(`${item.date}T${item.time}:00+5:30`) >= moment()
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ReqDetails', {request: item});
      }}
      activeOpacity={0.7}>
      <CardWithShadow>
        {!item ? (
          <ActivityIndicator />
        ) : (
          <>
            <View style={styles.itemsContainer}>
              <View style={styles.imageContainer}>
                <View
                  style={{
                    backgroundColor: cardImgPlaceHolder[item.type - 1]?.color,
                    width: 100,
                    // height: ,
                    flex: 1,
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Image
                    resizeMode={'contain'}
                    source={cardImgPlaceHolder[item.type - 1]?.img}
                  />
                </View>
              </View>

              <View style={styles.detailsContainer}>
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
                    {`${i18n.t('requests.unitNumber')}`}
                  </AppText>
                  {!!item.is_urgent && (
                    <View
                      style={{
                        backgroundColor: 'rgba(255,0,0,0.06)',
                        width: 70,
                        height: 25,
                        borderRadius: 4,
                        justifyContent: 'center',
                        marginTop: -5
                      }}>
                      <AppText
                        fontSize={theme.label.size}
                        fontWeight={theme.c1.fontWeight}
                        regular
                        Tcolor={theme.red}
                        textAlign={'center'}>
                        {i18n.t('requests.urgent')}
                      </AppText>
                    </View>
                  )}
                  {role === Security && checkSecurityHistory(item) &&  <AppText
                      fontSize={theme.c1.size}
                      fontWeight={theme.c1.fontWeight}
                      regular
                      Tcolor={theme.greyColor}
                      textAlign={'left'}>
                      {item.status === 4 ? i18n.t('requests.checkInTime') : i18n.t('requests.scheduleTime')}
                    </AppText>}
                </View>
                <View style={{marginTop: !!item.is_urgent ? -5 : 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <AppText
                    fontSize={theme.s1.size}
                    fontWeight={theme.s1.fontWeight}
                    regular
                    Tcolor={theme.blackColor}
                    textAlign={'left'}>
                    {`${item.unit?.name || ''}`}
                  </AppText>
                  {role === Security && checkSecurityHistory(item) && <AppText
                    fontSize={theme.s1.size}
                    fontWeight={theme.s1.fontWeight}
                    regular
                    Tcolor={theme.blackColor}
                    textAlign={'left'}>
                    {`${moment(`${item.date}T${item.time}:00+05:30`).calendar()}`}
                  </AppText>}
                </View>

                <View style={{height: 8}} />

                <AppText
                  fontSize={theme.c1.size}
                  fontWeight={theme.c1.fontWeight}
                  regular
                  Tcolor={theme.greyColor}
                  textAlign={'left'}>
                  {`${i18n.t('requests.requestType')}`}
                </AppText>

                <View style={{height: 5}} />
                <AppText
                  fontSize={theme.s1.size}
                  fontWeight={theme.s1.fontWeight}
                  Tcolor={theme.blackColor}
                  regular
                  textAlign={'left'}>
                  {i18n.t(
                    `requestsCategories.${
                      listOfAvailableRequestCategories?.data?.data?.find(
                        i => i.code === item?.type,
                      )?.name
                    }`,
                    {
                      defaultValue: listOfAvailableRequestCategories?.data?.data?.find(
                        i => i.code === item?.type,
                      )?.name,
                    },
                  )}
                </AppText>
                <View style={{height: 5}} />
                {item.subtype && (
                  <AppText
                    Tcolor={theme.blackColor}
                    fontSize={theme.s2.size}
                    fontWeight={theme.s2.fontWeight}
                    regular
                    textAlign={'left'}>
                    {i18n.t(
                      `requestsCategories.${
                        listOfAvailableRequestCategories?.data?.data
                          ?.find(i => i.code === item?.type)
                          ?.subCategories.find(i => i.code === item?.subtype)
                          ?.name
                      }`,
                      {
                        defaultValue: listOfAvailableRequestCategories?.data?.data
                          ?.find(i => i.code === item?.type)
                          ?.subCategories.find(i => i.code === item?.subtype)
                          ?.name,
                      },
                    )}
                    {/* {IssueTypeAsArray[item.subtype - 1]} */}
                  </AppText>
                )}
                <View style={styles.infoContaier}>
                  {item.visitor && (
                    <View style={{marginTop: 5}}>
                      <AppText
                        fontSize={theme.subTitleFontSize}
                        regular
                        Tcolor={theme.blackColor}
                        textAlign={'left'}>
                        {`Name: ${item.visitor?.first_name} ${item.visitor?.last_name}`}
                      </AppText>
                      <AppText
                        Tcolor={theme.blackColor}
                        style={{marginTop: 5}}
                        fontSize={theme.subTitleFontSize}
                        regular
                        textAlign={'left'}>
                        {`ID: ${item.visitor?.national_id} `}
                      </AppText>
                    </View>
                  )}
                </View>
                <View style={{height: 10}} />
                <StatusBadge request={item} />

                {/* btn for assigning the staff complete the request */}
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <RenderActionButtonsAndStatus
                request={item}
                isLoading={isLoading}
                updateRequestStatus={updateRequestStatus}
                isCard={true}
              />
            </View>
          </>
        )}
      </CardWithShadow>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: theme.whiteColor,
    borderRadius: 8,
    shadowColor: Platform.OS === 'android' ? '#c4c4c4' : '#eeeeee',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    padding: 12,
  },
  cardTitleText: {
    color: '#2A3D47',
    fontSize: 16,
    fontWeight: '700',
  },
  cardInfoText: {
    color: '#2A3D47',
    fontSize: 13,
    fontWeight: '400',
    // marginHorizontal: 0,
  },
  statusTitleText: {
    color: '#2A3D47',
    //fontSize: 13,
    fontWeight: '500',
    // marginHorizontal: 0,
  },
  statusValueText: {
    color: '#2A3D47',
    //fontSize: 14,
    fontWeight: '600',
    // marginHorizontal: 10,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 10,
    // marginTop: 10,
    // marginHorizontal: 10,
  },
  imageContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
    // backgroundColor: 'pink',
  },
  infoContaier: {
    // flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'left',
    // marginHorizontal: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    // marginVertical: 10,
    alignContent: 'center',
  },
  buttonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 10,
    flexDirection: 'row',

    // backgroundColor: 'pink',
    // marginHorizontal: 10,
  },
});

export default RequestItem;

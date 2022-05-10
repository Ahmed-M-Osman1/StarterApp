import React, {useEffect, useState} from 'react';
import {
  View,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import Header from '../../../components/Header';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import {RequestTypeAsArray} from '../../../utils/constants/RequestType';
import {
  CarCleaningSubTypesArray,
  HomeCleaningSubTypesArray,
  IssueTypeAsArray,
} from '../../../utils/constants/IssueType';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import {useForm} from 'react-hook-form';
import {AlertHelper} from '../../../utils/AlertHelper';
import ImageSlider from '../components/ImageSlider';
import CancelRequestModel from '../components/CancelRequestModal';
import AppImage from '../../../components/AppImage';
import {CardWithShadow} from '../../../components/CardWithShadow';
import config from 'react-native-ultimate-config';
import RenderActionButtonsAndStatus, {
  renderActionButtonsAndStatusObj,
} from '../components/RenderActionButtonsAndStatus';
import {Admin, Management, Tenant} from '../../../utils/constants/Role';
const moment = require('moment');

const ImagePlaceholder = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.setIsModalVisible(true);
        props.setSliderIndex(props.idx);
      }}
      style={{
        height: 60,
        width: 60,
        borderRadius: 8,
        marginRight: 5,
      }}>
      <AppImage uri={props.img.url} />
    </TouchableOpacity>
  );
};

const ReqDetails = ({route, navigation}) => {
  const {request} = route.params;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [checkInModal, setCheckInModal] = useState(false);
  const {t} = useTranslation();
  const role = useSelector(state => state.user.data.role);

  const query = useQuery(`RequestUnitDetails`, () =>
    mngmtHttp
      .get(`/properties/${request?.unit?.id}`)
      .then(response => response.data.data),
  );

  const requestDetails = useQuery(`RequestUnitViewDetails`, () =>
    mngmtHttp
      .get(`/requests/${request?.id}`)
      .then(response => response.data.data),
  );
  const quotationQuery = useQuery(`RequestQuotation_${request?.id}`, () =>
    mngmtHttp
      .get(`/invoice-by-request/${request?.id}`)
      .then(response => response.data)
      .catch(e => console.log(e)),
  );

  const listOfAvailableRequestCategories = useQuery(
    'listOfAvailableRequestCategories',
    () =>
      mngmtHttp
        .get(`/request-category`)
        .then(resp => resp.data)
        .catch(e => console.log(e)),
  );

  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      user_id: '',
    },
  });

  useEffect(() => {
    if (!!watch('user_id')) submitAssignRequeset(watch('user_id'));
  }, [watch('user_id')]);

  //
  const updateRequestStatus = (request, newStatus) => {
    setLoading(true);
    if (newStatus === 5) {
      handleCancelPress();
      setLoading(false);
      return null;
    }

    if (newStatus === 4) {
      return setCheckInModal(true);
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
          requestDetails.refetch();
          quotationQuery.refetch();
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
          requestDetails.refetch();
          quotationQuery.refetch();
        });
      return null;
    }
    if (newStatus === 20 || request.status === 20) {
      navigation.navigate('StartRequest', {request: requestDetails.data});
      setLoading(false);
      return null;
    }
    if (newStatus === 3) {
      navigation.navigate('ApproveRequest', {
        request: requestDetails.data,
      });
      setLoading(false);
      return null;
    }
    if (!newStatus) {
      navigation.navigate('AssignToReq', {request: requestDetails.data});
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
        requestDetails.refetch();
        quotationQuery.refetch();
      });
  };

  const downloadInvoice = async () => {
    let link = '';

    await mngmtHttp
      .get(`/invoice-download/${quotationQuery?.data?.data?.id}`)
      .then(resp => (link = resp.data.data.url))
      .catch(e => console.log(e));

    if (link) {
      Linking.openURL(link);
    }
  };

  const handleCheckIn = () => {
    mngmtHttp
      .put(`/requests/${request.id}/assign-status`, {
        status: 4,
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
        setCheckInModal(false);
        requestDetails.refetch();
        quotationQuery.refetch();
      });
  };

  const handleRejectCheckIn = () => {
    setLoading(false);
    setCheckInModal(false);
  };

  const submitAssignRequeset = userId => {
    setLoading(true);
    mngmtHttp
      .put(`/requests/${request.id}/assign-staff`, {
        user_id: userId,
      })
      .then(response => {
        setLoading(false);
        if (response.status === 200 || response.status === 201)
          AlertHelper.showMessage('success', t('common.success'));
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        AlertHelper.showMessage('error', t('common.error'), 'please try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancelPress = () => {
    setVisible(true);
  };

  useEffect(() => {
    query.refetch();
  }, []);

  // update the details once the checkin is complete
  useEffect(() => {
    requestDetails.refetch();
    quotationQuery.refetch();
  }, [request.status]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      // dispatch(setLoading(false));
      query.refetch();
      requestDetails.refetch();
      quotationQuery.refetch();
    });
  }, []);
  //
  //
  //
  //
  const RequestInfoCard = () => {
    return (
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{}}>
            <AppText
              Tcolor={theme.blackColor}
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              regular
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {t('requests.ticketID')}
            </AppText>
            <AppText
              fontSize={theme.p1.size}
              fontWeight={theme.s1.fontWeight}
              regular
              Tcolor={theme.primaryColor}
              // fontSize={theme.titleFontSize}
              style={{marginVertical: 5}}
              textAlign={'left'}>
              {`${requestDetails.data?.id}`}
            </AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            {requestDetails.data?.is_urgent ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'red',
                      width: 8,
                      borderRadius: 30,
                      height: 8,
                    }}
                  />
                </View>
                <AppText
                  fontSize={theme.label.size}
                  fontWeight={theme.label.fontWeight}
                  regular
                  Tcolor={theme.red}
                  // fontSize={theme.titleFontSize}
                  style={{marginVertical: 5}}
                  textAlign={'left'}>
                  {t('requests.urgent')}
                </AppText>
              </View>
            ) : (
              <>
                <AppText
                  fontSize={theme.p2.size}
                  fontWeight={theme.p2.fontWeight}
                  regular
                  Tcolor={theme.blackColor}
                  // fontSize={theme.titleFontSize}
                  textAlign={'left'}>
                  {t('requests.scheduleTime')}
                </AppText>
                <AppText
                  fontSize={theme.p1.size}
                  fontWeight={theme.s1.fontWeight}
                  regular
                  Tcolor={theme.blackColor}
                  // fontSize={theme.titleFontSize}
                  style={{marginVertical: 5}}
                  textAlign={'left'}>
                  {`${requestDetails.data?.date ?? ''} ${
                    requestDetails.data?.time ?? ''
                  }`}
                </AppText>
              </>
            )}
          </View>
        </View>
        <View
          style={{
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('requests.status')}
          </AppText>
          {!!requestDetails?.data?.type &&
            !!requestDetails?.data?.status &&
            !!role && (
              <AppText
                fontSize={theme.p1.size}
                fontWeight={theme.s1.fontWeight}
                regular
                Tcolor={theme.blackColor}
                // fontSize={theme.titleFontSize}
                textAlign={'left'}>
                {t(
                  !!requestDetails?.data?.assignee &&
                    (role === Management || role === Admin) &&
                    requestDetails.data.status === 1
                    ? 'requestsStatus.sent'
                    : // : !!requestDetails?.data?.assignee && role === Tenant
                      // ? 'requestsStatus.inProgress'
                      renderActionButtonsAndStatusObj[role][
                        requestDetails?.data?.type ?? 1
                      ][requestDetails?.data?.status ?? 1]?.status,
                ) ?? ''}
              </AppText>
            )}
        </View>
        <View
          style={{
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('requests.unitNumber')}
          </AppText>
          <AppText
            fontSize={theme.p1.size}
            fontWeight={theme.s1.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {`${requestDetails.data?.unit?.name || ''}`}
          </AppText>
        </View>
        <View
          style={{
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('requests.requestType')}
          </AppText>
          <AppText
            fontSize={theme.p1.size}
            fontWeight={theme.s1.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t(
              `requestsCategories.${
                listOfAvailableRequestCategories?.data?.data?.find(
                  i => i.code === requestDetails?.data?.type,
                )?.name
              }`,
              {
                defaultValue: listOfAvailableRequestCategories?.data?.data?.find(
                  i => i.code === requestDetails?.data?.type,
                )?.name,
              },
            )}
          </AppText>
        </View>
        {requestDetails?.data?.type !== 4 && requestDetails?.data?.type !== 6 && (
          <View
            style={{
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              regular
              Tcolor={theme.blackColor}
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {t('requests.subtype')}
            </AppText>
            <AppText
              fontSize={theme.p1.size}
              fontWeight={theme.s1.fontWeight}
              regular
              textTransform={'capitalize'}
              Tcolor={theme.blackColor}
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {/* {t(
                `requestsCategories.${
                  IssueTypeAsArray[requestDetails?.data?.subtype - 1]
                }`,
              )} */}
              {t(
                `requestsCategories.${
                  listOfAvailableRequestCategories?.data?.data
                    ?.find(i => i.code === requestDetails?.data?.type)
                    ?.subCategories.find(
                      i => i.code === requestDetails?.data?.subtype,
                    )?.name
                }`,
                {
                  defaultValue: listOfAvailableRequestCategories?.data?.data
                    ?.find(i => i.code === requestDetails?.data?.type)
                    ?.subCategories.find(
                      i => i.code === requestDetails?.data?.subtype,
                    )?.name,
                },
              )}
              {/* {t(
                `requestsCategories.${
                  requestDetails?.data?.type == 1
                    ? IssueTypeAsArray[requestDetails.data?.subtype - 1]
                    : requestDetails?.data?.type == 2
                    ? HomeCleaningSubTypesArray[
                        requestDetails?.data?.subtype_category - 1
                      ]
                    : requestDetails?.data?.type == 3
                    ? CarCleaningSubTypesArray[
                        requestDetails?.data?.subtype_category - 1
                      ]
                    : ''
                }`,
              )} */}
            </AppText>
          </View>
        )}
        <View
          style={{
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('requests.createdAt')}
          </AppText>
          <AppText
            fontSize={theme.p1.size}
            fontWeight={theme.s1.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {`${requestDetails.data?.created_at.split(' ')[0] ?? ''}`}
          </AppText>
        </View>
      </CardWithShadow>
    );
  };
  //
  const DescriptionCard = () => {
    return (
      <CardWithShadow>
        <AppText
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          regular
          Tcolor={theme.blackColor}
          // fontSize={theme.titleFontSize}
          textAlign={'left'}>
          {t('requestDetails.description')}
        </AppText>
        <AppText
          fontSize={theme.p2.size}
          fontWeight={
            !!requestDetails.data?.description
              ? theme.s1.fontWeight
              : theme.p2.fontWeight
          }
          regular
          Tcolor={
            !!requestDetails.data?.description
              ? theme.blackColor
              : theme.greyColor
          }
          // fontSize={theme.titleFontSize}
          style={{marginTop: 10}}
          textAlign={'left'}>
          {`${requestDetails.data?.description || t('requests.noDescription')}`}
        </AppText>
      </CardWithShadow>
    );
  };
  //
  const AttachmentCard = () => {
    return (
      <CardWithShadow>
        <AppText
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          regular
          Tcolor={theme.blackColor}
          // fontSize={theme.titleFontSize}
          textAlign={'left'}>
          {t('requests.attachments')}
        </AppText>
        <View style={{height: 10}} />

        {!!requestDetails.data?.files.length ? (
          <>
            <View style={{flexDirection: 'row'}}>
              {requestDetails.data?.files.map((element, idx) => (
                <ImagePlaceholder
                  key={idx + element.id}
                  setIsModalVisible={setIsModalVisible}
                  setSliderIndex={setSliderIndex}
                  img={element}
                  idx={idx}
                />
              ))}
            </View>
            <ImageSlider
              media={requestDetails.data?.files}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              imageIndex={sliderIndex}
            />
          </>
        ) : (
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p1.fontWeight}
            regular
            Tcolor={theme.greyColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('requests.noAttachments')}
          </AppText>
        )}
      </CardWithShadow>
    );
  };
  //
  const ConfirmationCodeCard = () => {
    return (
      <CardWithShadow>
        <AppText
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          regular
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('requests.confirmationCode')}
        </AppText>
        <View style={{height: 10}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '72%'}}>
            <AppText
              fontSize={theme.p2.size}
              fontWeight={theme.p1.fontWeight}
              regular
              Tcolor={theme.greyColor}
              textAlign={'left'}>
              {t('requests.confirmationCodeText')}
            </AppText>
          </View>
          <AppButton
            title={request?.confirmation_code || ''}
            onPress={() => {}}
            Bcolor={'#ffffff00'}
            style={{borderColor: theme.primaryColor, borderWidth: 1}}
            rounded={8}
            customWidth={'25%'}
            fontSize={theme.p2.size}
            customHeight={25}
            customMargin={0}
            Tcolor={theme.primaryColor}
          />
        </View>
      </CardWithShadow>
    );
  };
  //
  const AssignStaffCard = () => {
    return (
      <>
        {!requestDetails.data?.assignee ? (
          <CardWithShadow>
            <AppText
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              regular
              Tcolor={theme.blackColor}
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {t('requests.assignStaff')}
            </AppText>
            <View style={{height: 10}} />
            <AppText
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              regular
              Tcolor={theme.blackColor}
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {t('requests.notAssigned')}
            </AppText>
          </CardWithShadow>
        ) : (
          <CardWithShadow>
            <AppText
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              regular
              Tcolor={theme.blackColor}
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {t('requests.assignedTo')}
            </AppText>

            <View style={{height: 10}} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <AppText
                fontSize={theme.p1.size}
                fontWeight={theme.s1.fontWeight}
                regular
                Tcolor={theme.blackColor}
                // fontSize={theme.titleFontSize}
                textAlign={'left'}>
                {`${requestDetails.data?.assignee?.name ?? ''}`}
              </AppText>
              <AppButton
                title={t('myUnits.call')}
                onPress={() =>
                  requestDetails.data?.assignee?.phone_number
                    ? Linking.openURL(
                        `tel:${requestDetails.data?.assignee?.phone_number}`,
                      )
                    : null
                }
                Bcolor={theme.primaryColor}
                style={{borderColor: theme.primaryColor, borderWidth: 1}}
                rounded={8}
                // half={true}
                customWidth={'25%'}
                fontSize={theme.p2.size}
                customHeight={25}
                customMargin={0}
                Tcolor={theme.whiteColor}
                leftIcon={'phone-alt'}
                iconColor={theme.whiteColor}
                iconSize={theme.p1.size}
                // style={{marginBottom: HP(4)}}
              />
            </View>
          </CardWithShadow>
        )}
      </>
    );
  };
  //
  const QuotationCard = () => {
    return (
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            fontSize={theme.s1.size}
            fontWeight={theme.s1.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('requests.quotation')}
          </AppText>
          {!!quotationQuery?.data?.data && (
            <View
              style={{
                borderRadius: 99,
                backgroundColor: `${
                  requestDetails.data.status === 22
                    ? theme.red
                    : requestDetails.data.status === 23 ||
                      requestDetails.data.status === 3
                    ? theme.green
                    : '#F29603'
                }30`,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}>
              <AppText
                fontSize={theme.c1.size}
                fontWeight={theme.c1.fontWeight}
                regular
                Tcolor={
                  requestDetails.data.status === 22
                    ? theme.red
                    : requestDetails.data.status === 23 ||
                      requestDetails.data.status === 3
                    ? theme.green
                    : '#F29603'
                }
                // fontSize={theme.titleFontSize}
                textAlign={'left'}>
                {requestDetails?.data?.status === 21 && t('requests.pending')}
                {requestDetails.data.status === 22 &&
                  t('requestsStatus.declined')}
                {(requestDetails.data.status === 23 ||
                  requestDetails.data.status === 3) &&
                  t('requestsStatus.accepted')}
              </AppText>
            </View>
          )}
        </View>
        {!!quotationQuery?.data?.data ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                marginBottom: 5,
              }}>
              <AppText
                fontSize={theme.s2.size}
                fontWeight={theme.s2.fontWeight}
                regular
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t('requests.serviceFees')}
              </AppText>
              <View style={{alignItems: 'flex-end'}}>
                <AppText
                  fontSize={theme.s2.size}
                  fontWeight={theme.s2.fontWeight}
                  regular
                  Tcolor={theme.blackColor}
                  textAlign={'left'}>
                  {t('dashboard.sar')}{' '}
                  {quotationQuery?.data?.data?.items?.find(
                    s => s?.service_name === 'service fee',
                  )?.amount ?? 0}
                </AppText>
                <AppText
                  fontSize={theme.p2.size}
                  fontWeight={theme.p2.fontWeight}
                  regular
                  Tcolor={theme.greyColor}
                  textAlign={'left'}>
                  {t('common.vatInc')}
                </AppText>
              </View>
            </View>
            {quotationQuery?.data?.data?.items
              ?.filter(
                s =>
                  !s?.service_name.startsWith('additional fee') &&
                  s?.service_name !== 'service fee',
              )
              .map(sparePart => {
                return (
                  <View
                    key={sparePart.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 5,
                      marginBottom: 5,
                    }}>
                    <View>
                      <AppText
                        fontSize={theme.s2.size}
                        fontWeight={theme.s2.fontWeight}
                        regular
                        Tcolor={theme.blackColor}
                        textAlign={'left'}>
                        {t('requests.spareParts')}
                      </AppText>
                      <AppText
                        fontSize={theme.p2.size}
                        fontWeight={theme.p2.fontWeight}
                        regular
                        Tcolor={theme.greyColor}
                        textAlign={'left'}>
                        {sparePart?.service_name}
                      </AppText>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <AppText
                        fontSize={theme.s2.size}
                        fontWeight={theme.s2.fontWeight}
                        regular
                        Tcolor={theme.blackColor}
                        textAlign={'left'}>
                        {t('dashboard.sar')} {sparePart?.amount ?? 0}
                      </AppText>
                      <AppText
                        fontSize={theme.p2.size}
                        fontWeight={theme.p2.fontWeight}
                        regular
                        Tcolor={theme.greyColor}
                        textAlign={'left'}>
                        {t('common.vatInc')}
                      </AppText>
                    </View>
                  </View>
                );
              })}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
                marginBottom: 5,
              }}>
              <AppText
                fontSize={theme.s2.size}
                fontWeight={theme.s2.fontWeight}
                regular
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t('requests.additionalFees')}
              </AppText>
              <View style={{alignItems: 'flex-end'}}>
                <AppText
                  fontSize={theme.s2.size}
                  fontWeight={theme.s2.fontWeight}
                  regular
                  Tcolor={theme.blackColor}
                  textAlign={'left'}>
                  {t('dashboard.sar')}{' '}
                  {quotationQuery?.data?.data?.items?.find(s =>
                    s?.service_name.startsWith('additional fee'),
                  )?.amount ?? 0}
                </AppText>
                <AppText
                  fontSize={theme.p2.size}
                  fontWeight={theme.p2.fontWeight}
                  regular
                  Tcolor={theme.greyColor}
                  textAlign={'left'}>
                  {t('common.vatInc')}
                </AppText>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
                marginBottom: 5,
              }}>
              <AppText
                fontSize={theme.s2.size}
                fontWeight={theme.s2.fontWeight}
                regular
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t('requests.totalAmount')}
              </AppText>
              <View style={{alignItems: 'flex-end'}}>
                <AppText
                  fontSize={theme.s2.size}
                  fontWeight={theme.s2.fontWeight}
                  regular
                  Tcolor={theme.blackColor}
                  textAlign={'left'}>
                  {t('dashboard.sar')}{' '}
                  {(quotationQuery?.data?.data?.total_amount ?? 0).toFixed(2)}
                </AppText>
                <AppText
                  fontSize={theme.p2.size}
                  fontWeight={theme.p2.fontWeight}
                  regular
                  Tcolor={theme.greyColor}
                  textAlign={'left'}>
                  {t('common.vatInc')}
                </AppText>
              </View>
            </View>
            <>
              {/* {console.log(quotationQuery?.data?.data)} */}
              {!!quotationQuery?.data?.data?.paid && (
                <View style={{marginTop: 20}}>
                  <AppButton
                    title={t('common.downloadInvoice')}
                    // onPress={() => Linking.canOpenURL()}
                    onPress={() => downloadInvoice()}
                    Bcolor={theme.primaryColor}
                    // style={{borderColor: theme.primaryColor, borderWidth: 1}}
                    rounded={8}
                    customWidth={'100%'}
                    fontSize={theme.p2.size}
                    customHeight={25}
                    customMargin={0}
                    Tcolor={theme.whiteColor}
                  />
                </View>
              )}
            </>
          </>
        ) : (
          <View style={{marginTop: 8, marginBottom: 10}}>
            <AppText
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              regular
              Tcolor={theme.greyColor}
              textAlign={'left'}>
              {t('common.noData')}
            </AppText>
          </View>
        )}
      </CardWithShadow>
    );
  };

  //
  const VisitRequestDetailsCard = () => {
    return (
      <CardWithShadow>
        <AppText
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          regular
          Tcolor={theme.primaryColor}
          // fontSize={theme.titleFontSize}
          textAlign={'left'}>
          {t('Visitor Details')}
        </AppText>
        <View style={{height: 10}} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p1.fontWeight}
            regular
            Tcolor={theme.greyColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('Name')}
          </AppText>
          <AppText
            fontSize={theme.s2.size}
            fontWeight={theme.s2.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {`${requestDetails?.data?.visitor?.first_name} ${requestDetails?.data?.visitor?.last_name}`}
          </AppText>
        </View>
        <View style={{height: 5}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p1.fontWeight}
            regular
            Tcolor={theme.greyColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('ID Number')}
          </AppText>
          <AppText
            fontSize={theme.s2.size}
            fontWeight={theme.s2.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {`${requestDetails?.data?.visitor?.national_id}`}
          </AppText>
        </View>
        <View style={{height: 5}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText
            fontSize={theme.p2.size}
            fontWeight={theme.p1.fontWeight}
            regular
            Tcolor={theme.greyColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {t('Phone Number')}
          </AppText>
          <AppText
            fontSize={theme.s2.size}
            fontWeight={theme.s2.fontWeight}
            regular
            Tcolor={theme.blackColor}
            // fontSize={theme.titleFontSize}
            textAlign={'left'}>
            {`${requestDetails?.data?.visitor?.phone_number}`}
          </AppText>
        </View>
      </CardWithShadow>
    );
  };

  const CheckInCard = () => {
    return (
      <CardWithShadow>
        <AppText
          fontSize={theme.s2.size}
          fontWeight={theme.s2.fontWeight}
          regular
          Tcolor={theme.primaryColor}
          // fontSize={theme.titleFontSize}
          textAlign={'left'}>
          {t('visitorReq.checkInVisitor')}
        </AppText>
        <View style={{height: 10}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <View>
            <AppText
              fontSize={theme.s1.size}
              fontWeight={theme.s1.fontWeight}
              regular
              Tcolor={theme.blackColor}
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {`${requestDetails?.data?.checked_in?.caused_by?.name ?? 'NA'}`}
            </AppText>
            <View style={{height: 5}} />
            <AppText
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              regular
              Tcolor={theme.greyColor}
              // fontSize={theme.titleFontSize}
              textAlign={'left'}>
              {`${
                requestDetails?.data?.checked_in?.created_at
                  ? moment(requestDetails?.data?.checked_in?.created_at).format(
                      'LLL',
                    )
                  : 'NA'
              }`}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `tel:${requestDetails?.data?.checked_in?.caused_by?.phone_number}`,
              )
            }
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: theme.primaryColor,
              borderRadius: 6,
            }}>
            <AppText
              Tcolor={theme.whiteColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {t('common.call')}
            </AppText>
          </TouchableOpacity>
        </View>
      </CardWithShadow>
    );
  };

  let isScreenLoading =
    requestDetails.isLoading ||
    requestDetails.isFetching ||
    query.isLoading ||
    query.isFetching;

  //
  return (
    <View style={{backgroundColor: theme.whiteColor, flex: 1}}>
      <Header name={t('requestDetails.title')} navigation={navigation} />
      <ScrollView
        scrollEnabled={!visible}
        style={{
          backgroundColor: theme.whiteColor,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}>
        {isScreenLoading ? (
          <ActivityIndicator />
        ) : (
          <View
            style={{
              marginHorizontal: 20,
              flex: 1,
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <RequestInfoCard />
            {request.type === 4 && (
              <>
                <View style={{height: 15}} />
                <VisitRequestDetailsCard />
              </>
            )}
            {request.status === 4 && (role === Management || role === Admin) && (
              <>
                <View style={{height: 15}} />
                <CheckInCard />
              </>
            )}
            <View style={{height: 15}} />
            <DescriptionCard />
            <View style={{height: 15}} />
            <AttachmentCard />
            <View style={{height: 15}} />

            {request?.confirmation_code &&
              request.type !== 4 &&
              (role === 'CUSTOMER' || role === 'ADMIN') && (
                <>
                  <ConfirmationCodeCard />
                  <View style={{height: 15}} />
                </>
              )}
            {(role === 'ADMIN' || role === 'MANAGEMENT') &&
              request.type !== 4 &&
              request.status !== 5 && (
                <>
                  <AssignStaffCard />
                  <View style={{height: 15}} />
                </>
              )}
            {requestDetails.data?.type !== 4 && <QuotationCard />}
            <View style={{height: 20}} />
          </View>
        )}
      </ScrollView>
      <RenderActionButtonsAndStatus
        request={requestDetails.data}
        isLoading={loading}
        updateRequestStatus={updateRequestStatus}
      />
      <View style={{height: 30}} />
      <CancelRequestModel
        setVisible={setVisible}
        request={request}
        visible={visible}
        navigation={navigation}
      />
      <Modal visible={checkInModal} animationType={'slide'} transparent={true}>
        <View style={styles.checkInModal}>
          <CardWithShadow style={{padding: 0, width: '100%', margin: 0}}>
            <View
              style={{
                marginHorizontal: 20,
                marginVertical: 15,
              }}>
              <AppText fontWeight={theme.s1.fontWeight}>
                {t('requestDetails.confirmCheckIn')}
              </AppText>
              <View style={{height: 5}} />
              <AppText fontSize={theme.c2.size} Tcolor={theme.greyColor}>
                {t('requestDetails.confirmCheckInMessage')}
              </AppText>
            </View>
            <View
              style={{
                width: '100%',
                borderColor: `${theme.greyColor}30`,
                borderWidth: 0.5,
                marginBottom: 0,
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <AppButton
                title={t('common.no')}
                customMargin={0}
                fontSize={theme.s1.size}
                Tcolor={theme.greyColor}
                onPress={handleRejectCheckIn}
                fontWeight={theme.s1.fontWeight}
                style={{
                  height: 40,
                  width: '50%',
                  margin: 0,
                  padding: 0,
                }}
              />
              <AppButton
                title={t('common.yes')}
                Tcolor={theme.primaryColor}
                customMargin={0}
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                onPress={handleCheckIn}
                rounded={false}
                style={{
                  height: 40,
                  borderLeftColor: `${theme.greyColor}30`,
                  borderLeftWidth: 1,
                  borderRadius: 0,
                  width: '50%',
                  margin: 0,
                  padding: 0,
                }}
              />
            </View>
          </CardWithShadow>
        </View>
      </Modal>
    </View>
  );
};

export default ReqDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  checkInModal: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

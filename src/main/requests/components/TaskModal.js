import React, {Fragment, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Modal} from 'react-native-paper'; // use the other modal package instead
import {theme} from '../../../utils/design';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AppText from '../../../components/AppText';
import {useTranslation} from 'react-i18next';
import {Divider} from 'react-native-elements/dist/divider/Divider';
// import moment from 'moment';
import RenderActionButtonsAndStatus, {
  renderActionButtonsAndStatusObj,
} from './RenderActionButtonsAndStatus';
import {CardWithShadow} from '../../../components/CardWithShadow';
import {RequestTypeAsArray} from '../../../utils/constants/RequestType';
import {mngmtHttp} from '../../../utils/http/Http';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {
  CarCleaningSubTypesArray,
  HomeCleaningSubTypesArray,
  IssueTypeAsArray,
} from '../../../utils/constants/IssueType';
import {AlertHelper} from '../../../utils/AlertHelper';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import ImageSlider from './ImageSlider';
import AppImage from '../../../components/AppImage';
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

const TaskModal = ({visible, setVisible, request, navigation, refresh}) => {
  const {t} = useTranslation();
  const role = useSelector(state => state.user.data.role);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false);

  const requestDetails = useQuery(
    `RequestUnitViewDetails`,
    () =>
      mngmtHttp
        .get(`/requests/${request?.id}`)
        .then(response => response.data.data),
    {enabled: request?.id ? true : false},
  );

  useEffect(() => {
    // if (visible) {
    //   setView(true);
    // }
    setView(visible);
  }, [visible]);

  useEffect(() => {
    if (request?.id) {
      requestDetails.refetch();
    }
  }, [request?.id]);

  const updateRequestStatus = (request, newStatus) => {
    setLoading(true);
    if (newStatus === 5) {
      //handleCancelPress();
      setVisible(false);
      setLoading(false);
      return null;
    }
    if (newStatus === 20 || request.status === 20) {
      navigation.navigate('StartRequest', {request: requestDetails.data});
      setLoading(false);
      return null;
    }
    if (!newStatus) {
      setLoading(false);
      return null;
    }
    mngmtHttp
      .put(`/requests/${request.id}/assign-status`, {
        status: newStatus,
      })
      .then(() => {
        setLoading(false);
        setVisible(false);
        AlertHelper.showMessage(
          'success',
          newStatus === 19 ? t('Request Timed-out') : t('alerts.success'),
        );
      })
      .then(() => {
        refresh();
        setVisible(false);
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
      });
  };

  return Object?.keys(request || {})?.length ? (
    <Modal
      transparent={false}
      animationType={'slide'}
      visible={visible}
      style={{
        justifyContent: view ? 'center' : 'flex-end',
      }}
      onDismiss={() => setVisible(false)} // force the user to either accept or reject
      onRequestClose={() => setVisible(false)}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          height: 'auto',
          marginHorizontal: view ? 10 : 0,
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            right: 10,
            zIndex: 100,
            flex: 1,
            paddingVertical: 15,
            paddingRight: 10,
            height: 50,
          }}
          onPress={() => setVisible(false)}>
          <CountdownCircleTimer
            isPlaying
            // duration={300}
            duration={10}
            colors={[theme.primaryColor]}
            colorsTime={[0]}
            onComplete={() => updateRequestStatus(request, 19)}
            size={50}
            strokeWidth={5}>
            {({remainingTime}) => <AppText>{remainingTime}</AppText>}
          </CountdownCircleTimer>
        </TouchableOpacity>

        <View style={{marginVertical: 20}}>
          {view ? (
            <>
              <AppText
                fontWeight={'700'}
                textAlign="left"
                fontSize={theme.titleFontSize}>
                {t('professtional.newTask')}
              </AppText>
              <AppText
                textAlign="left"
                Tcolor={theme.greyColor}
                fontSize={theme.subTitleFontSize}>
                {t('requestsCategories.Maintenance')}
              </AppText>
              <Divider style={{marginVertical: 10}} />
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <AppText textAlign="left" style={{marginVertical: 5}}>
                    {t('requests.requestSubType')}
                  </AppText>
                  <AppText
                    textAlign="left"
                    fontWeight={'700'}
                    fontSize={theme.titleFontSize}>
                    {t(
                      `requestsCategories.${
                        requestDetails.data?.type == 1
                          ? IssueTypeAsArray[requestDetails.data?.subtype - 1]
                          : requestDetails.data?.type == 2
                          ? HomeCleaningSubTypesArray[
                              requestDetails.data?.subtype_category - 1
                            ]
                          : requestDetails.data?.type == 3
                          ? CarCleaningSubTypesArray[
                              requestDetails.data?.subtype_category - 1
                            ]
                          : ''
                      }`,
                    )}
                  </AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText textAlign="left" style={{marginVertical: 5}}>
                    {t('requests.scheduleTime')}
                  </AppText>
                  <AppText
                    textAlign="left"
                    fontWeight={'700'}
                    fontSize={theme.titleFontSize}>
                    {moment(`${request?.date}T${request?.time}:00`).calendar()}
                  </AppText>
                </View>
              </View>
              <Divider style={{marginVertical: 10}} />
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <AppText textAlign="left" style={{marginVertical: 5}}>
                    {t('properties.unit')}
                  </AppText>
                  <AppText
                    textAlign="left"
                    fontWeight={'700'}
                    fontSize={theme.titleFontSize}>
                    {request?.unit?.name}
                  </AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText textAlign="left" style={{marginVertical: 5}}>
                    {t('properties.building')}
                  </AppText>
                  <AppText
                    textAlign="left"
                    fontWeight={'700'}
                    fontSize={theme.titleFontSize}></AppText>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={{height: 50}} />
              <RequestInfoCard
                request={request}
                requestDetails={requestDetails}
                t={t}
                role={role}
              />
              <DescriptionCard
                request={request}
                requestDetails={requestDetails}
                t={t}
                role={role}
              />
              <AttachmentCard
                t={t}
                requestDetails={requestDetails}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                sliderIndex={sliderIndex}
                setSliderIndex={setSliderIndex}
              />
            </>
          )}
          <TouchableOpacity
            onPress={() => setView(!view)}
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <AppText Tcolor={theme.primaryColor}>
              {!view
                ? t('professtional.viewLess')
                : t('professtional.viewMore')}
            </AppText>
            <FontAwesome
              name={!view ? 'arrow-up' : 'arrow-down'}
              color={theme.primaryColor}
            />
          </TouchableOpacity>
          <View style={{marginHorizontal: 10, marginVertical: 10}}>
            <RenderActionButtonsAndStatus
              request={request}
              isLoading={loading}
              isCard={true}
              updateRequestStatus={updateRequestStatus}
            />
          </View>
        </View>
      </View>
    </Modal>
  ) : (
    <View />
  );
};

export default TaskModal;

const RequestInfoCard = ({request, requestDetails, role, t}) => {
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
          {requestDetails?.data?.is_urgent ? (
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
          {t(`${RequestTypeAsArray[requestDetails.data?.type - 1] ?? ''}`)}
        </AppText>
      </View>
      {request.type !== 4 && (
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
                requestDetails.data?.type == 1
                  ? IssueTypeAsArray[requestDetails.data?.subtype - 1]
                  : requestDetails.data?.type == 2
                  ? HomeCleaningSubTypesArray[
                      requestDetails.data?.subtype_category - 1
                    ]
                  : requestDetails.data?.type == 3
                  ? CarCleaningSubTypesArray[
                      requestDetails.data?.subtype_category - 1
                    ]
                  : ''
              }`,
            )}
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

const DescriptionCard = ({request, requestDetails, role, t}) => {
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
const AttachmentCard = ({
  requestDetails,
  isModalVisible,
  sliderIndex,
  setSliderIndex,
  setIsModalVisible,
  t,
}) => {
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

      {!!requestDetails.data?.files?.length ? (
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

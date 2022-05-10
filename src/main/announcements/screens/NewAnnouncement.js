import {yupResolver} from '@hookform/resolvers/yup';
import React, {useCallback, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import {
  I18nManager,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import AppText from '../../../components/AppText';
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../../../components/Header';
import Scrollable from '../../../components/Scrollable';
import WhiteSpace from '../../../components/WhiteSpace';
import _ from 'lodash';
import {HP, theme, WP} from '../../../utils/design';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import UploadButton from '../../../components/UploadButton';
import CalendarInput from '../../../components/CalendarInput';
import TimeInput from '../../../components/TimeInput';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AppButton from '../../../components/AppButton';
import {AlertHelper} from '../../../utils/AlertHelper';
import {mngmtHttp} from '../../../utils/http/Http';
import {Icon} from 'react-native-elements';
import {uploadImage} from '../../../utils/uploadImage';
import {Modal} from 'react-native-paper';
import banner1 from '../../../../assets/images/images/banner-01.png';
import banner2 from '../../../../assets/images/images/banner-02.png';
import banner3 from '../../../../assets/images/images/banner-03.png';
import banner4 from '../../../../assets/images/images/banner-04.png';
import banner5 from '../../../../assets/images/images/banner-05.png';
import banner6 from '../../../../assets/images/images/banner-06.png';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {setLoading} from '../../../redux/misc';

const moment = require('moment');

const NewAnnouncement = ({navigation}) => {
  const {t} = useTranslation();
  const [bannerOptions, setBannerOptions] = useState('Yes');
  const [notifyOptions, setNotifyOptions] = useState('');
  const [notifyUsers, setNotifyUsers] = useState([]);
  const [allUser, setAllUser] = useState(false);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [media, setMedia] = useState([]);
  const [customErrors, setCustomErrors] = useState({});

  const getUserType = type => {
    switch (type) {
      case 'MANAGER':
        return 'MANAGEMENT';
      case 'TENANT':
        return 'CUSTOMER';
      case 'PROFESSIONAL':
        return 'MAINTENANCE';
      default:
        return '';
    }
  };

  const query = useQuery(`NewAnnouncement-Contact-${notifyOptions}`, () =>
    mngmtHttp
      .get(`/contacts/lite-list?role=${getUserType(notifyOptions)}`)
      .then(response => response.data.data),
  );

  const allContacts = useQuery(`NewAnnouncement-AllContacts`, () =>
    mngmtHttp.get(`/contacts/lite-list`).then(response => response.data.data),
  );

  const announcementSchema = yup.object().shape({
    title: yup.string().required('Title required'),
    details: yup.string().required('Details required'),
    location: yup.string().required('Location required'),
    start_date: yup.string().required('Start date required'),
    end_date: yup.string().required('End date required'),
    start_time: yup.string().required('Start time required'),
    end_time: yup.string().required('End time required'),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      details: '',
      location: '',
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
    },
    resolver: yupResolver(announcementSchema),
  });

  const getBlob = useCallback(image => {
    const imgUri = Image.resolveAssetSource(image);
    return imgUri;
  }, []);

  const attachMedia = async () => {
    ImagePicker.openPicker({
      multiple: true,
      compressImageQuality: 0.8,
      maxFiles: 5 - media.length,
    })
      .then(async image => {
        if (image) {
          setMedia(image);
        }
      })
      .catch(e => console.log(e));
  };

  const submit = async data => {
    if(!allUser && !notifyOptions){
      return AlertHelper.showMessage('error', t('newAnnouncement.errors.notifyOptions'));
    }
    if(!toggle && !allUser && !notifyUsers?.length){
      return AlertHelper.showMessage('error', t('newAnnouncement.errors.notifyUsers'));
    }
    dispatch(setLoading(true));
    let body = {
      ...data,
      is_visible: '1',
      organized_by: 'XYZ',
      notified_users: allUser
        ? allContacts.data.map(x => x.id)
        : toggle
        ? query.data.map(x => x.id)
        : notifyUsers.length
        ? notifyUsers.map(users => users.id)
        : null,
      notify: allUser
        ? '1'
        : notifyOptions === 'MANAGER'
        ? '2'
        : notifyOptions === 'TENANT'
        ? '3'
        : '4',
      notify_type: '1',
      notify_custom_type: '',
      description: data.details,
      start_date: moment(data.start_date).format('YYYY-MM-DD'),
      end_date: moment(data.end_date).format('YYYY-MM-DD'),
      start_time: moment(data.start_time).format('HH:mm'),
      end_time: moment(data.end_time).format('HH:mm'),
    };
    try {
      await mngmtHttp
        .post('/announcement', body)
        .then(response => {
          if (media?.length || bannerImages?.length) {
            uploadImage(
              bannerImages.length
                ? bannerImages.map(x => ({...getBlob(x)}))
                : media,
              _.toLower('Announcement'),
              response.data.data.id,
              () => {
                AlertHelper.showMessage('success', t('alerts.success'));
                dispatch(setLoading(false));
                navigation.goBack();
              },
            );
          } else {
            AlertHelper.showMessage('success', t('alerts.success'));
            dispatch(setLoading(false));
            navigation.goBack();
          }
        })
        .catch(e => console.log(e.response));
    } catch (error) {
      console.log(error.response);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      AlertHelper.show('error', t('common.error'), error);
      dispatch(setLoading(false));
    }
  };

  const bannerArray = [
    {
      id: 1,
      image: banner1,
    },
    {
      id: 2,
      image: banner2,
    },
    {
      id: 3,
      image: banner3,
    },
    {
      id: 4,
      image: banner4,
    },
    {
      id: 5,
      image: banner5,
    },
    {
      id: 6,
      image: banner6,
    },
  ];

  return (
    <>
      <Scrollable>
        <Header name={t('newAnnouncement.title')} navigation={navigation} />
        <ScrollView style={styles.container}>
          <View style={{flex: 0.9}}>
            <WhiteSpace variant={1} />
            <AppText
              textAlign="left"
              style={styles.labelSpacing}
              fontSize={theme.titleFontSize}
              Tcolor={theme.blackColor}
              fontWeight={'600'}>
              {t('newAnnouncement.generalInformation')}
            </AppText>
            <WhiteSpace variant={1} />
            <AppTextInputController
              name="title"
              control={control}
              autoCapitalize="sentences"
              placeholder={t('newAnnouncement.formRequest.title')}
              placeholderTextColor={theme.greyColor}
              returnKeyType={'go'}
              required={true}
              customHeight={30}
              error={errors.title}
              // onSubmitEditing={handleSubmit(submit)}
              onSubmitEditing={null}
              style={{
                marginVertical: 10,
                marginHorizontal: 20,
                borderRadius: 5,
                borderColor: theme.greyColor,
                fontSize: 14,
                ...Platform.select({
                  android: {padding: 0},
                }),
              }}
              keyboardType={'default'}
            />
            <WhiteSpace variant={1} />
            <AppTextInputController
              name="details"
              control={control}
              multiline={true}
              autoCapitalize="sentences"
              placeholder={t('newAnnouncement.formRequest.details')}
              placeholderTextColor={theme.greyColor}
              returnKeyType={'go'}
              required={true}
              customHeight={100}
              // onSubmitEditing={handleSubmit(submit)}
              error={errors.details}
              onSubmitEditing={null}
              style={{
                marginVertical: 10,
                marginHorizontal: 20,
                borderRadius: 5,
                borderColor: theme.greyColor,
                fontSize: 14,
                ...Platform.select({
                  android: {padding: 0},
                }),
              }}
              keyboardType={'default'}
            />
            <WhiteSpace variant={1} />
            <AppTextInputController
              name="location"
              control={control}
              autoCapitalize="sentences"
              placeholder={t('newAnnouncement.formRequest.location')}
              placeholderTextColor={theme.greyColor}
              returnKeyType={'go'}
              required={true}
              customHeight={30}
              error={errors.location}
              onSubmitEditing={handleSubmit(submit)}
              style={{
                marginVertical: 10,
                marginHorizontal: 20,
                borderRadius: 5,
                borderColor: theme.greyColor,
                fontSize: 14,
                ...Platform.select({
                  android: {padding: 0},
                }),
              }}
              keyboardType={'default'}
            />
            <WhiteSpace variant={1} />
            <AppText
              textAlign="left"
              style={styles.labelSpacing}
              fontSize={theme.titleFontSize}
              Tcolor={theme.blackColor}
              fontWeight={'600'}>
              {t('newAnnouncement.banner')}
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                marginHorizontal: 20,
                marginVertical: 10,
                // justifyContent: 'space-evenly',
                // backgroundColor: 'pink',
              }}>
              <RadioController
                title={t('common.yes')}
                name="Yes"
                type={bannerOptions}
                setType={type => setBannerOptions(type)}
              />
              <RadioController
                title={t('common.no')}
                name="No"
                type={bannerOptions}
                setType={type => setBannerOptions(type)}
                marginLeft={10}
              />
            </View>
            {bannerOptions === 'Yes' && (
              <>
                <View style={styles.infoContainer}>
                  <AppText
                    regular={true}
                    fontSize={9}
                    textAlign={'left'}
                    Tcolor={theme.blackColor}
                    fontWeight={theme.c1.fontWeight}>
                    {t('newAnnouncement.info')}
                  </AppText>
                </View>
                <WhiteSpace variant={1} />
                {!media.length && !bannerImages.length && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 10,
                        marginVertical: 10,
                        alignItems: 'center',
                      }}>
                      <AppText
                        fontSize={theme.subTitleFontSize}
                        Tcolor={theme.greyColor}
                        textAlign="left">
                        {t('common.addImage')}
                      </AppText>
                      {/* <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsVisible(true)}>
                        <AppText
                          fontSize={theme.subTitleFontSize}
                          Tcolor={theme.primaryColor}
                          textAlign="right">
                          <FontAwesome5Icon name="pen" /> Customise Banner
                        </AppText>
                      </TouchableOpacity> */}
                    </View>
                    <UploadButton
                      onPress={attachMedia}
                      hideLabel={true}
                      media={media}
                    />
                  </>
                )}

                {(media || bannerImages) && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginHorizontal: 10,
                    }}>
                    {(bannerImages.length ? bannerImages : media).map(
                      (m, idx) => {
                        return (
                          <View
                            key={m?.path}
                            style={{
                              alignSelf: 'center',
                              borderColor: '#eeeeee',
                              borderWidth: 1,
                              borderRadius: 8,
                              marginHorizontal: 10,
                              marginVertical: 5,
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                if (bannerImages.length) {
                                  const filterd = bannerImages.filter(
                                    item => m.path !== item.path,
                                  );

                                  setBannerImages(filterd);
                                } else {
                                  const filterd = media.filter(
                                    item => m.path !== item.path,
                                  );

                                  setMedia(filterd);
                                }
                              }}
                              style={{
                                backgroundColor: '#f56767',
                                width: 26,
                                height: 26,
                                borderRadius: 13,
                                top: -10,
                                right: -10,
                                zIndex: 1,
                                position: 'absolute',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Icon
                                name={'delete'}
                                color={'#ffffff'}
                                size={16}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                if (bannerImages.length) {
                                  const filterd = bannerImages.filter(
                                    item => m.path !== item.path,
                                  );

                                  setBannerImages(filterd);
                                } else {
                                  const filterd = media.filter(
                                    item => m.path !== item.path,
                                  );

                                  setMedia(filterd);
                                }
                              }}>
                              <Image
                                resizeMode={'contain'}
                                style={{
                                  height: 70,
                                  width: 70,
                                }}
                                source={{
                                  uri: bannerImages.length
                                    ? getBlob(m)?.uri
                                    : m?.path,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      },
                    )}
                  </View>
                )}
                <WhiteSpace variant={1} />
              </>
            )}
            <AppText
              textAlign="left"
              style={styles.labelSpacing}
              fontSize={theme.titleFontSize}
              Tcolor={theme.blackColor}
              fontWeight={'600'}>
              {t('newAnnouncement.date&time')}
            </AppText>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <CalendarInput
                title={t('newAnnouncement.formRequest.startDate')}
                half
                value={control._formValues.start_date}
                onChangeText={date => {
                  //setDates({ ...dates, start: date });
                  setValue('start_date', date, {shouldValidate: true});
                }}
              />
              <TimeInput
                title={t('newAnnouncement.formRequest.startTime')}
                half
                value={control._formValues.start_time}
                onChangeText={date => {
                  //setTime({ ...time, start: date });
                  setValue('start_time', date, {shouldValidate: true});
                }}
              />
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <CalendarInput
                title={t('newAnnouncement.formRequest.endDate')}
                half
                value={control._formValues.end_date}
                onChangeText={date => {
                  setValue('end_date', date, {shouldValidate: true});
                }}
              />
              <TimeInput
                title={t('newAnnouncement.formRequest.endTime')}
                half
                value={control._formValues.end_time}
                onChangeText={date => {
                  setValue('end_time', date, {shouldValidate: true});
                }}
              />
            </View>
            <View style={{height: 10}} />

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText
                textAlign="left"
                style={styles.labelSpacing}
                fontSize={theme.titleFontSize}
                Tcolor={theme.blackColor}
                fontWeight={'600'}>
                {t('newAnnouncement.notify')}
              </AppText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                }}>
                <AppText
                  textAlign="left"
                  style={[styles.labelSpacing, {paddingHorizontal: 0}]}
                  fontSize={theme.c1.fontSize}
                  Tcolor={theme.blackColor}
                  fontWeight={theme.c1.fontWeight}>
                  {t('newAnnouncement.allUser')}
                </AppText>
                <Switch
                  style={{transform: [{scaleX: 0.5}, {scaleY: 0.5}]}}
                  trackColor={{false: '#767577', true: theme.primaryColor}}
                  thumbColor={allUser ? theme.whiteColor : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setAllUser(!allUser)}
                  value={allUser}
                />
              </View>
            </View>
          </View>
          {!allUser && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                  marginRight: 30,
                  marginVertical: 20,
                  justifyContent: 'space-between',
                  // backgroundColor: 'pink',
                  marginHorizontal: 20,
                }}>
                <RadioController
                  title={'Manager'}
                  name="MANAGER"
                  type={notifyOptions}
                  setType={type => setNotifyOptions(type)}
                />
                <RadioController
                  title={'Tenant'}
                  name="TENANT"
                  type={notifyOptions}
                  setType={type => setNotifyOptions(type)}
                  marginLeft={8}
                />
                <RadioController
                  title={'Professional'}
                  name="PROFESSIONAL"
                  type={notifyOptions}
                  setType={type => setNotifyOptions(type)}
                  marginLeft={8}
                />
              </View>

              {notifyOptions ? (
                <>
                  <View style={{height: 10}} />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('SelectUsers', {
                        name:
                          notifyOptions === 'MANAGER'
                            ? t('newAnnouncement.manager')
                            : notifyOptions === 'TENANT'
                            ? t('newAnnouncement.tenant')
                            : t('newAnnouncement.professional'),
                        onSelect: item => {
                          setToggle(item.toggle);
                          setNotifyUsers(item.users);
                        },
                        users: notifyUsers,
                        toggle,
                      })
                    }
                    style={styles.selectUserStyles}>
                    <View
                      style={{flex: 0.8, marginHorizontal: 20}}
                      pointerEvents="none">
                      <Text
                        style={{
                          color: theme.blackColor,
                          textAlign: I18nManager.isRTL ? 'right' : 'left',
                        }}
                        placeholderTextColor={theme.blackColor}
                        editable={false}
                        // placeholder=
                      >
                        Select{' '}
                        {notifyOptions === 'MANAGER'
                          ? t('newAnnouncement.manager')
                          : notifyOptions === 'TENANT'
                          ? t('newAnnouncement.tenant')
                          : t('newAnnouncement.professional')}
                      </Text>
                    </View>
                    <View style={{flex: 0.1}}>
                      <FontAwesome5Icon
                        name={'chevron-right'}
                        color={theme.greyColor}
                        size={theme.iconSize - 2}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
            </View>
          )}
          <View style={{height: 10}} />
          <AppButton
            title="Save"
            Bcolor={theme.primaryColor}
            rounded={5}
            onPress={handleSubmit(submit)}
            Tcolor={theme.whiteColor}
          />
          <View style={{height: 20}} />
        </ScrollView>
      </Scrollable>
      <Modal
        animationType={'slide-in'}
        visible={isVisible}
        style={styles.modalStyle}>
        <View style={styles.modalContainer}>
          <View style={styles.bannerSubContainer}>
            <View>
              <AppText
                fontWeight={'600'}
                fontSize={theme.titleFontSize}
                textAlign="left">
                {t('newAnnouncement.customiseBanner')}
              </AppText>
              <AppText
                fontSize={theme.subTitleFontSize - 3}
                textAlign="left"
                Tcolor={theme.greyColor}>
                {t('newAnnouncement.bannerInfo')}
              </AppText>
            </View>
            <FontAwesome5Icon
              name={'times-circle'}
              onPress={() => setIsVisible(false)}
              size={theme.iconSize}
              style={{opacity: 0.1}}
            />
          </View>
          <FlatList
            numColumns={3}
            data={bannerArray}
            renderItem={(item, index) => (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  if (!bannerImages.includes(item.item.image)) {
                    setBannerImages([...bannerImages, item.item.image]);
                  } else {
                    setBannerImages(
                      bannerImages.filter(x => x !== item.item.image),
                    );
                  }
                }}>
                <Image
                  source={item.item.image}
                  style={styles.bannerImageStyle}
                />
                {bannerImages.includes(item.item.image) && (
                  <View style={styles.check}>
                    <FontAwesome5Icon name="check" />
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 20,
              justifyContent: 'space-between',
            }}>
            <AppButton
              title="Cancel"
              half
              onPress={() => setIsVisible(false)}
              rounded={8}
              customMargin={0}
              Bcolor={theme.whiteColor}
              Tcolor={theme.primaryColor}
              style={{
                borderColor: theme.primaryColor,
                borderWidth: 1,
              }}
            />
            <AppButton
              title="Save"
              half
              onPress={() => setIsVisible(false)}
              customMargin={0}
              rounded={8}
              Bcolor={theme.primaryColor}
              Tcolor={theme.whiteColor}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NewAnnouncement;

const RadioController = ({setType, type, name, title, marginLeft = 0}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        setType(name);
      }}
      style={[styles.radioContainer, {marginLeft: marginLeft}]}>
      <View
        style={{
          borderRadius: 50,
          borderWidth: 1,
          borderColor: type === name ? theme.primaryColor : '#ddd',
          backgroundColor:
            type === name ? theme.primaryColor : theme.whiteColor,
          width: 15,
          height: 15,
          marginRight: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <AppText
        regular
        fontSize={theme.p2.size}
        fontWeight={theme.p2.fontWeight}
        Tcolor={theme.blackColor}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: `${theme.primaryColor}20`,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
  },
  selectUserStyles: {
    flexDirection: 'row',
    height: 45,
    width: WP('90'),
    borderWidth: 0.25,
    borderColor: theme.primaryColor,
    borderRadius: 8,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.whiteColor,
  },
  check: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    top: 20,
    right: 20,
  },
  radioContainer: {
    width: '25%',
    flex: 1,
    height: 45,
    backgroundColor: theme.whiteColor,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  modalStyle: {
    position: 'relative',
    margin: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    shadowOpacity: 0,
    elevation: 0,
    margin: 0,
    marginBottom: HP(-5),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: HP(50),
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: 'white',
  },
  bannerSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bannerImageStyle: {
    width: WP(25),
    marginHorizontal: 10,
    marginVertical: 10,
    height: HP(10),
  },
  labelSpacing: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  btnContainer: {
    // flex: 1,
    justifyContent: 'flex-start',
  },
  body1: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  body2: {
    // flex: 0.2,
    justifyContent: 'center',
  },
  radioContainer: {
    // width: '25%',
    flex: 1,
    height: 45,
    backgroundColor: theme.whiteColor,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

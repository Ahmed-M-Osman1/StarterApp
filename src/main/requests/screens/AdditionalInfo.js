import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import Header from '../../../components/Header';
import WhiteSpace from '../../../components/WhiteSpace';
import AppButton from '../../../components/AppButton';
import Scrollable from '../../../components/Scrollable';
import AppText from '../../../components/AppText';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import {Admin, Management} from '../../../utils/constants/Role';
import AppCheckBox from '../../../components/AppCheckBox';
import ImageSlider from '../components/ImageSlider';
import {AlertHelper} from '../../../utils/AlertHelper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const AdditionalInfo = ({route, navigation}) => {
  const {type, subtype, imgUri} = route.params;
  const {t} = useTranslation();
  const ref = useRef([]);
  const role = useSelector(state => state.user.data.role);
  let categoryListArr = [];
  let furnitureCategoryListArr = [];

  // let carCleaningArr = CarCleaningSubTypesArray.map((item, index) => ({
  //   id: index + 1,
  //   name: item,
  // }));

  const listOfAvailableRequestCategories = useQuery(
    'listOfAvailableRequestCategories',
    () =>
      mngmtHttp
        .get(`/request-category`)
        .then(resp => resp.data)
        .catch(e => console.log(e)),
  );

  let homeCleaningArr = listOfAvailableRequestCategories?.data?.data
    ?.find(c => c.code === type)
    ?.subCategories.filter(c => !!c.active_service)
    .map(c => ({...c, id: c.code}));

  let carCleaningArr = listOfAvailableRequestCategories?.data?.data
    ?.find(c => c.code === type)
    ?.subCategories.filter(c => !!c.active_service)
    .map(c => ({...c, id: c.code}));
  const [media, setMedia] = useState([]);
  const [unitCommunityOrBuilding, setUnitCommunityOrBuilding] = useState(
    'UNIT',
  );
  const [isUrgent, setIsUrgent] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttachmentModalVisible, setIsAttachmentModalVisible] = useState(
    false,
  );
  const [sliderIndex, setSliderIndex] = useState(0);

  const unitQuery = useQuery(`ListOfUnitsInRequest`, () =>
    role != Management && role != Admin
      ? mngmtHttp
          .get(`/dashboard/my-units`)
          .then(response => response.data.data)
      : mngmtHttp
          .get(`/single-units/lite-list`)
          .then(response => response.data.data),
  );

  // const buildingQuery = useQuery(`ListOfBuildingInRequest`, () =>
  //   role == Management || role == Admin
  //     ? mngmtHttp
  //         .get(`/multi-units/lite-list`)
  //         .then(response => response.data.data)
  //     : null,
  // );
  // const communityQuery = useQuery(`ListOfCommunityInRequest`, () =>
  //   role == Management || role == Admin
  //     ? mngmtHttp
  //         .get(`/complexes/lite-list`)
  //         .then(response => response.data.data)
  //     : null,
  // );

  const categoryListQuery = useQuery(`ListOfCategoryInRequest`, () =>
    subtype == 6
      ? mngmtHttp
          .get(`/requests/sub-categories?category=appliance`)
          .then(response => response.data.data)
      : null,
  );

  if (categoryListQuery?.data) {
    let dataArr = categoryListQuery?.data;
    categoryListArr = [];
    for (key in dataArr) {
      categoryListArr.push({
        id: key,
        name: dataArr[key],
      });
    }
  }

  const furnitureCategoryListQuery = useQuery(
    `ListOfFurnitureCategoryInRequest`,
    () =>
      subtype == 7
        ? mngmtHttp
            .get(`/requests/sub-categories?category=furniture`)
            .then(response => response.data.data)
        : null,
  );

  if (furnitureCategoryListQuery?.data) {
    let dataArr = furnitureCategoryListQuery?.data;
    furnitureCategoryListArr = [];
    for (key in dataArr) {
      furnitureCategoryListArr.push({
        id: key,
        name: dataArr[key],
      });
    }
  }
  const carSchema = yup.object().shape({
    car_model: yup.string().required(t('newRequest.errorModel')),
    car_plate: yup.string().required(t('newRequest.errorPlate')),
    car_color: yup.string().required(t('newRequest.errorColor')),
  });

  const carUnitSchema = yup.object().shape({
    car_model: yup.string().required(t('newRequest.errorModel')),
    car_plate: yup.string().required(t('newRequest.errorPlate')),
    car_color: yup.string().required(t('newRequest.errorColor')),
    subtype_category: yup.string().required(t('newRequest.errorCarType')),
    model_id: yup.string().required(t('newRequest.errorUnit')),
    description: yup.string().required(t('complaint.errorDescription')),
  });

  const unitCleaningSchema = yup.object().shape({
    model_id: yup.string().required(t('newRequest.errorUnit')),
    subtype_category: yup.string().required(t('newRequest.errorCategory')),
    description: yup.string().required(t('complaint.errorDescription')),
  });
  const unitSchema = yup.object().shape({
    model_id: yup.string().required(t('newRequest.errorUnit')),
    // subtype_category: yup.string().required(t('newRequest.errorCategory')),
    description: yup.string().required(t('complaint.errorDescription')),
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      model_id: '',
      description: '',
      car_model: '',
      car_color: '',
      car_plate: '',
      subtype_category: '',
    },
    resolver:
      type == 3
        ? yupResolver(carUnitSchema)
        : type === 2
        ? yupResolver(unitCleaningSchema)
        : yupResolver(unitSchema),
  });
  //
  const submit = data => {
    navigation.navigate('ReqTimeDate', {
      data: {...data, model_type: unitCommunityOrBuilding, is_urgent: isUrgent},
      type: type,
      subtype: subtype ?? watch('subtype_category'),
      media: media,
    });
  };

  const openGallery = () => {
    media.length >= 5
      ? AlertHelper.showMessage('info', t('requests.maxAttachMediaMessage'))
      : ImagePicker.openPicker({
          compressImageQuality: 0.8,
          multiple: true,
          maxFiles: 5 - media.length,
        })
          .then(async image => {
            if (image) {
              setMedia([...media, ...image]);
            }
          })
          .catch(e => console.log(e))
          .finally(() => setIsAttachmentModalVisible(false));
  };
  const openCamera = () => {
    media.length >= 5
      ? AlertHelper.showMessage('info', t('requests.maxAttachMediaMessage'))
      : ImagePicker.openCamera({
          compressImageQuality: 0.8,
        })
          .then(async image => {
            if (image) {
              setMedia([...media, image]);
            }
          })
          .catch(e => console.log(e))
          .finally(() => setIsAttachmentModalVisible(false));
  };

  const attachMedia = async () => {
    setIsAttachmentModalVisible(true);
  };

  useEffect(() => {
    setValue('model_id', '');
  }, [unitCommunityOrBuilding]);

  return (
    <Scrollable>
      <Header name={t('newRequest.title')} navigation={navigation} />
      <ScrollView>
        <View style={styles.body1}>
          <WhiteSpace variant={1} />
          <AppText fontSize={theme.titleFontSize} Tcolor={theme.primaryColor}>
            {t('formRequest.message')}
          </AppText>
          <WhiteSpace variant={1} />
          {unitQuery?.data && (
            <AppDropDownController
              placeholder={t(
                unitCommunityOrBuilding === 'UNIT'
                  ? 'properties.unit'
                  : unitCommunityOrBuilding === 'BUILDING'
                  ? 'properties.building'
                  : 'properties.community',
              )}
              data={
                unitCommunityOrBuilding === 'UNIT'
                  ? unitQuery
                  : unitCommunityOrBuilding === 'BUILDING'
                  ? buildingQuery
                  : communityQuery
              }
              error={errors.model_id}
              control={control}
              name="model_id"
            />
          )}
          {subtype == 6 && (
            <AppDropDownController
              placeholder={t('properties.category')}
              data={{data: categoryListArr}}
              control={control}
              error={errors.subtype_category}
              name="subtype_category"
            />
          )}
          {subtype == 7 && (
            <AppDropDownController
              placeholder={t('properties.category')}
              data={{data: furnitureCategoryListArr}}
              control={control}
              name="subtype_category"
              error={errors.subtype_category}
            />
          )}
          {type == 2 && (
            <AppDropDownController
              placeholder={t('properties.selectType')}
              data={{data: homeCleaningArr}}
              control={control}
              error={errors.subtype_category}
              name="subtype_category"
            />
          )}
          {type !== 3 ? (
            <AppCheckBox
              text={t('requests.isUrgent')}
              state={[isUrgent, setIsUrgent]}
              hideDivider
              textStyle={{
                fontSize: theme.p1.size,
                fontWeight: theme.p1.fontWeight,
                color: theme.blackColor,
              }}
            />
          ) : (
            <View style={{height: 10}} />
          )}
          {type != 3 ? (
            <AppTextInputController
              multiline={true}
              name="description"
              control={control}
              placeholder={t('formRequest.description')}
              placeholderTextColor={theme.greyColor}
              returnKeyType={'go'}
              customHeight={100}
              error={errors.description}
              onSubmitEditing={handleSubmit(submit)}
              style={{
                marginVertical: 10,
                marginHorizontal: 20,
                borderRadius: 5,
                borderColor: theme.greyColor,
                fontSize: 14,
              }}
              keyboardType={'default'}
            />
          ) : (
            <>
              <AppDropDownController
                placeholder={t('properties.car_cleaning')}
                data={{data: carCleaningArr}}
                control={control}
                name="subtype_category"
                error={errors.subtype_category}
              />
              <AppCheckBox
                text={t('requests.isUrgent')}
                state={[isUrgent, setIsUrgent]}
                hideDivider
                textStyle={{
                  fontSize: theme.p1.size,
                  fontWeight: theme.p1.fontWeight,
                  color: theme.blackColor,
                }}
              />
              <AppTextInputController
                name="car_model"
                control={control}
                keyboardType={'default'}
                placeholder={t('newRequest.model')}
                error={errors.car_model}
                style={{height: 45}}
                textColor={theme.blackColor}
                backgroundColor={'#ffffff10'}
                placeholderTextColor={theme.greyColor}
                onSubmitEditing={() => {
                  ref.current[0].focus();
                }}
              />
              <WhiteSpace variant={0.5} />
              <AppTextInputController
                ref={input => (ref.current[0] = input)}
                name="car_color"
                control={control}
                keyboardType={'default'}
                placeholder={t('newRequest.color')}
                error={errors.car_color}
                style={{height: 45}}
                textColor={theme.blackColor}
                backgroundColor={'#ffffff10'}
                placeholderTextColor={theme.greyColor}
                onSubmitEditing={() => {
                  ref.current[1].focus();
                }}
              />
              <AppTextInputController
                ref={input => (ref.current[1] = input)}
                name="car_plate"
                keyboardType={'default'}
                control={control}
                placeholder={t('newRequest.plate')}
                error={errors.car_plate}
                style={{height: 45}}
                textColor={theme.blackColor}
                backgroundColor={'#ffffff10'}
                placeholderTextColor={theme.greyColor}
                onSubmitEditing={() => handleSubmit(submit)}
              />

              <AppTextInputController
                multiline={true}
                name="description"
                control={control}
                placeholder={t('formRequest.description')}
                placeholderTextColor={theme.greyColor}
                returnKeyType={'go'}
                customHeight={100}
                error={errors.description}
                onSubmitEditing={handleSubmit(submit)}
                style={{
                  marginVertical: 10,
                  marginHorizontal: 20,
                  borderRadius: 5,
                  borderColor: theme.greyColor,
                  fontSize: 14,
                }}
                keyboardType={'default'}
              />
            </>
          )}

          {(media.length || imgUri) && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: 10,
              }}>
              {media.map((m, idx) => {
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
                        const filterd = media.filter(
                          item => m.path !== item.path,
                        );
                        setMedia(filterd);
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
                      <Icon name={'delete'} color={'#ffffff'} size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSliderIndex(idx);
                        setIsModalVisible(true);
                      }}>
                      <Image
                        resizeMode={'contain'}
                        style={{
                          height: 70,
                          width: 70,
                        }}
                        source={{uri: imgUri?.uri || m?.path}}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View
                style={{
                  alignSelf: 'center',
                  borderColor: '#eeeeee',
                  borderWidth: 1,
                  borderRadius: 8,
                  marginHorizontal: 10,
                  marginVertical: 5,
                }}>
                <TouchableOpacity onPress={attachMedia}>
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderColor: '#eeeeee',
                      borderWidth: 1,
                      borderRadius: 8,
                      backgroundColor: theme.whiteColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name={'add'} color={'#dddddd'} size={50} />
                  </View>
                </TouchableOpacity>
              </View>
              <ImageSlider
                media={media}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                imageIndex={sliderIndex}
              />
            </View>
          )}

          {!media.length && (
            <TouchableOpacity
              onPress={attachMedia}
              style={{marginHorizontal: 20}}>
              <View style={styles.attachBox}>
                <Icon
                  name={'add-photo-alternate'}
                  color={theme.greyColor}
                  size={60}
                />

                <AppText
                  regular
                  fontSize={theme.p2.size}
                  fontWeight={theme.p2.fontWeight}
                  Tcolor={theme.greyColor}
                  textAlign={'center'}>
                  {t('requests.requestCompleteImageBox')}
                </AppText>
                <View style={styles.attachImageBtn}>
                  <AppText
                    regular
                    fontSize={theme.subTitleFontSize}
                    Tcolor={theme.primaryColor}
                    textAlign={'center'}>
                    {t('requests.requestCompleteButton')}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.body2}>
        <AppButton
          title={t('formRequest.submit')}
          onPress={handleSubmit(submit)}
          rounded={8}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
        />
        <WhiteSpace variant={1} />
      </View>
      <Modal
        // animated={'slide'}
        visible={isAttachmentModalVisible}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
        onBackdropPress={() => setIsAttachmentModalVisible(false)}
        onSwipeComplete={() => setIsAttachmentModalVisible(false)}
        style={{
          margin: 0,
          backgroundColor: 'rgba(51, 51, 51, 0.7)',
          justifyContent: 'flex-end',
        }}
        //
      >
        <View style={{justifyContent: 'flex-end'}}>
          <View
            style={{
              height: 100,
              backgroundColor: '#fff',
              marginHorizontal: 20,
              marginBottom: 20,
              borderRadius: 12,
            }}>
            <Pressable
              onPress={() => openCamera()}
              activeOpacity={0.7}
              style={{
                height: 50,
                // alignContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: '#ddd',
                borderBottomWidth: 1,
                paddingHorizontal: 20,
              }}>
              <Icon
                name={'camera-alt'}
                color={theme.primaryColor}
                size={theme.h5.size}
              />
              <View style={{width: 10}} />
              <AppText
                // key={step}
                regular={true}
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t(`attachImage.takePhoto`)}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => openGallery()}
              activeOpacity={0.7}
              style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}>
              <Icon
                name={'photo'}
                color={theme.primaryColor}
                size={theme.h5.size}
              />
              <View style={{width: 10}} />
              <AppText
                // key={step}
                regular={true}
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t(
                  Platform.OS === 'ios'
                    ? `attachImage.selectFromLibrary`
                    : `attachImage.selectFromGallery`,
                )}
              </AppText>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              marginHorizontal: 20,
              marginBottom: 30,
              borderRadius: 12,
            }}>
            <Pressable
              onPress={() => setIsAttachmentModalVisible(false)}
              activeOpacity={0.7}
              style={{
                height: 50,
                // alignContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                justifyContent: 'center',
              }}>
              <AppText
                regular={true}
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                Tcolor={theme.primaryColor}
                textAlign={'left'}>
                {t(`common.cancel`)}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Scrollable>
  );
};

export default AdditionalInfo;

const styles = StyleSheet.create({
  body1: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  body2: {
    // flex: 0.2,
    justifyContent: 'center',
  },
  attachBox: {
    width: '100%',
    height: 220,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: `${theme.primaryColor}30`,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
  attachImageBtn: {
    backgroundColor: `${theme.primaryColor}20`,
    height: 30,
    justifyContent: 'center',
    borderRadius: 5,
  },
});

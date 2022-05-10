import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {Divider} from 'react-native-elements';
import * as yup from 'yup';
import TwoButton from '../components/TwoButton';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import Scrollable from '../../../components/Scrollable';
import WhiteSpace from '../../../components/WhiteSpace';
import UploadButton from '../../../components/UploadButton';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import DistrictSelectController from '../../../components/controlled/DistrictSelectController';
import IncrementalButtonController from '../../../components/controlled/IncrementalButtonController';
import AppButtonGroupTitleController from '../../../components/controlled/AppButtonGroupTitleController';
import useCities from '../../../utils/hooks/useCities';
import {theme, HP, WP} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import {Years} from '../../../utils/constants/Years';
import {uploadImage} from '../../../utils/uploadImage';
import {AlertHelper} from '../../../utils/AlertHelper';
import {List} from 'react-native-paper';
import {
  APARTMENT,
  commercialNumberTypes,
  commercialTypes,
  LAND,
  OFFICE,
  residentialNumberTypes,
  residentialTypes,
  RETAIL,
  VILLA,
  WAREHOUSE,
  WORKSHOP,
} from '../../../utils/constants/UnitType';

const NewUnitForm = ({navigation, route}) => {
  const {t} = useTranslation();
  const {
    type,
    sub_type,
    oldProperty,
    parent,
    propertyType,
    fromParent,
  } = route.params;
  const cities = useCities();
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeId, setActiveId] = useState({id: 0, id2: 0});
  const [subType, setSubType] = useState(
    type === 1
      ? residentialNumberTypes[sub_type ?? 1]
      : commercialNumberTypes[sub_type ?? 3],
  );

  const commercialSchema = yup.object().shape({
    name: yup.string().required(t('owner.errorName')),
    // year_built: yup.string().required(t('newPropertyForm.errorYear')),
    city: yup.object().shape({
      id: yup.string().required(t('newPropertyForm.errorCity')),
    }),
    // district: yup.object().shape({
    //   id: yup.string().required(t('newPropertyForm.errorDistrict')),
    // }),
    // area: yup.string().required(t('newPropertyForm.errorArea')),
    // electricity_meter_number: yup
    //   .string()
    //   .required(t('newPropertyForm.errorElectricity_meter_number')),
    // water_meter_number: yup
    //   .string()
    //   .required(t('newPropertyForm.errorWater_meter_number')),
  });

  const commercialLandSchema = yup.object().shape({
    name: yup.string().required(t('owner.errorName')),
    city: yup.object().shape({
      id: yup.string().required(t('newPropertyForm.errorCity')),
    }),
    // district: yup.object().shape({
    //   id: yup.string().required(t('newPropertyForm.errorDistrict')),
    // }),
  });

  const residentialSchema = yup.object().shape({
    name: yup.string().required(t('owner.errorName')),
    // year_built: yup.string().required(t('owner.errorName')),
    city: yup.object().shape({
      id: yup.string().required(t('newPropertyForm.errorCity')),
    }),
    // district: yup.object().shape({
    //   id: yup.string().required(t('newPropertyForm.errorDistrict')),
    // }),
    // area: yup.string().required(t('newPropertyForm.errorArea')),
    // electricity_meter_number: yup
    //   .string()
    //   .required(t('newPropertyForm.errorElectricity_meter_number')),
    // water_meter_number: yup
    //   .string()
    //   .required(t('newPropertyForm.errorWater_meter_number')),
    // bedrooms: yup.number().integer().min(1, 'Bedrooms required').required(),
    // bathrooms: yup.number().integer().min(1, 'Bathrooms required').required(),
    // guest_rooms: yup
    //   .number()
    //   .integer()
    //   .min(1, 'Guest Rooms required')
    //   .required(),
    // lounges: yup.number().integer().min(1, 'Lounges required').required(),
  });

  const residentialLandSchema = yup.object().shape({
    name: yup.string().required(t('owner.errorName')),
    city: yup.object().shape({
      id: yup.string().required(t('newPropertyForm.errorCity')),
    }),
    // district: yup.object().shape({
    //   id: yup.string().required(t('newPropertyForm.errorDistrict')),
    // }),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues:
      type == 1
        ? {
            type: 1,
            unit_type: type,
            name: oldProperty?.name,
            unit_sub_type: residentialTypes[subType],
            year_built:
              Years.find(y => y.name === oldProperty?.year_built)?.id ?? '',
            city: {
              id: parent?.city?.id ?? oldProperty?.city?.id,
            },
            district: {
              id: parent?.district?.id ?? oldProperty?.district?.id,
            },
            area: oldProperty?.area,
            electricity_meter_number:
              oldProperty?.electricity_meter_number ?? '',
            water_meter_number: oldProperty?.water_meter_number ?? '',
            is_furnished: oldProperty?.is_furnished
              ? oldProperty?.is_furnished - 2
              : 0,
            floor: oldProperty?.floor ?? 0,
            bedrooms: oldProperty?.bedrooms ?? 0,
            bathrooms: oldProperty?.bathrooms ?? 0,
            guest_rooms: oldProperty?.guest_rooms ?? 0,
            lounges: oldProperty?.lounges ?? 0,
            kitchen: oldProperty?.kitchen ? oldProperty?.kitchen - 2 : 0,
            ac_type: oldProperty?.ac_type ? oldProperty?.ac_type - 2 : 0,
            parking: oldProperty?.parking ?? 0,
            building: parent?.building ?? oldProperty?.building ?? null,
            community: parent?.community ?? oldProperty?.community ?? null,
          }
        : {
            type: 1,
            unit_type: type,
            unit_sub_type: residentialTypes[subType],
            name: oldProperty?.name,
            year_built:
              Years.find(y => y.name === oldProperty?.year_built)?.id ?? '',
            city: {
              id: parent?.city?.id ?? oldProperty?.city?.id,
            },
            district: {
              id: parent?.district?.id ?? oldProperty?.district?.id,
            },
            area: oldProperty?.area,
            electricity_meter_number:
              oldProperty?.electricity_meter_number ?? '',
            water_meter_number: oldProperty?.water_meter_number ?? '',
            building: parent?.building ?? oldProperty?.building ?? null,
            community: parent?.community ?? oldProperty?.community ?? null,
          },
    resolver:
      type == 1
        ? subType === LAND
          ? yupResolver(residentialLandSchema)
          : yupResolver(residentialSchema)
        : subType === LAND
        ? yupResolver(commercialLandSchema)
        : yupResolver(commercialSchema),
  });
  const submit = data => {
    setIsLoading(true);

    let unitBody = {
      name: data.name,
      city: {
        id: data.city.id,
      },
      district: {
        id: data.district.id,
      },
      area: data.area,
    };
    if (!!oldProperty) {
      mngmtHttp
        .put(
          `/properties/${oldProperty?.id}`,
          type == 1
            ? subType === LAND
              ? {
                  ...unitBody,
                  unit_sub_type: residentialTypes[subType],
                  type: type,
                  unit_type: type,
                }
              : {
                  ...data,
                  office_type: activeId.id + 1,
                  ac_type: data.ac_type + 2,
                  unit_type: type,
                  is_furnished: data.is_furnished + 2,
                  kitchen: data.kitchen + 2,
                  unit_sub_type: residentialTypes[subType],
                }
            : subType === LAND
            ? {
                ...unitBody,
                unit_sub_type: commercialTypes[subType],
                type: type,
                unit_type: type,
              }
            : {
                ...data,
                office_type: activeId.id + 1,
                ac_type: activeId.id2 + 2,
                unit_type: type,
                unit_sub_type: commercialTypes[subType],
              },
        )
        .then(response => {
          if (media) {
            uploadImage([media], 'property', response.data.data.id, () => {
              setIsLoading(false);
              navigation.goBack();
              navigation.goBack();
            });
          } else {
            setIsLoading(false);
            navigation.goBack();
            navigation.goBack();
          }
        })
        .catch(error => {
          setIsLoading(false);
          AlertHelper.show('error', t('common.error'), error);
        });
    } else {
      mngmtHttp
        .post(
          '/properties',
          type == 1
            ? subType === LAND
              ? {
                  ...unitBody,
                  unit_sub_type: residentialTypes[subType],
                  type: propertyType,
                  unit_type: type,
                }
              : {
                  ...data,
                  office_type: activeId.id + 1,
                  ac_type: activeId.id2 + 2,
                  is_furnished: data.is_furnished + 2,
                  kitchen: data.kitchen + 2,
                  unit_sub_type: residentialTypes[subType],
                }
            : subType === LAND
            ? {
                ...unitBody,
                unit_sub_type: commercialTypes[subType],
                type: propertyType,
                unit_type: type,
              }
            : {
                ...data,
                office_type: activeId.id + 1,
                ac_type: activeId.id2 + 2,
                unit_sub_type: commercialTypes[subType],
              },
        )
        .then(response => {
          if (media) {
            uploadImage([media], 'property', response.data.data.id, () => {
              setIsLoading(false);
              navigation.goBack();
              navigation.goBack();
            });
          } else {
            setIsLoading(false);
            navigation.goBack();
            navigation.goBack();
          }
        })
        .catch(error => {
          setIsLoading(false);
          AlertHelper.show('error', t('common.error'), error);
        });
    }
  };

  const attachMedia = async () => {
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      cropping: true,
    })
      .then(async image => {
        if (image) {
          setMedia([image]);
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.whiteColor}}>
      <Header
        name={
          type == 1
            ? t('properties.add_unit.residentialUnit')
            : t('properties.add_unit.commercialUnit')
        }
        navigation={navigation}
      />
      <ScrollView style={{flex: 1, marginTop: HP(2)}}>
        <Scrollable>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.9, marginHorizontal: 10}}>
              <WhiteSpace variant={1} />
              <AppText
                Tcolor={theme.blackColor}
                fontSize={theme.titleFontSize}
                textAlign={'left'}>
                General Information
              </AppText>
            </View>
            <View style={{flex: 0.1, justifyContent: 'center'}}>
              <FontAwesome
                name={'chevron-up'}
                color={theme.blackColor}
                size={theme.iconSize - 4}
              />
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Divider
              style={{
                width: WP(90),
                marginVertical: HP(1),
              }}
            />
          </View>

          <View style={{marginHorizontal: 10, marginVertical: 10}}>
            <View style={{marginBottom: 7}}>
              <AppText
                Tcolor={theme.greyColor}
                textAlign="left"
                fontSize={theme.subTitleFontSize}>
                Select Type*
              </AppText>
            </View>
            {type === 1 ? (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TabController
                  title={'Apartment'}
                  name={APARTMENT}
                  type={subType}
                  setType={type => setSubType(type)}
                  marginLeft={8}
                />
                <TabController
                  title={'Villa'}
                  name={VILLA}
                  type={subType}
                  setType={type => setSubType(type)}
                  marginLeft={8}
                />
                <TabController
                  title={'Land'}
                  name={LAND}
                  type={subType}
                  setType={type => setSubType(type)}
                  marginLeft={8}
                />
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TabController
                    title={'Land'}
                    name={LAND}
                    type={subType}
                    setType={type => setSubType(type)}
                    marginLeft={8}
                  />
                  <TabController
                    title={'Workshop'}
                    name={WORKSHOP}
                    type={subType}
                    setType={type => setSubType(type)}
                    marginLeft={8}
                  />
                  <TabController
                    title={'Warehouse'}
                    name={WAREHOUSE}
                    type={subType}
                    setType={type => setSubType(type)}
                    marginLeft={8}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'space-between',
                  }}>
                  <TabController
                    title={'Office'}
                    name={OFFICE}
                    type={subType}
                    setType={type => setSubType(type)}
                    marginLeft={8}
                  />
                  <TabController
                    title={'Retail'}
                    name={RETAIL}
                    type={subType}
                    setType={type => setSubType(type)}
                    marginLeft={8}
                  />
                </View>
              </>
            )}
          </View>

          <AppTextInputController
            name="name"
            control={control}
            placeholder={`${t('properties.add_unit.unitNumber')}*`}
            keyboardType={'default'}
            error={errors.name}
            textColor={theme.blackColor}
          />
          {subType !== LAND && !fromParent && (
            <>
              <WhiteSpace variant={1} />
              <AppDropDownController
                placeholder={t('newPropertyForm.year')}
                data={{data: Years}}
                control={control}
                name="year_built"
                error={errors.year_built}
              />
            </>
          )}

          {!fromParent && (
            <>
              <WhiteSpace variant={1} />
              <AppDropDownController
                placeholder={t('newPropertyForm.city')}
                data={cities}
                control={control}
                name="city.id"
                error={errors.city?.id}
              />
            </>
          )}

          {!fromParent && (
            <>
              <WhiteSpace variant={1} />
              <DistrictSelectController
                placeholder={t('newPropertyForm.district')}
                control={control}
                name="district.id"
                city={watch('city').id}
                error={errors.district?.id}
              />
            </>
          )}

          {/* {type == 2 && (
            <TwoButton
              activeId={activeId.id}
              title={'Select Type*'}
              names={['Office', 'Retail']}
              onPress={id => {
                setActiveId({...activeId, id: id});
              }}
            />
          )} */}
          <AppTextInputController
            name="area"
            control={control}
            placeholder={t('newPropertyForm.area')}
            error={errors.area}
            textColor={theme.blackColor}
            keyboardType={'number-pad'}
          />
          {type == 1 && subType !== LAND ? (
            <>
              <View style={{alignItems: 'center', marginBottom: HP(2)}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 0.9}}>
                    <WhiteSpace variant={1} />
                    <AppText
                      Tcolor={theme.blackColor}
                      fontSize={theme.titleFontSize}
                      textAlign={'left'}>
                      Unit Information
                    </AppText>
                  </View>
                  <View style={{flex: 0.1, justifyContent: 'center'}}>
                    <FontAwesome
                      name={'chevron-up'}
                      color={theme.blackColor}
                      size={theme.iconSize - 4}
                    />
                  </View>
                </View>
                <Divider
                  style={{
                    width: WP(90),
                    marginVertical: HP(1),
                  }}
                />
              </View>
              {subType !== APARTMENT ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IncrementalButtonController
                      title={'Bedrooms'}
                      name="bedrooms"
                      control={control}
                      error={errors.bedrooms}
                    />
                    <IncrementalButtonController
                      title={'Bathrooms'}
                      name="bathrooms"
                      control={control}
                      error={errors.bathrooms}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IncrementalButtonController
                      title={'Guest Rooms'}
                      name="guest_rooms"
                      control={control}
                      error={errors.guest_rooms}
                    />
                    <IncrementalButtonController
                      title={'Lounges'}
                      name="lounges"
                      control={control}
                      error={errors.lounges}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppButtonGroupTitleController
                      name="is_furnished"
                      control={control}
                      error={errors.is_furnished}
                      title={'Furnished'}
                      buttons={[t('property.yes'), t('property.no')]}
                    />
                    <AppButtonGroupTitleController
                      style={{marginVertical: HP(3)}}
                      name="kitchen"
                      control={control}
                      error={errors.kitchen}
                      title={'Kitchen'}
                      buttons={['Open', 'Closed']}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {subType === APARTMENT && (
                      <IncrementalButtonController
                        title={'Floor'}
                        name="floor"
                        control={control}
                        error={errors.floor}
                      />
                    )}
                    <IncrementalButtonController
                      title={'Bedrooms'}
                      name="bedrooms"
                      control={control}
                      error={errors.bedrooms}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IncrementalButtonController
                      title={'Bathrooms'}
                      name="bathrooms"
                      control={control}
                      error={errors.bathrooms}
                    />
                    <IncrementalButtonController
                      title={'Guest Rooms'}
                      name="guest_rooms"
                      control={control}
                      error={errors.guest_rooms}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IncrementalButtonController
                      title={'Lounges'}
                      name="lounges"
                      control={control}
                      error={errors.lounges}
                    />
                    <AppButtonGroupTitleController
                      name="is_furnished"
                      control={control}
                      error={errors.is_furnished}
                      title={'Furnished'}
                      buttons={[t('property.yes'), t('property.no')]}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <AppButtonGroupTitleController
                      style={{marginVertical: HP(3)}}
                      name="kitchen"
                      control={control}
                      error={errors.kitchen}
                      title={'Kitchen'}
                      buttons={['Open', 'Closed']}
                    />
                  </View>
                </>
              )}
            </>
          ) : undefined}
          <WhiteSpace variant={1} />
          {type == 2 && subType !== LAND && (
            <TwoButton
              activeId={activeId.id2}
              title={'Select AC Type'}
              names={['Split', 'Central']}
              onPress={id => {
                setActiveId({...activeId, id2: id});
              }}
            />
          )}
          {subType !== LAND && (
            <View>
              <AppTextInputController
                name="electricity_meter_number"
                control={control}
                placeholder={t('newPropertyForm.electricity_meter_number')}
                error={errors.electricity_meter_number}
                textColor={theme.blackColor}
                keyboardType={'number-pad'}
              />
              <WhiteSpace variant={1} />
              <AppTextInputController
                name="water_meter_number"
                control={control}
                placeholder={t('newPropertyForm.water_meter_number')}
                error={errors.water_meter_number}
                textColor={theme.blackColor}
                keyboardType={'number-pad'}
              />
            </View>
          )}
          <WhiteSpace variant={1} />
          {type == 1 && subType !== LAND ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppButtonGroupTitleController
                style={{marginVertical: HP(3)}}
                name="ac_type"
                control={control}
                error={errors.ac_type}
                title={'Select AC Type'}
                buttons={['Split', 'Central']}
              />
              <AppButtonGroupTitleController
                style={{marginVertical: HP(3)}}
                name="parking"
                control={control}
                error={errors.parking}
                title={'Private Parking'}
                buttons={[t('property.yes'), t('property.no')]}
              />
            </View>
          ) : undefined}
          {/* <AppButton
            title={t('formRequest.attach')}
            Bcolor={'#EFF7FA'}
            Tcolor={'#005373'}
            fontSize={14}
            rounded={8}
            leftIcon={'paperclip'}
            iconColor={'#005373'}
            onPress={attachMedia}
          /> */}
          {}
          <UploadButton onPress={attachMedia} media={media} />
          <WhiteSpace variant={1} />
          <AppButton
            title={t('common.save')}
            Tcolor={theme.whiteColor}
            rounded={8}
            loading={isLoading}
            Bcolor={theme.primaryColor}
            onPress={handleSubmit(submit)}
          />
        </Scrollable>
      </ScrollView>
    </View>
  );
};

const TabController = ({setType, type, name, title, marginLeft = 0}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        setType(name);
      }}
      style={{
        marginLeft: marginLeft,
        width: '100%',
        flex: 1,
        height: 45,
        backgroundColor: name === type ? theme.primaryColor : theme.whiteColor,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
      }}>
      <AppText
        regular
        textAlign="center"
        fontSize={theme.p2.size}
        fontWeight={theme.p2.fontWeight}
        Tcolor={name === type ? theme.whiteColor : theme.blackColor}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

export default NewUnitForm;

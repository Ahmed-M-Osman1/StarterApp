import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import ImagePicker from 'react-native-image-crop-picker';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import _ from 'lodash';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import Scrollable from '../../../components/Scrollable';
import UploadButton from '../../../components/UploadButton';
import WhiteSpace from '../../../components/WhiteSpace';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import DistrictSelectController from '../../../components/controlled/DistrictSelectController';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {
  PropertyImageType,
  PropertyType,
} from '../../../utils/constants/PropertyType';
import {UnitType} from '../../../utils/constants/UnitType';
import useCities from '../../../utils/hooks/useCities';
import {AlertHelper} from '../../../utils/AlertHelper';
import {Years} from '../../../utils/constants/Years';
import {mngmtHttp} from '../../../utils/http/Http';
import {theme} from '../../../utils/design';
import {uploadImage} from '../../../utils/uploadImage';
import {useQuery} from 'react-query';

// variant = 0 => community
// variant = 1 => building
// variant = 2 => unit

const NewProperty = ({route, navigation}) => {
  const {variant, id, prev, oldProperty, parent} = route.params;
  const {t} = useTranslation();
  const cities = useCities();
  const [isLoading, setLoading] = useState(false);
  const [media, setMedia] = useState([]);

  const attachMedia = async () => {
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      cropping: true,
      // multiple: true,
      // maxFiles: 1,
    })
      .then(async image => {
        if (image) {
          setMedia([image]);
        }
      })
      .catch(e => console.log(e));
  };

  const mySchema = yup.object().shape({
    name: yup
      .string()
      .required(t('newPropertyForm.errorName'), t('newPropertyForm.errorName')),
    // .matches(
    //   '^[a-zA-Z0-9 ]+$|^[\u0621-\u064A\u0660-\u06690-9 ]+$',

    // )
    year_built:
      (variant == 1 || (variant == 2 && prev != 'UnitsList')) &&
      yup.string().required(t('newPropertyForm.errorYear')),
    city:
      prev == 'PropertiesList' &&
      yup.object().shape({
        id: yup.string().required(t('newPropertyForm.errorCity')),
      }),
    district:
      prev == 'PropertiesList' &&
      yup.object().shape({
        id: yup.string().required(t('newPropertyForm.errorDistrict')),
      }),
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: oldProperty?.name,
      year_built: Years.find(y => y.name === oldProperty?.year_built)?.id ?? '',
      city: {
        id: parent?.city?.id ?? oldProperty?.city?.id,
      },
      district: {
        id: parent?.district?.id ?? oldProperty?.district?.id,
      },
    },
    resolver: yupResolver(mySchema),
  });

  const city = watch('city');

  const submit = async data => {
    let url;
    // for new posts
    if (prev == 'PropertiesList') {
      if (variant == 0) {
        url = oldProperty ? `/complexes/${oldProperty.id}` : '/complexes';
      } else {
        url = oldProperty ? `/properties/${oldProperty.id}` : '/properties';
      }
    } else if (prev == 'BuildingsUnitsList') {
      url = oldProperty
        ? `/complexes/${oldProperty.community.id}/properties/${oldProperty.id}`
        : `/complexes/${parent.id}/properties`;
    } else if (prev == 'UnitsList') {
      url = oldProperty
        ? `/multi-units/${oldProperty.community.id}/single-units/${oldProperty.id}`
        : `/multi-units/${id}/single-units`;
    } else if (!prev) {
      // url = `/multi-units/${oldProperty.building.id}/single-units/${oldProperty.id}`;
      url = oldProperty ? `/properties/${oldProperty.id}` : '/properties';
    }
    // return null;
    setLoading(true);
    if (!!oldProperty) {
      mngmtHttp
        .put(url, {
          ...oldProperty,
          type: UnitType[variant],
          ...data,
        })
        .then(response => {
          AlertHelper.showMessage('success', t('common.success'));

          if (!!media.length) {
            uploadImage(
              [...media],
              _.toLower(PropertyImageType[variant]),
              response.data.data.id,
              () => {},
            );
          }
        })
        .catch(error => {
          crashlytics().recordError(error);
          console.log(error);
          AlertHelper.show('error', t('common.error'), error);
        })
        .finally(() => {
          setLoading(false);
          navigation.goBack();
        });
    } else {
      mngmtHttp
        .post(url, {
          type: UnitType[variant],
          ...data,
          city: parent?.city,
        })
        .then(response => {
          if (!!media.length) {
            uploadImage(
              [...media],
              _.toLower(PropertyImageType[variant]),
              response.data.data.id,
              () => {},
            );
          }
        })
        .catch(error => {
          crashlytics().recordError(error);
          console.log(error);
          AlertHelper.show('error', t('common.error'), error);
        })
        .finally(() => {
          setLoading(false);
          navigation.goBack();
        });
    }
  };

  const buildingImages = useQuery('BuildingsImages', () =>
    mngmtHttp
      .get(`/images/models?model_type=property&model_id=${oldProperty.id}`)
      .then(response => response.data.data),
  );

  useEffect(() => {
    if (oldProperty?.images?.length) {
      setMedia(
        oldProperty?.images
          ?.map(x => ({
            path: x?.url,
          }))
          .reverse(),
      );
    } else if (variant === 1 || variant === 2) {
      setMedia(
        buildingImages?.data?.map(x => ({
          path: x?.url,
        })),
      );
    }
  }, [oldProperty, buildingImages?.data]);
  return (
    <Scrollable>
      <Header
        name={`${t(`properties.${PropertyType[variant].toLowerCase()}`)} ${t(
          'common.information',
        )}`}
        navigation={navigation}
      />
      <ScrollView style={styles.container}>
        <View style={{flex: 0.9}}>
          {/* <AppText
            Tcolor={theme.blackColor}
            fontSize={theme.titleFontSize}></AppText> */}
          <AppTextInputController
            name="name"
            keyboardType={'default'}
            control={control}
            placeholder={t(
              variant == 0
                ? 'newPropertyForm.name'
                : variant == 1
                ? 'newPropertyForm.nameOrNumber'
                : 'newPropertyForm.number',
            )}
            error={errors.name}
            style={{height: 45}}
            maxLength={variant == 2 ? 5 : undefined}
            textColor={theme.blackColor}
          />
          {(variant == 1 || (variant == 2 && prev != 'UnitsList')) && (
            <AppDropDownController
              placeholder={t('newPropertyForm.year')}
              data={{data: Years}}
              control={control}
              name="year_built"
              error={errors.year_built}
            />
          )}

          {prev == 'PropertiesList' && (
            <>
              <AppDropDownController
                placeholder={t('newPropertyForm.city')}
                data={cities}
                control={control}
                name="city.id"
                error={errors.city?.id}
              />
              {city?.id != '' && (
                <DistrictSelectController
                  placeholder={t('newPropertyForm.district')}
                  control={control}
                  name="district.id"
                  city={city?.id}
                  error={errors.district?.id}
                />
              )}
            </>
          )}
          <UploadButton onPress={attachMedia} media={media} />
          <WhiteSpace variant={1} />
        </View>
        <View style={{flex: 0.2, justifyContent: 'flex-end'}}>
          <AppButton
            title={oldProperty ? t('common.update') : t('common.create')}
            onPress={handleSubmit(submit)}
            Bcolor={theme.primaryColor}
            Tcolor={theme.whiteColor}
            loading={isLoading}
            rounded={8}
          />
        </View>
      </ScrollView>
    </Scrollable>
  );
};

export default NewProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import Header from '../../../components/Header';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import Scrollable from '../../../components/Scrollable';
import WhiteSpace from '../../../components/WhiteSpace';
import {useTranslation} from 'react-i18next';
import {theme} from '../../../utils/design';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import {ProgressBar} from 'react-native-paper';
import {AlertHelper} from '../../../utils/AlertHelper';
import {mngmtHttp} from '../../../utils/http/Http';
import ImageSlider from '../components/ImageSlider';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {useFieldArray, useForm} from 'react-hook-form';
import {CardWithShadow} from '../../../components/CardWithShadow';
import {useQuery} from 'react-query';
import {uploadImage} from '../../../utils/uploadImage';
import Modal from 'react-native-modal';

const moment = require('moment');

const CollapseCardWithShadow = ({children, title = '', t}) => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <View
      style={{
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
        padding: 16,
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsHidden(!isHidden)}
        style={{
          height: !isHidden ? 30 : null,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: !isHidden ? 'flex-start' : 'center',
          }}>
          <AppText
            regular
            fontSize={theme.s1.size}
            fontWeight={theme.s2.fontWeight}
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {title}
          </AppText>
          <AppText
            regular
            fontSize={10}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.greyColor}
            textAlign={'left'}>
            {t('common.vatInc')}
          </AppText>
        </View>
        <FontAwesome
          name={isHidden ? 'chevron-up' : 'chevron-down'}
          color={theme.blackColor}
          size={theme.p1.size}
        />
      </TouchableOpacity>
      {!isHidden && children}
    </View>
  );
};

const QuotationFrom = ({
  fields,
  t,
  control,
  errors,
  handleAddFiled,
  handleRemoveField,
  subCategory,
}) => {
  return (
    <View>
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
          }}>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText
              regular
              fontSize={theme.s2.size}
              fontWeight={theme.s2.fontWeight}
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {t('startRequest.serviceFees')}
            </AppText>
            <View style={{width: '40%'}}>
              <AppTextInputController
                // ref={input => (ref.current[1] = input)}
                name="service_fee"
                keyboardType={'decimal-pad'}
                control={control}
                customErrorHorizonatalMargin={0}
                placeholder={t('startRequest.serviceFees')}
                error={errors.service_fee}
                customMargin={0}
                customWidth={'100%'}
                disabledTitle
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor:
                    subCategory.price_type !== 2 ? '#e7e7e7' : null,
                }}
                textColor={theme.blackColor}
                backgroundColor={theme.whiteColor}
                placeholderTextColor={theme.greyColor}
                editable={subCategory.price_type === 2}
                //   onSubmitEditing={() => handleSubmit(submit)}
              />
            </View>
          </View>
          <View style={{height: 50}}>
            <AppText
              regular
              fontSize={10}
              fontWeight={theme.p2.fontWeight}
              Tcolor={theme.greyColor}
              textAlign={'left'}>
              {t('common.vatInc')}
            </AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText
              regular
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {t('dashboard.sar')} {subCategory.price_value}
            </AppText>
          </View>
        </View>
      </CardWithShadow>
      <View style={{height: 20}} />
      <CollapseCardWithShadow title={t('startRequest.spareParts')} t={t}>
        {fields.map((field, idx) => {
          return (
            <View key={field.id}>
              <AppTextInputController
                // ref={input => (ref.current[1] = input)}
                name={`sparePart.${idx}.spare_parts_description`}
                keyboardType={'default'}
                control={control}
                placeholder={t('startRequest.sparePartsDescription')}
                error={
                  errors?.sparePart
                    ? errors?.sparePart[idx]?.spare_parts_description
                    : null
                }
                customErrorHorizonatalMargin={0}
                customMargin={0}
                customWidth={'100%'}
                disabledTitle
                style={{height: 60, borderRadius: 6}}
                textColor={theme.blackColor}
                backgroundColor={theme.whiteColor}
                placeholderTextColor={theme.greyColor}
                //   onSubmitEditing={() => handleSubmit(submit)}
                multiline
                numberOfLines={3}
              />
              <View style={{height: 10}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}>
                  <AppText
                    regular
                    fontSize={theme.c1.size}
                    fontWeight={theme.c1.fontWeight}
                    Tcolor={theme.greyColor}
                    textAlign={'left'}>
                    {t('startRequest.enterTotalAmount')}
                  </AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppTextInputController
                    // ref={input => (ref.current[1] = input)}
                    name={`sparePart.${idx}.item_price`}
                    keyboardType={'numeric'}
                    control={control}
                    placeholder={t('startRequest.itemPrice')}
                    // error={errors.item_price ? errors.item_price[idx] : null}
                    error={
                      errors?.sparePart
                        ? errors?.sparePart[idx]?.item_price
                        : null
                    }
                    customErrorHorizonatalMargin={0}
                    customMargin={0}
                    customWidth={'100%'}
                    disabledTitle
                    style={{height: 45, borderRadius: 6}}
                    textColor={theme.blackColor}
                    backgroundColor={theme.whiteColor}
                    placeholderTextColor={theme.greyColor}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveField(idx)}
                activeOpacity={0.7}
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <Icon name={'remove'} color={theme.red} size={theme.h6.size} />
                <AppText
                  regular
                  fontSize={theme.c1.size}
                  fontWeight={theme.c1.fontWeight}
                  Tcolor={theme.red}
                  textAlign={'left'}>
                  {t('common.remove')}
                </AppText>
              </TouchableOpacity>
              {fields.length > 1 && fields.length !== idx + 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#eeeeee',
                    marginTop: 15,
                    marginBottom: 20,
                  }}
                />
              )}
            </View>
          );
        })}
        <TouchableOpacity
          onPress={() => handleAddFiled()}
          activeOpacity={0.5}
          style={{flexDirection: 'row', marginTop: 10}}>
          <FontAwesome
            name={'plus'}
            color={theme.primaryColor}
            size={theme.p2.size}
          />
          <AppText
            regular
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            Tcolor={theme.primaryColor}
            textAlign={'left'}>
            {t('common.add')}
          </AppText>
        </TouchableOpacity>
      </CollapseCardWithShadow>
      <View style={{height: 20}} />
      <CollapseCardWithShadow title={t('startRequest.additionalFees')} t={t}>
        <View>
          <AppTextInputController
            name={`additional_fees_description`}
            keyboardType={'default'}
            control={control}
            placeholder={t('startRequest.additionalFeesDescription')}
            error={errors.additional_fees_description}
            customMargin={0}
            customWidth={'100%'}
            disabledTitle
            style={{height: 60, borderRadius: 6}}
            textColor={theme.blackColor}
            backgroundColor={theme.whiteColor}
            placeholderTextColor={theme.greyColor}
            multiline
            numberOfLines={3}
          />
          <View style={{height: 10}} />
          <AppTextInputController
            name={`total_fees`}
            keyboardType={'numeric'}
            control={control}
            placeholder={t('startRequest.totalFees')}
            error={errors.total_fees}
            customMargin={0}
            customWidth={'100%'}
            disabledTitle
            style={{height: 45, borderRadius: 6}}
            textColor={theme.blackColor}
            backgroundColor={theme.whiteColor}
            placeholderTextColor={theme.greyColor}
          />
        </View>
      </CollapseCardWithShadow>
    </View>
  );
};

const UploadMedia = ({attachMedia, t}) => {
  return (
    <TouchableOpacity style={styles.attachBox} onPress={attachMedia}>
      <Icon name={'add-photo-alternate'} color={theme.greyColor} size={60} />
      <View style={{width: '70%'}}>
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.greyColor}
          textAlign={'center'}>
          {t('requests.requestCompleteImageBox')}
        </AppText>
      </View>

      <View style={styles.attachImageBtn}>
        <AppText
          regular
          fontSize={theme.subTitleFontSize}
          Tcolor={theme.primaryColor}
          textAlign={'center'}>
          {t('requests.requestCompleteButton')}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const StartRequest = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState([]);
  const [progress, setProgress] = useState(0.5);
  const [pinCode, setPinCode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttachmentModalVisible, setIsAttachmentModalVisible] = useState(
    false,
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [subCategory, setSubCategory] = useState(null);

  const {request} = route.params;
  useEffect(() => {
    // do something
    setIsLoading(false);
  }, []);
  useEffect(() => {
    if (request.status === 20) {
      setStep(2);
      setProgress(0.9);
    }
    setIsLoading(false);
  }, [request]);

  const query = useQuery(`InvoiceSettings`, () =>
    mngmtHttp.get(`/invoice-settings`).then(response => response.data.data),
  );
  const listOfAvailableRequestCategories = useQuery(
    'listOfAvailableRequestCategories',
    () =>
      mngmtHttp
        .get(`/request-category`)
        .then(resp => resp.data)
        .catch(e => console.log(e)),
  );
  //

  useEffect(() => {
    if (
      !!listOfAvailableRequestCategories?.data?.data &&
      !!request.type &&
      !!request.subtype
    ) {
      setSubCategory(
        listOfAvailableRequestCategories.data.data
          .find(c => c.code === request.type)
          ?.subCategories?.find(sc => sc.code === request.subtype),
      );
    }
  }, []);

  const updateRequestStatus = newStatus => {
    setIsLoading(true);
    mngmtHttp
      .put(`/requests/${request.id}/assign-status`, {
        status: newStatus,
      })
      .then(() => {
        setIsLoading(true);
        AlertHelper.showMessage('success', t('alerts.success'));
      })
      .then(() => {
        request.refetch();
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
        setIsLoading(false);
      });
  };

  const {t} = useTranslation();
  const handlePress = () => {
    if (isLoading) {
      return;
    }
    if (!!media.length) {
      setIsLoading(true);
      uploadImage(media, 'request', request.id, () => {
        setProgress(0.9);
        updateRequestStatus(20);
        setStep(step + 1);
      });
    } else {
      AlertHelper.showMessage('error', t('requests.attachMediaMessage'));
    }
  };
  //
  const quoteSchema = yup.object().shape({
    service_fee: yup
      .number()
      .typeError(t('quote.error.number'))
      .min(
        subCategory?.price_type != 0
          ? +subCategory?.price_value.split('-')[0]
          : 0,
        t('quote.error.service_fee_less_than'),
      )
      .max(
        subCategory?.price_type === 2
          ? +subCategory?.price_value.split('-')[1]
          : +subCategory?.price_value.split('-')[0],
        t('quote.error.service_fee_greater_than'),
      )
      .required(t('quote.error.service_fee')),
    total_fees: yup
      .number()
      .typeError(t('quote.error.number'))
      .nullable(t('quote.error.total_fees')),
    additional_fees_description: yup
      .string()
      .nullable(t('quote.error.additional_fees_description')),
    sparePart: yup.array().of(
      yup.object().shape({
        spare_parts_description: yup.string().when('item_price', {
          is: item_price => item_price > 0,
          then: yup.string().required(t('quote.error.spare_parts_description')),
        }),
        item_price: yup
          .number()
          .typeError(t('quote.error.number'))
          .nullable(t('quote.error.item_price')),
      }),
    ),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      service_fee: null,
      additional_fees_description: '',
      total_fees: null,
      sparePart: [
        {
          spare_parts_description: '',
          item_price: null,
        },
      ],
    },
    resolver: yupResolver(quoteSchema),
  });

  useEffect(() => {
    if (!!subCategory) {
      setValue(
        'service_fee',
        subCategory?.price_type === 2
          ? subCategory?.price_value
          : subCategory?.price_value.split('-')[0],
      );
    }
  }, [subCategory]);

  const {fields, append, remove, swap, move, insert} = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'sparePart', // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });
  const handleAddFiled = () => {
    append({
      spare_parts_description: '',
      item_price: 0,
    });
  };
  const handleRemoveField = id => {
    remove(id);
  };

  const calculateVatInc = number => {
    let vat = (1 + query.data.vat / 100).toFixed(2);
    let amount = (number / vat).toFixed(2);
    let vat_amount = (number - amount).toFixed(2);
    let sub_total = number.toFixed(2);
    return {
      amount: sub_total,
      sub_total: amount,
      vat: vat,
      vat_amount: vat_amount,
    };
  };

  const converDataForBackend = data => {
    let quoteObj = {
      contract_number: `QUOTE-${Math.floor(Date.now() / 1000)}`,
      invoice_date: moment().format('YYYY-MM-DD hh:mm:ss'),
      due_on: moment().add(1, 'days').format('YYYY-MM-DD'),
      notes: '',
      paid: 0,
      items: [
        {
          service_name: 'service fee',
          ...calculateVatInc(data.service_fee),
          category: request.type,
          sub_category: request.subtype,
          quantity: 1,
        },
        ...data.sparePart.map(
          item =>
            item.spare_parts_description && {
              service_name: item.spare_parts_description ?? '',
              ...calculateVatInc(item.item_price ?? 0),
              category: request.type,
              sub_category: request.subtype,
              quantity: 1,
            },
        ),
        data.additional_fees_description && {
          service_name:
            'additional fees' + data.additional_fees_description ?? '',
          ...calculateVatInc(data.total_fees ?? 0),
          category: request.type,
          sub_category: request.subtype,
          quantity: 1,
        },
      ].filter(i => !!i),
    };
    return quoteObj;
  };
  //
  const submit = async data => {
    let updatedData = converDataForBackend(data);

    mngmtHttp
      .post(`/invoice/${request.id}`, {invoice: updatedData})
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          AlertHelper.showMessage('success', `Quotation has been sent`);
          incremnetStep();
        } else {
          AlertHelper.showMessage(
            'warning',
            `Something went wrong, please try again`,
          );
        }
      })
      .catch(e => {
        AlertHelper.showMessage('error', e.response.data.message);
        // Object.keys(e.response.data.errors).forEach(field => {
        //   // setError(
        //   //   field,
        //   //   {type: 'focus', message: e.response.data.errors[field][0]},
        //   //   {shouldFocus: true},
        //   // );
        // });
      })
      .finally(() => {
        setIsLoading(false);
        navigation.goBack();
      });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pinCode]);

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

  const STEPS = {
    1: <UploadMedia t={t} attachMedia={attachMedia} />,
    2: (
      <QuotationFrom
        fields={fields}
        t={t}
        control={control}
        errors={errors}
        handleAddFiled={handleAddFiled}
        handleRemoveField={handleRemoveField}
        subCategory={subCategory}
      />
    ),
  };

  return (
    <Scrollable>
      <Header name={t('requests.raiseQoutation')} navigation={navigation} />
      <ScrollView style={styles.body1}>
        <View style={{paddingHorizontal: 20}}>
          <View style={styles.stepBarContainer}>
            <ProgressBar progress={progress} color={theme.primaryColor} />
          </View>
        </View>
        <WhiteSpace variant={1} />
        <View style={{marginHorizontal: 10}}>
          <AppText
            fontSize={theme.superTitleFontSize}
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {t(`startRequest.step${step}`)}
          </AppText>
          <WhiteSpace variant={1} />
          <AppText
            key={step}
            fontSize={theme.subTitleFontSize}
            Tcolor={theme.primaryColor}
            textAlign={'left'}>
            {t(`startRequest.step${step}Text`)}
          </AppText>
        </View>
        <WhiteSpace variant={1} />
        <View style={{marginHorizontal: 20}}>{STEPS[step]}</View>
        <WhiteSpace variant={1} />
        <View key={step}>
          {!!media && step === 1 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              {media.map((m, idx) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setImageIndex(idx);
                      setIsModalVisible(true);
                    }}
                    key={`${m?.path + idx}`}
                    style={{
                      alignSelf: 'center',
                      borderColor: '#eeeeee',
                      borderWidth: 1,
                      borderRadius: 8,
                      marginHorizontal: 10,
                      marginVertical: 5,
                    }}>
                    <Image
                      resizeMode={'contain'}
                      style={{
                        height: 90,
                        width: 90,
                      }}
                      source={{uri: m?.path}}
                    />
                  </TouchableOpacity>
                );
              })}
              <ImageSlider
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                media={media}
                imageIndex={imageIndex}
              />
            </View>
          )}
        </View>
      </ScrollView>
      {/* <View style={{flex: 1}}></View> */}
      <View style={styles.body2}>
        {step === 2 && (
          <AppButton
            half={true}
            title={t('common.previous')}
            onPress={() => setStep(1)}
            // Bcolor={'#7C7C7C'}
            style={{borderColor: theme.primaryColor, borderWidth: 1}}
            Tcolor={theme.primaryColor}
            rounded={8}
            customMargin={0}
          />
        )}
        <AppButton
          half={step === 2}
          title={step == 1 ? t('common.next') : t('common.complete')}
          onPress={step == 1 ? handlePress : handleSubmit(submit)}
          Bcolor={theme.primaryColor}
          rounded={8}
          Tcolor={theme.whiteColor}
          loading={isLoading}
          customMargin={0}
        />
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
      <View style={{height: 20}} />
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  body1: {
    flex: 1,
  },
  body2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  stepBarContainer: {
    height: 5,
    backgroundColor: `${theme.primaryColor}20`,
    borderRadius: 8,
  },
  stepBar: {
    width: '90%',
    height: 5,
    backgroundColor: theme.primaryColor,
    borderRadius: 8,
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
    marginTop: 40,
    // marginHorizontal: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  attachImageBtn: {
    backgroundColor: `${theme.primaryColor}20`,
    height: 30,
    justifyContent: 'center',
    borderRadius: 5,
  },
  otpContainer: {
    width: '100%',
    height: 80,
    paddingHorizontal: 40,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    backgroundColor: theme.whiteColor,
    borderColor: theme.primaryColor,
    opacity: 0.5,
    borderWidth: 2,
    color: '#333',
    shadowColor: theme.blackColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    elevation: 5,
  },
});

export default StartRequest;

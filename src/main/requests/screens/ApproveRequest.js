import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, View, Image} from 'react-native';
import Header from '../../../components/Header';

import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import Scrollable from '../../../components/Scrollable';
import WhiteSpace from '../../../components/WhiteSpace';
import {useTranslation} from 'react-i18next';
import {theme} from '../../../utils/design';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import ImagePicker from 'react-native-image-crop-picker';
import {ProgressBar} from 'react-native-paper';
import {AlertHelper} from '../../../utils/AlertHelper';
import {setLoading} from '../../../redux/misc';
import {mngmtHttp} from '../../../utils/http/Http';
import ImageSlider from '../components/ImageSlider';
import formatNumbers from '../../../utils/formatNumbers';
import {CardWithShadow} from '../../../components/CardWithShadow';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';

const ApproveRequest = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState([]);
  const [progress, setProgress] = useState(0.33);
  const [pinCode, setPinCode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttachmentModalVisible, setIsAttachmentModalVisible] = useState(
    false,
  );
  const [imageIndex, setImageIndex] = useState(0);
  const userData = useSelector(state => state.user.data);
  const {request} = route.params;
  useEffect(() => {
    // do something
    setIsLoading(false);
  }, []);

  const quotationQuery = useQuery(`RequestQuotation_${request?.id}`, () =>
    mngmtHttp
      .get(`/invoice-by-request/${request?.id}`)
      .then(response => response.data)
      .catch(e => console.log(e)),
  );

  const {t} = useTranslation();

  const handlePress = () => {
    if (isLoading) {
      return;
    }
    if (!!media.length) {
      if (step === 3) {
        setIsLoading(true);
        handleSubmit();
      } else {
        setStep(step + 1);
      }
    } else {
      AlertHelper.showMessage('error', t('requests.attachMediaMessage'));
    }
  };

  useEffect(() => {
    setProgress(step / 3);
  }, [step]);
  const handleSubmit = async () => {
    const formBody = new FormData();

    const imagesToUpload = media.map(m => ({
      name: m.filename,
      type: m.mime || 'image/jpeg',
      uri: m.path,
    }));

    formBody.append('images', imagesToUpload);

    mngmtHttp
      .post(`requests/${request.id}/complete-by-code`, {
        _method: 'put',
        confirmation_code: pinCode,
        ...formBody,
      })
      .then(() =>
        mngmtHttp.post(`/professional-wallet`, {
          type: '1',
          amount: quotationQuery.data.data.subtotal,
          professional_id: userData.id,
        }),
      )
      .then(() => {
        navigation.goBack();
      })
      .catch(error => {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        AlertHelper.show('error', t('common.error'), error);
      })
      .finally(() => setLoading(false));
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

  return (
    <Scrollable>
      <Header name={t('requests.requestComplete')} navigation={navigation} />
      <View style={styles.body1}>
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
            {t('requests.requestCompleteSubtitle')}
          </AppText>
          <WhiteSpace variant={1} />
          <AppText
            key={step}
            fontSize={theme.subTitleFontSize}
            Tcolor={theme.primaryColor}
            textAlign={'left'}>
            {step === 1
              ? t('requests.requestCompleteMessage')
              : step === 2
              ? t('requests.requestCompleteMessageAmount')
              : t('requests.requestCompleteMessageOtp')}
          </AppText>
        </View>
        <WhiteSpace variant={1} />
        <View style={{marginHorizontal: 20}}>
          {step === 1 ? (
            <TouchableOpacity style={styles.attachBox} onPress={attachMedia}>
              <Icon
                name={'add-photo-alternate'}
                color={theme.greyColor}
                size={60}
              />
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
          ) : step === 2 ? (
            <CardWithShadow>
              <View style={{height: 20}} />
              <AppText
                regular
                fontSize={theme.h3.size}
                fontWeight={theme.h3.fontWeight}
                Tcolor={theme.blackColor}
                textAlign={'center'}>
                {t('dashboard.sar')}{' '}
                {formatNumbers(quotationQuery.data.data.total_amount)}
              </AppText>
              <View style={{height: 20}} />
            </CardWithShadow>
          ) : (
            <OTPInputView
              style={styles.otpContainer}
              pinCount={4}
              autoFocusOnLoad={true}
              codeInputFieldStyle={styles.otpInput}
              onCodeFilled={code => {
                setPinCode(code);
              }}
            />
          )}
        </View>
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
      </View>
      {/* <View style={{flex: 1}}></View> */}
      <View style={styles.body2}>
        {step !== 1 && (
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
          half={step != 1}
          title={step === 3 ? t('common.complete') : t('common.next')}
          onPress={handlePress}
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
    marginBottom: 30,
  },
  stepBarContainer: {
    // marginHorizontal:20,
    // width:"90%",
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

export default ApproveRequest;

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Keyboard} from 'react-native';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {theme} from '../../../utils/design';
import {Modal} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {RequestCancelTypes} from '../../../utils/constants/RequestCancelTypes';
import {useTranslation} from 'react-i18next';
import {mngmtHttp} from '../../../utils/http/Http';
import {AlertHelper} from '../../../utils/AlertHelper';
import {useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import AppTextInputController from '../../../components/controlled/AppTextInputController';

const CancelRequestModel = ({visible, setVisible, request, screenTo, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setKeyboardVisible(true); // or some other action
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const {t} = useTranslation();
  const role = useSelector(state => state.user.data.role);

  cancelTypes = RequestCancelTypes;
  if (role === 'CUSTOMER') {
    cancelTypes = cancelTypes.slice(-2);
  }

  const {control, watch, handleSubmit} = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const showCommentField = [1, 2, 3, 5].includes(watch('comment'));

  const submitCancelRequest = async data => {
    // change the comeent in data obj from just id to text
    if (showCommentField) {
      data.comment = RequestCancelTypes[data['comment'] - 1].name;
    }
    // do the magic
    setLoading(true);
    try {
      setLoading(true);
      await mngmtHttp
        .put(`/requests/${request.id}/assign-status`, {
          status: 5,
          ...data,
        })
        .then(() => {
          setLoading(false);
          setVisible(false);
          AlertHelper.showMessage(
            'success',
            t('requests.cancelRequestAlertMessage'),
            t(''),
          );
          if(screenTo){
            navigation.navigate(screenTo.parent, {screen: screenTo.child});
          }else{
            navigation.navigate('ListRequests');
          }
        })
        .catch(e => console.log(e));
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        AlertHelper.show('error', t('common.error'), error);
      }
    }
  };

  return (
    <Modal
      transparent={false}
      animationType={'slide'}
      visible={visible}
      style={{
        justifyContent: 'flex-end',
        paddingBottom: 0,
        marginBottom: isKeyboardVisible ? keyboardHeight : 0,
      }}
      onDismiss={() => setVisible(false)}
      onRequestClose={() => setVisible(false)}>
      <View
        style={{
          marginTop: 10,
          width: '100%',
          backgroundColor: theme.whiteColor,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            right: 10,
            paddingVertical: 15,
            paddingRight: 10,
          }}
          onPress={() => setVisible(false)}>
          <View
            style={{
              backgroundColor: '#e7e7e7',
              borderRadius: 999,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome
              name={'times'}
              color={theme.whiteColor}
              size={theme.iconSize}
            />
          </View>
        </TouchableOpacity>
        <AppText
          Tcolor={theme.blackColor}
          textAlign={'left'}
          fontSize={theme.titleFontSize}
          style={{
            position: 'absolute',
            top: 0,
            left: 10,
            paddingVertical: 20,
          }}>
          {t('common.comment')}
        </AppText>
        <View style={{height: 65}} />
        <View>
          <AppDropDownController
            name="comment"
            placeholder={t('requests.cancelRequestPlaceholder')}
            data={{data: cancelTypes}}
            control={control}
            withHeader={false}
          />
          {!showCommentField && !!watch('comment') && (
            <AppTextInputController
              multiline={true}
              name="comment"
              customHeight={80}
              control={control}
              placeholderTextColor={'#7C7C7C'}
              returnKeyType={'go'}
              onSubmitEditing={handleSubmit(submitCancelRequest)}
              style={{
                marginVertical: 10,
                marginHorizontal: 20,
                borderRadius: 5,
                borderColor: '#7C7C7C',
                fontSize: 14,
              }}
              keyboardType={'default'}
            />
          )}
        </View>
        <View style={{height: 8}} />
        <View>
          <AppButton
            title={t('common.submit')}
            Bcolor={theme.primaryColor}
            Tcolor={'white'}
            rounded={8}
            onPress={handleSubmit(submitCancelRequest)}
            loading={loading}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CancelRequestModel;

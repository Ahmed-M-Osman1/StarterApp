import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import {theme} from '../../../utils/design';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

const RenderActionButtons = ({text, callApiFunc, isLoading, disabled = false}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {t} = useTranslation();

  return (
    <View style={{}}>
      <AppButton
        title={t('common.delete')}
        onPress={() => {
          if(disabled) return;
          setIsVisible(true)
        }}
        Bcolor={theme.whiteColor}
        Tcolor={theme.red}
        loading={isLoading}
        rounded={8}
        style={{
          borderWidth: 1,
          borderColor: 'red',
        }}
      />
      <Modal
        isVisible={isVisible}
        onBackButtonPress={() => setIsVisible(false)}
        onBackdropPress={() => setIsVisible(false)}
        onRequestClose={() => setIsVisible(false)}
        // style={{
        //   marginHorizontal: 0,
        //   marginBottom: 0,
        //   marginTop: 0,
        // }}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
        // backdropColor={null}
        // backdropStyle={{
        //   backgroundColor: '#ffffff00',
        // }}>
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginHorizontal: 10,
            borderRadius: 8,
          }}>
          <View style={{justifyContent: 'center', paddingVertical: 20}}>
            <AppText
              Tcolor={theme.primaryColor}
              regular={true}
              fontSize={theme.s1.size}
              fontWeight={theme.s1.fontWeight}
              textAlign={'center'}>
              {t('contacts.deleteUser')}
            </AppText>
            <View style={{height: 10}} />
            <AppText
              Tcolor={theme.greyColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'center'}>
              {t('contacts.deleteUserConfirmation')}
            </AppText>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => callApiFunc()}
              style={{
                height: 50,
                justifyContent: 'center',
                flex: 1,
                borderColor: '#eee',
                borderTopWidth: 0.5,
                borderRightWidth: 0.5,
              }}>
              <AppText
                Tcolor={theme.blackColor}
                regular={true}
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                textAlign={'center'}>
                {t('common.yes')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={{
                height: 50,
                justifyContent: 'center',
                flex: 1,
                borderColor: '#eee',
                borderTopWidth: 0.5,
                borderLeftWidth: 0.5,
              }}>
              <AppText
                Tcolor={theme.blackColor}
                regular={true}
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                textAlign={'center'}>
                {t('common.no')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default RenderActionButtons;

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useFieldArray, useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import CountryPhoneController from '../../../components/controlled/CountryPhoneController';
import Header from '../../../components/Header';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import WhiteSpace from '../../../components/WhiteSpace';
import AppButton from '../../../components/AppButton';
import Scrollable from '../../../components/Scrollable';
import AppText from '../../../components/AppText';
import {mngmtHttp} from '../../../utils/http/Http';
import {Admin, Management, Security} from '../../../utils/constants/Role';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {theme, WP} from '../../../utils/design';
import AppCheckBox from '../../../components/AppCheckBox';
import {AlertHelper} from '../../../utils/AlertHelper';
import {List} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';

const VisitorForm = ({
  index,
  control,
  errors,
  t,
  handleRemoveField,
  fields,
  ref,
}) => {
  return (
    <View
      style={{
        backgroundColor: theme.whiteColor,
        paddingVertical: 10,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}>
        <AppTextInputController
          name={`visitor.${index}.fName`}
          customWidth={WP(40)}
          control={control}
          headerTitleStyle={{
            marginHorizontal: 0,
          }}
          error={errors?.fName}
          backgroundColor={'#ffffff10'}
          textColor={theme.blackColor}
          keyboardType={'default'}
          style={{
            height: 45,
            marginHorizontal: 0,
            paddingHorizontal: 8,
          }}
          placeholder={t('visitorReq.firstN')}
          returnKeyType={'next'}
          disabledTitle={false}
        />

        <AppTextInputController
          name={`visitor.${index}.lName`}
          customWidth={WP(40)}
          control={control}
          error={errors?.lName}
          keyboardType={'default'}
          backgroundColor={'#ffffff10'}
          textColor={theme.blackColor}
          style={{
            height: 45,
            marginHorizontal: 0,
            paddingHorizontal: 8,
          }}
          placeholder={t('visitorReq.lastN')}
          headerTitleStyle={{
            marginHorizontal: 0,
          }}
          returnKeyType={'next'}
          disabledTitle={false}
        />
      </View>
      <View style={{height: 10}} />
      <View style={{marginHorizontal: 10}}>
        <AppTextInputController
          customWidth={'100%'}
          name={`visitor.${index}.nationalID`}
          control={control}
          placeholder={t('visitorReq.nationalID')}
          error={errors?.nationalID}
          textColor={theme.blackColor}
          style={{
            height: 45,
          }}
          headerTitleStyle={{
            marginHorizontal: 0,
          }}
          keyboardType={'number-pad'}
          returnKeyType={'next'}
          disabledTitle={false}
        />
      </View>
      <View style={{height: 10}} />
      <AppText
        textAlign="left"
        Tcolor={theme.greyColor}
        fontSize={
          Platform.OS === 'android' ? theme.c2.size - 2 : theme.c2.size
        }>
        {t('signUp.mobile')}
      </AppText>
      <WhiteSpace variant={0.5} />
      {Platform.OS === 'android' ? (
        <CountryPhoneController
          pickerName={`visitor.${index}.countryCode`}
          name={`visitor.${index}.mobile`}
          placeholder={t('signUp.mobile')}
          control={control}
          keyboardType={'number-pad'}
          error={errors?.mobile}
          style={{
            height: 45,
            width: Dimensions.get('window').width - 192,
          }}
          pickerStyle={{
            height: 45,
            borderRadius: 8,
            borderColor: theme.primaryColor,
            borderWidth: 0.25,
          }}
          disabledTitle={true}
          textColor={theme.blackColor}
        />
      ) : (
        <View style={{marginHorizontal: 10}}>
          <CountryPhoneController
            pickerName={`visitor.${index}.countryCode`}
            name={`visitor.${index}.mobile`}
            placeholder={t('signUp.mobile')}
            control={control}
            keyboardType={'number-pad'}
            error={errors?.mobile}
            backgroundColor={'#ffffff'}
            style={{
              height: 45,
              width: Dimensions.get('window').width - 182,
            }}
            pickerStyle={{
              height: 45,
              borderRadius: 8,
              borderColor: theme.primaryColor,
              borderWidth: 0.25,
            }}
            disabledTitle={true}
            textColor={theme.blackColor}
            noMargin
          />
        </View>
      )}
      {fields.length > 1 && (
        <View
          style={{
            alignItems: 'flex-end',
            marginHorizontal: 10,
            marginVertical: 5,
          }}>
          <TouchableOpacity
            onPress={() => handleRemoveField(index)}
            activeOpacity={0.7}
            style={{
              height: 30,
              width: 50,
              borderRadius: 20,
              backgroundColor: 'pink',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'red',
            }}>
            <MaterialIcons
              name={'clear'}
              color={theme.red}
              size={theme.h6.size}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const VisitorReq = ({navigation}) => {
  const {t} = useTranslation();
  const ref = useRef([]);
  const [agreed, setAgreed] = useState(false);
  const [expanded, setExpanded] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const textReg = /^[A-Za-z]+$/;
  const numReg = /^[1-3][0-9]{9}$/;
  const mySchema = yup.object().shape({
    model_id: yup.string().required(t('newRequest.errorUnit')),
    visitor: yup.array().of(
      yup.object().shape({
        fName: yup
          .string()
          .matches(textReg, t('visitorReq.errorNameValid'))
          .required(t('signUp.errorName')),
        lName: yup
          .string()
          .matches(textReg, t('visitorReq.errorNameValid'))
          .required(t('signUp.errorName')),
        mobile: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
        nationalID: yup
          .string()
          .matches(numReg, t('visitorReq.errorNationalIDValid'))
          .required(t('visitorReq.errorNationalID')),
      }),
    ),
    // email: yup.string().email().required(t('signUp.errorEmail')),
  });
  const role = useSelector(state => state.user.data.role);

  const query = useQuery(`ListOfUnitsInRequestInVisit`, () =>
    role != Management && role != Admin && role != Security
      ? mngmtHttp
          .get(`/dashboard/my-units`)
          .then(response => response.data.data)
      : mngmtHttp
          .get(`/single-units/lite-list`)
          .then(response => response.data.data),
  );
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      model_id: '',
      model_type: 'property',
      is_urgent: false,
      visitor: [
        {
          fName: '',
          lName: '',
          nationalID: '',
          mobile: '',
          countryCode: 'SA',
        },
      ],
    },
    resolver: yupResolver(mySchema),
  });

  const submit = data => {
    if (!agreed) {
      AlertHelper.showMessage('info', t('requests.pleaseAgreeMsg'));
    }
    agreed &&
      navigation.navigate('ReqTimeDate', {
        type: 4,
        // visitData: {...data, mobile: mobile},
        visitData: {...data, terms_and_conditions: true},
      });
  };

  const handlePress = id => {
    id === expanded ? setExpanded(null) : setExpanded(id);
  };

  const {fields, append, remove, swap, move, insert} = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'visitor', // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const handleAddFiled = () => {
    append({
      fName: '',
      lName: '',
      nationalID: '',
      mobile: '',
      countryCode: 'SA',
    });
  };

  const handleRemoveField = id => {
    remove(id);
  };

  useEffect(() => {
    agreed && setModalVisible(true);
  }, [agreed]);

  return (
    <Scrollable style={{flex: 1, backgroundColor: theme.whiteColor}}>
      <Header name={t('newRequest.title')} navigation={navigation} />
      <View style={styles.body}>
        <View style={styles.titleContainer}>
          <WhiteSpace variant={1} />
          <AppText fontSize={theme.titleFontSize} Tcolor={theme.primaryColor}>
            {t('visitorReq.message')}
          </AppText>
        </View>

        <View
          style={{
            paddingTop: 20,
            flex: 1,
            zIndex: 10,
          }}>
          <View style={{marginBottom: 10}}>
            {query?.data && (
              <AppDropDownController
                placeholder={t('accounting.selectUnit')}
                data={query}
                control={control}
                type="unit"
                name="model_id"
                error={errors?.model_id}
                withHeader={false}
              />
            )}
          </View>
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: '#fff',
            }}>
            {fields?.map((field, idx) => {
              return (
                <>
                  <List.Accordion
                    key={field.id}
                    style={{
                      height: 50,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#F0F0F0',
                    }}
                    titleStyle={{
                      color: theme.blackColor,
                      fontSize: theme.s1.size,
                      fontWeight: theme.s1.fontWeight,
                    }}
                    title={`${t('visitorReq.visitor')} ${idx + 1}`}
                    expanded={expanded === idx}
                    onPress={() => handlePress(idx)}
                    //
                  >
                    <VisitorForm
                      index={idx}
                      fieldId={field.id}
                      control={control}
                      errors={errors.visitor ? errors?.visitor[idx] : null}
                      handleAddFiled={handleAddFiled}
                      handleRemoveField={handleRemoveField}
                      t={t}
                      fields={fields}
                      ref={ref}
                    />
                  </List.Accordion>
                  {idx != fields.length - 1 && <View style={{height: 10}} />}
                </>
              );
            })}
            <View style={{height: 20}} />
          </View>
        </View>
        <View style={{marginHorizontal: 20}}>
          {fields.length < 3 && (
            <TouchableOpacity
              onPress={() => {
                fields.length < 3 && handleAddFiled();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialIcons
                name={'add'}
                color={theme.primaryColor}
                size={theme.h5.size}
              />
              <AppText
                textAlign={'left'}
                regular
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                Tcolor={theme.primaryColor}>
                {t('visitorReq.addMore')}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.btnContainer}>
          <AppCheckBox
            text={t('requests.agreeToThe')}
            text2={t('requests.termsOfService')}
            textStyle2={{color: theme.primaryColor}}
            textStyle={{fontFamily: null, color: theme.greyColor}}
            state={[agreed, setAgreed]}
            hideDivider
          />
          <AppButton
            title={t('common.next')}
            onPress={handleSubmit(submit)}
            Bcolor={theme.primaryColor}
            Tcolor={theme.whiteColor}
            rounded={8}
          />
        </View>
        <Modal
          isVisible={modalVisible}
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          onRequestClose={() => setModalVisible(false)}
          style={{
            justifyContent: 'flex-end',
            marginBottom: 0,
            marginHorizontal: 0,
          }}
          useNativeDriverForBackdrop={true}
          useNativeDriver={true}>
          <View
            style={{
              height: '80%',
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                alignItems: 'flex-end',
                paddingHorizontal: 20,
                paddingTop: 10,
              }}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: theme.white,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 0.5,
                  borderColor: theme.greyColor,
                }}>
                <MaterialIcons
                  name={'close'}
                  color={theme.greyColor}
                  size={theme.h5.size}
                />
              </Pressable>
            </View>
            <WebView
              source={{
                // uri:
                // 'https://netorgft8543522-my.sharepoint.com/:w:/g/personal/haseeb_goatar_com/ESIBsV0ZU1FNqsea9T7Hpt4BwdWta--QeyrS9iC43QpHtQ?rtime=kZgMYAO02Ug',
                html: `
                <div style="font-size:30px;direction:rtl;line-height:2; margin:3rem">
                <h1>تعليمات دخول الزوار</h1>
                <ul><li>التقييد بالآداب والذوق العام واحترام خصوصية السكان.</li><li>إبلاغ البوابة في حال وجود زوار لديكم وتعبئة بياناتهم عبر النموذج الخاص بأسماء الزوار، ولن يتم استقبال أي زائر لم يوضع اسمه مسبقاً بالبوابة، ولا يتم اعتماد الزوار إلا من خلال الساكن فقط.</li><li>إبلاغ الزوار بإحضار أصل الأثبات للسماح له بالدخول وتمكين الحارس من تطبيق الأثبات للزوار.</li><li>أقصى حد للزوار عدد 2 أشخاص باليوم ويتم الزيادة أو النقص في العدد المسموح من قبل الإدارة حسب ما تراه مناسب.</li><li>أخذ الموافقة المسبقة من إدارة المجمع لدخول أي شركة صيانة او إدخال وإخراج أثاث من المجمع.</li><li>احترام الموظفين المتواجدين لحمايتكم ولراحتكم وعدم عرض عليهم أي مساعده تخل بعملهم.</li><li>لا يحق للزائر استضافة أي زائر دائم للوحدة دون علم الإدارة.</li><li>كل ساكن مسؤول مسئولية تامة عن الزائر وما يترتب على دخوله للمجمع.</li><li>لا يسمح للساكن إدخال أي زائر او زائره لا يحمل إثبات الهوية.</li><li>ضرورة التقيد بالعادات والآداب العامة وقواعد الشرع في المظهر والسلوك في جميع مرافق المجمع.</li><li>جميع القوانين المستحدثة والجديدة حسب انظمة الدولة او النظام الداخلي للعقار او الارشادات المعلقة في الممرات والمداخل تعتبر من ضمن التعليمات التي يجب على المستأجر الالتزام والتقيد بها وعدم مخالفتها. </li></ul>
                </div>
                  `,
              }}
            />
          </View>
        </Modal>
      </View>
    </Scrollable>
  );
};

export default VisitorReq;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    // justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  titleContainer: {
    // flex: 1,
    // backgroundColor: 'red',
  },
  formContainer: {
    flex: 7,
    // backgroundColor: 'pink',
    // backgroundColor: 'pink',
    // // alignContent: 'center',
    // // justifyContent: 'center',
    // alignItems: 'center',
  },
  formRowContainer: {
    paddingVertical: 5,
  },

  btnContainer: {
    // justifyContent: 'center',
    // backgroundColor: 'pink',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

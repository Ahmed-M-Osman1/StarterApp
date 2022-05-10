import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {useQuery, useQueryClient} from 'react-query';
import DocumentPicker from 'react-native-document-picker';
import {HP, theme} from '../../../utils/design';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import {
  TRANSACTION_CU_PROPERTIES,
  TRANSACTION_CU_USERS,
} from '../../../utils/constants/QueryKey';
import {Tenant} from '../../../utils/constants/Role';
import {handleError, mngmtHttp} from '../../../utils/http/Http';
import {MultiUnit} from '../../../utils/constants/PropertyType';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import Header from '../../../components/Header';
import useTransCategories from '../../../utils/hooks/useTransCategories';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {uploadFile} from '../../../utils/uploadFile';
import {AlertHelper} from '../../../utils/AlertHelper';
import CalendarInputController from '../../../components/controlled/CalendarInputController';

const CreateTransaction = ({navigation, route}) => {
  const {type} = route.params;
  const {t} = useTranslation();
  const categories = useTransCategories(type);

  const queryClient = useQueryClient();

  // const [showCalendar, setShowCalendar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const [fileName, setFileName] = useState();

  const mySchema = yup.object().shape({
    category: yup.string().required(t('createTransaction.errorCategory')),
    amount: yup.string().required(t('createTransaction.errorAmount')),
    // subcategory: yup.object().shape({
    //   id: yup.string().required(t('createTransaction.errorSubCategory')),
    // }),
    assignee: yup.object().shape({
      id: yup.string().required(t('createTransaction.errorAssignee')),
    }),
    // property: yup.object().shape({
    //   id: yup.string().required(t('createTransaction.errorProperty')),
    // }),
    unit: yup.object().shape({
      id: yup.string().required(t('createTransaction.errorUnit')),
    }),
    due_on: yup.string().required(t('createTransaction.errorDueDate')),
  });
  const form = useForm({
    defaultValues: {
      category: '',
      amount: '',
      subcategory: {
        id: null,
      },
      due_on: '',
      assignee: {
        id: '',
      },
      property: {
        id: '',
      },
      unit: {
        id: '',
      },
    },
    resolver: yupResolver(mySchema),
  });

  const submit = () => {
    setIsLoading(true);
    mngmtHttp
      .post('/transactions', {...form.getValues()})
      .then(response => {
        if (media) {
          uploadFile(media, 'transaction', response.data.data.id, () => {
            queryClient.invalidateQueries('TRANSACTIONS');
            queryClient.invalidateQueries('MoneyIn');
            queryClient.invalidateQueries('MoneyOut');
            setIsLoading(false);
            navigation.goBack();
          });
        }
        setIsLoading(false);
        navigation.goBack();
      })
      .catch(error => {
        setIsLoading(false);
        AlertHelper.show('error', t('common.error'), error);
        handleError(error, {
          setError: form.setError,
        });
      });
  };

  const properties = useQuery(TRANSACTION_CU_PROPERTIES, () =>
    mngmtHttp
      .get('/single-units/lite-list')
      .then(response => response.data.data),
  );

  const users = useQuery(TRANSACTION_CU_USERS, () =>
    mngmtHttp
      .get('/contacts/lite-list', {params: {role: Tenant}})
      .then(response => response.data.data),
  );
  let selectedUser = form.watch('assignee.id');

  const category = form.watch('category');
  const propertyId = form.watch('property.id');

  const subcategories = !category
    ? []
    : categories.data?.find(c => c.id == category).subcategories;

  const selectedProperty = properties.data
    ? properties.data.find(p => p.id == propertyId)
    : null;

  const units = selectedProperty ? selectedProperty.units : [];

  const attachMedia = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFileName(res.name);
      setMedia(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  let filteredProperties = properties.data?.filter(
    p => p.tenant_id == selectedUser,
  );

  return (
    <View style={styles.container}>
      <Header name={t('createTransaction.title')} navigation={navigation} />
      <ScrollView style={{flex: 1}}>
        <View style={styles.formContainer}>
          <AppDropDownController
            placeholder={t('createTransaction.category')}
            data={categories}
            control={form.control}
            name="category"
            error={form.formState.errors?.category}
          />
          {category != '' && subcategories.length > 1 && (
            <AppDropDownController
              placeholder={t('createTransaction.subCategory')}
              data={{data: subcategories}}
              control={form.control}
              name="subcategory.id"
              error={form.formState.errors?.subcategory?.id}
            />
          )}
          <AppTextInputController
            placeholder={t('createTransaction.amount')}
            keyboardType={'decimal-pad'}
            control={form.control}
            name="amount"
            placeholderTextColor={'#7c7c7c'}
            style={{borderRadius: 5, height: 45}}
            error={form.formState.errors?.amount}
          />
          <CalendarInputController
            name="due_on"
            control={form.control}
            title={t('createTransaction.due_on')}
            placeholder={t('createTransaction.due_on')}
            error={form.formState.errors?.due_on}
            // state={[showCalendar, setShowCalendar]}
          />
          <AppDropDownController
            placeholder={
              type === 'in' ? t('accounting.payer') : t('accounting.payee')
            }
            data={users}
            control={form.control}
            name="assignee.id"
            error={form.formState.errors?.assignee?.id}
          />
          <AppDropDownController
            placeholder={t('accounting.unit')}
            data={selectedUser ? {data: filteredProperties} : properties}
            control={form.control}
            name="unit.id"
            error={form.formState.errors?.unit?.id}
          />

          {selectedProperty && selectedProperty.type === MultiUnit && (
            <AppDropDownController
              placeholder={'Single Units'}
              data={{data: units}}
              control={form.control}
              name="unit.id"
              error={form.formState.errors?.unit?.id}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        {fileName && (
          <View style={{alignSelf: 'center'}}>
            <AppText fontSize={theme.titleFontSize}>{fileName}</AppText>
          </View>
        )}
        <AppButton
          title={t('accounting.attach')}
          Bcolor={'#EFF7FA'}
          Tcolor={'#005373'}
          fontSize={14}
          rounded={8}
          leftIcon={'paperclip'}
          iconColor={'#005373'}
          onPress={attachMedia}
        />
        <AppButton
          title={t('common.save')}
          onPress={form.handleSubmit(submit)}
          rounded={8}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

export default CreateTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  formContainer: {
    flex: 1,
    marginVertical: 30,
  },
  btnContainer: {
    marginVertical: HP(1),
  },
});

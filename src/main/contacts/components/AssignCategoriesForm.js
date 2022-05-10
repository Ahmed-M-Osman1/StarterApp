import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {theme} from '../../../utils/design';
import AppText from '../../../components/AppText';
import CardWithBorder from '../../../components/CardWithBorder';
import AppCheckBox from '../../../components/AppCheckBox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SelectRow = ({text, onPress = () => {}, state = false}) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: 10, height: 30}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <AppText
          regular
          fontSize={theme.c1.size}
          fontWeight={theme.c1.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {text}
        </AppText>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => onPress()}
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <MaterialIcons
            name={state ? 'check-box' : 'check-box-outline-blank'}
            color={state ? theme.primaryColor : theme.greyColor}
            size={theme.h5.size}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
let cleanSubCats = [];

//
const AssignCategoriesForm = ({
  control,
  errors,
  t,
  categories,
  setCategories,
  allCategories = [],
  professionalCategories = [],
}) => {
  const addOldSubCategories = () => {
    for (let index = 0; index < professionalCategories.length; index++) {
      const c = professionalCategories[index];
      const x = c.request_sub_categories.map(subc => {
        return {
          category_id: subc.request_category_id,
          subcategory_id: subc.id,
        };
      });
      cleanSubCats = [...cleanSubCats, ...x];
    }
  };

  useEffect(() => {
    addOldSubCategories();
  }, []);
  useEffect(() => {
    setCategories([...categories, ...cleanSubCats]);
  }, [cleanSubCats]);

  const CheckBoxRow = ({field, category}) => {
    const addSubCategory = () => {
      if (!categories?.find(i => i.subcategory_id == field.id)) {
        setCategories([
          ...categories,
          {
            category_id: field.request_category_id,
            subcategory_id: field.id,
          },
        ]);
      }
      if (!!categories?.find(i => i.subcategory_id == field.id)) {
        setCategories([
          ...categories.filter(i => i.subcategory_id !== field.id),
        ]);
      }
    };
    return (
      <SelectRow
        text={field?.name ?? ''}
        onPress={addSubCategory}
        state={!!categories?.find(i => i.subcategory_id == field.id)}
      />
    );
  };

  const addCategory = data => {
    setCategories([...categories, {category_id: data}]);
  };
  const removeCategory = data => {
    setCategories([...categories.filter(i => i.category_id !== data)]);
  };

  const onPress = (data, value) => {
    value ? addCategory(data) : removeCategory(data);
  };
  const includeOldCategories = () => {
    setCategories([...professionalCategories.map(c => ({category_id: c.id}))]);
  };

  useEffect(() => {
    // for (let i = 0; i < professionalCategories.length; i++) {
    //   onPress(professionalCategories[i].code, true);
    // }

    includeOldCategories();
  }, []);

  const [active, setActive] = useState(false);

  return (
    <>
      {/*  */}
      <View style={{paddingHorizontal: 20}}>
        <AppText
          regular
          fontSize={theme.h6.size}
          fontWeight={theme.h6.fontWeight}
          Tcolor={theme.primaryColor}
          textAlign={'left'}>
          {t('CreateProfessional.AssignCategoriesForm.title')}
        </AppText>
        <View style={{height: 10}} />
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('CreateProfessional.AssignCategoriesForm.subtitle')}
        </AppText>
      </View>
      <View style={{height: 15}} />
      {/*  */}
      <View style={{marginHorizontal: 20}}>
        {allCategories.length > 0 ? (
          allCategories.map(category => (
            <View key={category.id}>
              <CardWithBorder
                onPress={onPress}
                data={category.id}
                enabled={
                  !!professionalCategories.find(pc => pc.id === category.id)
                }
                title={t(`requestsCategories.${category.name}`, {
                  defaultValue: category.name,
                })}>
                {category?.subCategories?.length > 0 ? (
                  category?.subCategories.map(item => (
                    <CheckBoxRow
                      key={item.name}
                      field={item}
                      category={category}
                      active={active}
                    />
                  ))
                ) : (
                  <></>
                )}
              </CardWithBorder>
              <View style={{height: 15}} />
            </View>
          ))
        ) : (
          // <CardWithBorder title={'Maintenance'}>
          //   {allCategories.map(item => (
          //     <CheckBoxRow key={item} field={item} />
          //   ))}
          // </CardWithBorder>
          <></>
        )}
      </View>
    </>
  );
};

export default AssignCategoriesForm;

import React, {useState, useEffect} from 'react';
import {Switch, TouchableOpacity, View} from 'react-native';
import {theme} from '../../../utils/design';
import AppText from '../../../components/AppText';
import {CardWithShadow} from '../../../components/CardWithShadow';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import i18next from 'i18next';
import {i18n} from '../../../utils/i18n';

const RegularCard = ({
  item,
  t,
  allSelected,
  permissionCategories,
  addOrRemovePermission,
  addOrRemoveAllActions,
  permissions,
  setAllSelected,
}) => {
  return (
    <>
      {permissionCategories[item]?.PARENT && (
        <View style={{marginVertical: 6}}>
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {i18n.t(`PermissionSubjects.${permissionCategories[item]?.PARENT}`)}
          </AppText>
        </View>
      )}
      <CardWithShadow style={{marginBottom: 20}} title={''}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 3}}>
            <AppText
              regular
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {i18n.t(`PermissionSubjects.${item}`)}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => {
              setAllSelected({
                ...allSelected,
                [item]: allSelected[item] ? false : true,
              });
              addOrRemoveAllActions(item);
            }}
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <AppText
              regular
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              Tcolor={theme.greyColor}
              textAlign={'left'}>
              {t('CreateManager.AssignPermissionForm.all')}
            </AppText>
            <MaterialIcons
              name={
                !!allSelected[item] ? 'check-box' : 'check-box-outline-blank'
              }
              color={!!allSelected[item] ? theme.primaryColor : theme.greyColor}
              size={theme.h5.size}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: 15}} />
        {!allSelected[item] && <></>}
        <View>
          {permissionCategories[item]?.ACTIONS?.map(action => (
            <SelectRow
              key={action}
              text={action}
              category={item}
              state={false}
              onPress={addOrRemovePermission}
              // isSelected={isSelected}
              permissions={permissions}
            />
          ))}
        </View>
      </CardWithShadow>
    </>
  );
};

const SelectRow = ({text, category, onPress = () => {}, permissions}) => {
  const [selected, setSelected] = useState(isSelected);

  const isSelected = (category, action) => {
    setSelected(!!permissions[category].find(i => i === action));
  };
  useEffect(() => {
    isSelected(category, text);
  }, [permissions]);

  return (
    <View style={{flexDirection: 'row', marginVertical: 10, height: 30}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <AppText
          regular
          fontSize={theme.c1.size}
          fontWeight={theme.c1.fontWeight}
          Tcolor={theme.greyColor}
          textAlign={'left'}>
          {i18next.t(`PermissionActions.${text}`)}
        </AppText>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            setSelected(!selected);
            onPress(text, category);
          }}
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <MaterialIcons
            name={!!selected ? 'check-box' : 'check-box-outline-blank'}
            // name={'check-box-outline-blank'}
            color={!!selected ? theme.primaryColor : theme.greyColor}
            size={theme.h5.size}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

//
const AssignPermissionForm = ({
  t,
  permissionCategories,
  permissions,
  setPermissions,
  enabled,
  onPress = () => {},
}) => {
  //
  const [allSelected, setAllSelected] = useState('');
  const [isEnabled, setIsEnabled] = useState(enabled);
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    onPress(!isEnabled);
  };
  //
  const addOrRemoveAllActions = category => {
    if (allSelected[category]) {
      setPermissions({
        ...permissions,
        [category]: [],
      });
    } else {
      setPermissions({
        ...permissions,
        [category]: [...permissionCategories[category].ACTIONS],
      });
    }
  };
  //
  const addOrRemovePermission = (item, category) => {
    const clone = {...permissions};
    if (!!clone[category]?.find(i => i === item)) {
      clone[category] = clone[category].filter(i => i !== item);
      setPermissions({...clone});
    } else if (!clone[category].find(i => i === item)) {
      setPermissions({...clone, [category]: [...clone[category], item]});
    }
  };

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
          {t('CreateManager.AssignPermissionForm.title')}
        </AppText>
        <View style={{height: 10}} />
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('CreateManager.AssignPermissionForm.subtitle')}
        </AppText>
      </View>
      <View style={{height: 15}} />
      {/*  */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginHorizontal: 20,
        }}>
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('CreateManager.AssignPermissionForm.selectAll')}
        </AppText>
        <Switch
          trackColor={{false: theme.greyColor, true: theme.primaryColor}}
          thumbColor={theme.whiteColor}
          ios_backgroundColor={theme.greyColor}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{
            transform: [{scaleX: 0.6}, {scaleY: 0.6}],
            right: -8,
          }}
        />
      </View>
      <View style={{height: 15}} />
      {/*  */}
      {!enabled && (
        <View style={{marginHorizontal: 20}}>
          {Object.keys(permissionCategories).map((item, idx) => (
            <RegularCard
              t={t}
              item={item}
              key={item}
              allSelected={allSelected}
              permissionCategories={permissionCategories}
              permissions={permissions}
              addOrRemovePermission={addOrRemovePermission}
              addOrRemoveAllActions={addOrRemoveAllActions}
              setAllSelected={setAllSelected}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default AssignPermissionForm;

import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppCheckBoxController from '../../../components/controlled/AppCheckBoxController';
import * as Subjects from '../../../utils/constants/PermissionSubject';
import * as Actions from '../../../utils/constants/PermissionAction';
import AppText from '../../../components/AppText';
import {useTranslation} from 'react-i18next';
import {theme, WP} from '../../../utils/design';

function CRUDList({form, subject, permissions}) {
  const {t} = useTranslation();

  return (
    <>
      <Checkbox
        subject={subject}
        text={t('permissions.actions.view')}
        action={Actions.VIEW}
        form={form}
      />
      <Checkbox
        subject={subject}
        text={t('permissions.actions.create')}
        action={Actions.CREATE}
        form={form}
        disabled={!permissions[subject][Actions.VIEW]}
      />
      <Checkbox
        subject={subject}
        text={t('permissions.actions.edit')}
        action={Actions.UPDATE}
        form={form}
        disabled={!permissions[subject][Actions.VIEW]}
      />
      <Checkbox
        subject={subject}
        text={t('permissions.actions.delete')}
        action={Actions.DELETE}
        form={form}
        disabled={!permissions[subject][Actions.VIEW]}
      />
    </>
  );
}

function Checkbox({subject, action, disabled = false, form, text}) {
  return (
    <View>
      <AppCheckBoxController
        control={form.control}
        name={`permissions.${subject}.${action}`}
        disabled={disabled}
        text={text}
        withSpaceBetween
        checkboxContainerStyle={styles.checkboxContainer}
      />
    </View>
  );
}

export default function PermissionsForm({form}) {
  const {t} = useTranslation();
  const permissions = form.watch('permissions');

  return (
    <View style={styles.rootContainer}>
      <View style={{height: 30}} />

      <AppText
        textAlign="left"
        Tcolor={theme.blackColor}
        fontSize={theme.titleFontSize}>
        {t('contacts.permissions')}
      </AppText>
      <View style={{height: 30}} />
      <AppText Tcolor={theme.greyColor} textAlign="left">
        {t('permissions.subjects.contacts')}
      </AppText>
      <View style={{height: 10}} />
      <View style={styles.pemissionsContainer}>
        <CRUDList
          subject={Subjects.CONTACTS}
          form={form}
          permissions={permissions}
        />
      </View>
      <View style={{height: 30}} />

      <AppText Tcolor={theme.greyColor} textAlign="left">
        {t('permissions.subjects.communities')}
      </AppText>
      <View style={{height: 10}} />

      <View style={styles.pemissionsContainer}>
        <CRUDList
          subject={Subjects.COMMUNITIES}
          form={form}
          permissions={permissions}
        />
      </View>
      <View style={{height: 30}} />

      <AppText Tcolor={theme.greyColor} textAlign="left">
        {t('permissions.subjects.buildings')}
      </AppText>
      <View style={{height: 10}} />

      <View style={styles.pemissionsContainer}>
        <CRUDList
          subject={Subjects.BUILDINGS}
          form={form}
          permissions={permissions}
        />
      </View>
      <View style={{height: 30}} />

      <AppText Tcolor={theme.greyColor} textAlign="left">
        {t('permissions.subjects.units')}
      </AppText>
      <View style={{height: 10}} />

      <View style={styles.pemissionsContainer}>
        <CRUDList
          subject={Subjects.UNITS}
          form={form}
          permissions={permissions}
        />
      </View>
      <View style={{height: 30}} />

      <AppText Tcolor={theme.greyColor} textAlign="left">
        {t('permissions.subjects.transactions')}
      </AppText>
      <View style={{height: 10}} />

      <View style={styles.pemissionsContainer}>
        <CRUDList
          subject={Subjects.TRANSACTIONS}
          form={form}
          permissions={permissions}
        />
      </View>
      <View style={{height: 30}} />

      <AppText Tcolor={theme.greyColor} textAlign="left">
        {t('permissions.subjects.requests')}
      </AppText>
      <View style={{height: 10}} />

      <View style={styles.pemissionsContainer}>
        <CRUDList
          subject={Subjects.REQUESTS}
          form={form}
          permissions={permissions}
        />
      </View>
      <View style={{height: 30}} />
      <AppText Tcolor={theme.greyColor} textAlign="left">
        {t('permissions.subjects.dashboard')}
      </AppText>
      <View style={{height: 10}} />

      <View style={styles.pemissionsContainer}>
        <Checkbox
          subject={Subjects.DASHBOARD}
          text={t('permissions.actions.view')}
          action={Actions.VIEW}
          form={form}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    padding: 0,
  },
  rootContainer: {
    marginHorizontal: WP(5),
  },
});

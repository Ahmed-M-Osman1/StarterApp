export const transformPermissions = (permissions) => {
  const transformedPermissions = [];

  Object.keys(permissions).forEach(permissionKey => {
    const permission = { name: permissionKey, actions: [] };
    const subjectPermissions = permissions[permissionKey];

    if (subjectPermissions.VIEW) {
      Object.keys(subjectPermissions).forEach(actionKey => {
        if (subjectPermissions[actionKey]) {
          permission.actions.push(actionKey);
        }
      });

      transformedPermissions.push(permission);
    }
  });

  return transformedPermissions;
}
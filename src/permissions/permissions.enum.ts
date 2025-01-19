export enum PermissionsEnum {
  GET_ADMIN_USERS = 'GET_ADMIN_USERS',
  CREATE_ADMIN_USER = 'CREATE_ADMIN_USER',
  UPDATE_ADMIN_USER = 'UPDATE_ADMIN_USER',
  DELETE_ADMIN_USER = 'DELETE_ADMIN_USER',
  RECOVER_ADMIN_USER = 'RECOVER_ADMIN_USER',
  CHANGE_ADMIN_USER_PASSWORD = 'CHANGE_ADMIN_USER_PASSWORD',

  GET_ROLES = 'GET_ROLES',
  CREATE_ROLE = 'CREATE_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',

  GET_FILIALS = 'GET_FILIALS',
  CREATE_FILIAL = 'CREATE_FILIAL',
  UPDATE_FILIAL = 'UPDATE_FILIAL',
  DELETE_FILIAL = 'DELETE_FILIAL',

  GET_PRODUCTS = 'GET_PRODUCTS',
  CREATE_PRODUCT = 'CREATE_PRODUCT',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  RECOVER_PRODUCT = 'RECOVER_PRODUCT',
}

type PermissionsDictType = Record<PermissionsEnum, string>;

export const PermissionsDict: PermissionsDictType = {
  [PermissionsEnum.GET_ADMIN_USERS]: 'Получить список сотрудников',
  [PermissionsEnum.CREATE_ADMIN_USER]: 'Создать сотрудника',
  [PermissionsEnum.UPDATE_ADMIN_USER]: 'Обновить информацию о сотруднике',
  [PermissionsEnum.CHANGE_ADMIN_USER_PASSWORD]: 'Обновить пароль сотрудника',
  [PermissionsEnum.DELETE_ADMIN_USER]: 'Удалить сотрудника',
  [PermissionsEnum.RECOVER_ADMIN_USER]: 'Восстановить сотрудника',

  [PermissionsEnum.GET_ROLES]: 'Получить список ролей',
  [PermissionsEnum.CREATE_ROLE]: 'Создать роль',
  [PermissionsEnum.UPDATE_ROLE]: 'Обновить роль',
  [PermissionsEnum.DELETE_ROLE]: 'Удалить роль',

  [PermissionsEnum.GET_FILIALS]: 'Получить список филиалов',
  [PermissionsEnum.CREATE_FILIAL]: 'Создать филиал',
  [PermissionsEnum.UPDATE_FILIAL]: 'Обновить филиал',
  [PermissionsEnum.DELETE_FILIAL]: 'Удалить филиал',

  [PermissionsEnum.GET_PRODUCTS]: 'Получить список товаров',
  [PermissionsEnum.CREATE_PRODUCT]: 'Создать товар',
  [PermissionsEnum.UPDATE_PRODUCT]: 'Обновить товар',
  [PermissionsEnum.DELETE_PRODUCT]: 'Удалить товар',
  [PermissionsEnum.RECOVER_PRODUCT]: 'Восстановить товар',
};

export enum PermissionGroups {
  ADMIN_USERS = 'Сотрудники',
  ROLES = 'Роли',
  FILIALS = 'Филиалы',
  PRODUCTS = 'Товары',
}

type PermissionGroupsDictType = Record<
  keyof typeof PermissionGroups,
  Set<PermissionsEnum>
>;

export const PermissionsGroupsDict: PermissionGroupsDictType = {
  ADMIN_USERS: new Set([
    PermissionsEnum.CREATE_ADMIN_USER,
    PermissionsEnum.DELETE_ADMIN_USER,
    PermissionsEnum.GET_ADMIN_USERS,
    PermissionsEnum.RECOVER_ADMIN_USER,
    PermissionsEnum.CHANGE_ADMIN_USER_PASSWORD,
    PermissionsEnum.UPDATE_ADMIN_USER,
  ]),
  ROLES: new Set([
    PermissionsEnum.CREATE_ROLE,
    PermissionsEnum.DELETE_ROLE,
    PermissionsEnum.GET_ROLES,
    PermissionsEnum.UPDATE_ROLE,
  ]),
  FILIALS: new Set([
    PermissionsEnum.CREATE_FILIAL,
    PermissionsEnum.DELETE_FILIAL,
    PermissionsEnum.GET_FILIALS,
    PermissionsEnum.UPDATE_FILIAL,
  ]),
  PRODUCTS: new Set([
    PermissionsEnum.CREATE_PRODUCT,
    PermissionsEnum.DELETE_PRODUCT,
    PermissionsEnum.GET_PRODUCTS,
    PermissionsEnum.UPDATE_PRODUCT,
    PermissionsEnum.RECOVER_PRODUCT,
  ]),
};

export const ALL_PERMISSIONS = Object.values(PermissionsEnum);

export const FILIALED_PERMISSIONS = Object.values(PermissionsGroupsDict)
  .map((permissionSet) => [...permissionSet])
  .flat();

ALL_PERMISSIONS.every((perm) => FILIALED_PERMISSIONS.includes(perm));

for (const permission of ALL_PERMISSIONS) {
  if (!FILIALED_PERMISSIONS.includes(permission)) {
    throw new Error(
      `${permission} is not assigned to any permission group, please add it, before app launch`,
    );
  }
}

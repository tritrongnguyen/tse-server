export enum Routes {
  AUTH = '/auth',
  USERS = '/users',
  ADMIN = '/admin',
}

export enum Services {
  AUTH = 'AUTH_SERVICE',
  USER = 'USER_SERVICE',
  ADMIN = 'ADMIN_SERVICE',
}

export enum Guards {
  AUTHENTICATION = 'AUTHENTICATION_GUARD',
}

export enum Role {
  ADMIN = 'admin',
  SUPER_USER = 'super_user',
  LEADER = 'leader',
  MEMBER = 'member',
}

export type Pageable = {
  limit?: number;
  offset?: number;
};

export type Direction = "asc" | "desc";

export interface Sort {
  [key: string]: Direction | Sort;
}

export enum SuccessType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  READ = "read",
  LIST = "list",
  DELETE_PERMANENTLY = "delete_permanenty",
}

export enum UserStatus {
  DEACTIVATED = 0,
  ACTIVATED = 1,
  REJECTED = 2,
}

export enum UserType {
  SYSTEM = "SYSTEM",
  CUSTOMER = "CUSTOMER",
}

export type Role = {
  module: Module;
  permission: Permission;
};

export enum Module {
  CUSTOMER = "CUSTOMER",
  USER = "USER",
  ROLE = "ROLE",
  POST = "POST",
  ORDER = "ORDER",
}

export enum Permission {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
}

export enum OrderStatus {
  READY = "READY",
  AWAITING = "AWAITING",
  REWORK = "REWORK",
  DONE = "DONE",
  DRAFT = "DRAFT",
}

export enum FeedbackStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

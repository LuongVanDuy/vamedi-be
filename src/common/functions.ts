import { Pageable, Sort } from "./types";
import * as generator from "generate-password";
import * as xlsx from "xlsx";

export function getPageable(page?: number, itemsPerPage?: number): Pageable {
  const currentPage = page && page > 0 ? page - 1 : 0;
  const limit = itemsPerPage || 10;
  const offset = currentPage * limit;
  return { limit, offset };
}

export function getSort(sortBy?: string, sortDesc?: boolean): Sort {
  const sort = {};
  if (sortBy) {
    const direction = String(sortDesc) == "true" ? "desc" : "asc";
    if (sortBy.indexOf(".") == -1) {
      sort[sortBy] = direction;
    } else {
      const fields = sortBy.split(".");
      sort[fields[0]] = {
        [fields[1]]: direction,
      };
    }
  }
  return sort;
}

// Exclude keys from object
export function exclude<T, Key extends keyof T>(
  obj: T,
  ...keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}

export const generatePassword = () => {
  return generator.generate({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
};

export const jsonValue = (value: any) => {
  return value ? JSON.parse(JSON.stringify(value)) : undefined;
};

export const matchField = (value: any) => {
  return value ? value : undefined;
};

export const likeField = (value: any) => {
  return value ? { contains: value } : undefined;
};

export const jsonField = (value: any) => {
  return value ? JSON.parse(value) : undefined;
};

export const inField = (list: any[]) => {
  return list ? { in: list } : undefined;
};

export const isEmptyOrSpaces = (str: string) => {
  return str === null || str.match(/^ *$/) !== null;
};

export const readDataExcel = (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  let data: any[] = [];

  sheetNames.forEach((sheetName) => {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    data = data.concat(sheetData);
  });

  return data;
};

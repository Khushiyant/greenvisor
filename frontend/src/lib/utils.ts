import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertToPascalCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidEmail(email: string): boolean {
  // Regular expression pattern for basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}


const sanitizeJson = (str: string): string => {
  const replaceAll = (str: string, find: string, replace: string) => {
    return str.replace(new RegExp(find, 'g'), replace);
  };

  // Remove BOM if present
  str = str.replace(/^\uFEFF/, '');

  // Remove illegal control characters
  // eslint-disable-next-line no-control-regex
  str = str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  // Replace single quotes with double quotes (naively, may need refinement)
  str = str.replace(/'/g, '"');

  // Remove or fix improper backslashes
  str = replaceAll(str, '\\', '\\\\');

  // Remove trailing commas
  str = str.replace(/,(\s*[}\]])/g, '$1');

  return str;
};

export const tryJsonParse = <T>(json: string, onError?: (ex: unknown) => void): T => {
  try {
    if (typeof json === 'object') return json as T;
    if (!json || !json.length) return {} as T;
    const o = JSON.parse(json);
    return o;
  } catch {
    console.warn('base JSON.parse failed', json);

    try {
      // Sanitize and reattempt parsing
      const sanitizedJson = sanitizeJson(json);
      const o = JSON.parse(sanitizedJson);

      console.warn('... but we fixed it');
      return o;
    } catch (ex) {
      console.error('Parsing still failed after sanitization', ex);
      onError?.(ex);
      return {} as T;
    }
  }
};



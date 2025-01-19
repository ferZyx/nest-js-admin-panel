import { v5 as uuidv5 } from 'uuid';

export function getRandonRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
export const normalizeCoord = (v) => v && Number(v.toFixed(6));

export function parsePhone(v: string): string {
  const phone: string = v.match(/\d+/g)?.join('').slice(-10) ?? '';
  return phone;
}

const cyrillicToLatin = (inputString: string) => {
  const cyrillicToLatinMap: { [key: string]: string } = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'shh',
    ъ: '',
    ы: 'i',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  const cyrillicRegExp = new RegExp(
    Object.keys(cyrillicToLatinMap).join('|'),
    'g',
  );

  const stringWithLatin = inputString.replace(cyrillicRegExp, (match) => {
    return cyrillicToLatinMap[match];
  });

  return stringWithLatin;
};

const cyrillicToLatinString = (name: string) => {
  try {
    const nameNoSpaces = name
      .replace(/ /g, '-')
      ?.replace(/\//g, '-')
      ?.toLowerCase();
    const onlyLatin = cyrillicToLatin(nameNoSpaces);
    return encodeURIComponent(onlyLatin);
  } catch (error) {
    return name;
  }
};

export default cyrillicToLatinString;

export const wait = (timeout: number) =>
  new Promise((r) => setTimeout(() => r(null), timeout));

export function parseSimFolderSlot(slot: string) {
  const match = slot.match(/^([A-Z])(\d{1,2})$/);

  if (match) {
    const [slot, letter, number] = match;

    return {
      slot,
      letter,
      number,
    };
  }
}
export const polygonToBounds = (polygon: number[][]) => {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;

  polygon.forEach((point) => {
    const [lng, lat] = point;
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  });

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

export function generateUuid(name: string) {
  return uuidv5(name, '82bccf4a-0a76-45b8-b6bc-0c770a4cf02e');
}

export function generateFilename(file: {
  mimetype: string;
  originalname: string;
}) {
  const finish = (name: string, ext: string) => {
    const filename = `${name}${ext}`;
    if (ext.length > 5) {
      throw new Error('Неверный формат файла');
    } else {
      return filename;
    }
  };

  const name = generateUuid(`${new Date().getTime()}_${file.originalname}`);
  try {
    const ext = file.originalname.split('.').pop();
    return finish(name, `.${ext}`);
  } catch (error) {
    return file.originalname;
  }
}

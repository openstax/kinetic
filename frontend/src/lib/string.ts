import { isString } from './util'

export function capitalize(string: string, lowerOthers = true) {
    const other = lowerOthers ? string.substring(1).toLowerCase() : string.substring(1);
    return string.charAt(0).toUpperCase() + other;
}

export function toSentence(arry: string | string[], join = 'and') {
    if (isString(arry)) { arry = arry.split(' '); }
    if (arry.length > 1) {
        return `${arry.slice(0, arry.length - 1).join(', ')} ${join} ${arry.slice(-1)}`;
    } else {
        return arry[0];
    }
}

export const titleize = (input: string) => {
    return input.toLowerCase().replace('_', ' ').replace(/(?:^|\s|-)\S/g, x => x.toUpperCase())
}

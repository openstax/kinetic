import { isDate, isString, isNumber } from './util'
import dayjs from 'dayjs'

export type DateTimeInputs = Date | string | number | dayjs.Dayjs

export const toDateTime = (dateThing: DateTimeInputs): Date => {
    if (isDate(dateThing)){
        return dateThing
    } else if (dayjs.isDayjs(dateThing)) {
        return dateThing.toDate()
    } else if (isString(dateThing)) {
        return new Date(Date.parse(dateThing))
    } else if (isNumber(dateThing)) {
        return new Date(dateThing)
    } else {
        return new Date('invalid')
    }
}

export const toDayJS = (dateThing: DateTimeInputs) => dayjs(toDateTime(dateThing))

export const formatDate = (dateThing?: DateTimeInputs | null, format: string = 'MM/DD/YYYY'): string | null => {
    if (!dateThing) return null
    return dayjs(toDateTime(dateThing)).format(format)
}

export const toDayOnly = (dateThing: DateTimeInputs) => toDayJS(dateThing).format('YYYY-DD-MM')

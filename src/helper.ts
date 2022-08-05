import { ColumnProps } from '@/types/commonTypes'

export function generateFitUrl (column: ColumnProps, width: number, height: number) {
  if (column.avatar) {
    column.avatar.fitUrl = column.avatar.url + `?x-oss-process=image/resize,m_pad,h_${height},w_${width}`
  } else {
    column.avatar = {
      fitUrl: require('./assets/default.png')
    }
  }
}

interface CheckCondition {
  format?: string[];
  size?: number;
}

type ErrorType = 'size' | 'format' | null

export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const {
    format,
    size
  } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

// <T extends { _id?: string }>
// 1. T 对应TestProps的类型
// 2. T需要有一个特殊的属性_id
// 3. 一开始的对象需要断言成有key的属性
export const arrToObj = <T extends { _id?: string }> (arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}

export const objToArr = <T> (obj: { [key: string]: T }) => {
  return Object.keys(obj).map(key => obj[key])
}

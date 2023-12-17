/*
 * @Author: czy0729
 * @Date: 2023-12-17 08:12:58
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-12-17 08:28:18
 */
import { NEWS } from '@constants'
import { Loaded } from '@types'

export const NAMESPACE = 'ScreenAnitama'

export const EXCLUDE_STATE = {
  page: 1,
  ipt: '1'
}

export const STATE = {
  show: false,
  history: [],
  type: NEWS[0].value,
  useWebView: false,
  ...EXCLUDE_STATE,
  _loaded: false as Loaded
}

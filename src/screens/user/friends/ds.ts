/*
 * @Author: czy0729
 * @Date: 2022-08-07 03:57:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-12-17 11:23:09
 */
import { Loaded } from '@types'

export const NAMESPACE = 'ScreenFriends'

export const EXCLUDE_STATE = {
  filter: '',
  fetching: false
}

export const STATE = {
  sort: '',
  ...EXCLUDE_STATE,
  _loaded: false as Loaded
}

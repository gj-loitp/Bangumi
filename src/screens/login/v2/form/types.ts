/*
 * @Author: czy0729
 * @Date: 2022-09-03 03:41:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-27 10:36:00
 */
import { Fn, Navigation } from '@types'

export type Props = {
  navigation: Navigation
  info: string
  email: string
  password: string
  captcha: string
  base64: string
  isCommonUA: boolean
  host: string
  loading: boolean
  failed: boolean
  forwardRef: Fn
  onGetCaptcha: Fn
  onFocus: Fn
  onBlur: Fn
  onChange: Fn
  onLogin: Fn
  onSelect: Fn
  onUAChange: Fn
}

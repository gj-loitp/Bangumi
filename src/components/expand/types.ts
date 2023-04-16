/*
 * @Author: czy0729
 * @Date: 2022-05-31 08:31:39
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-16 11:10:28
 */
import { ViewStyle, ReactNode, Fn } from '@types'

export type Props = {
  /** 容器样式 */
  style?: ViewStyle

  /** 展开箭头样式 */
  moreStyle?: ViewStyle

  /** 比例 */
  ratio?: number

  /** 是否显示渐变 */
  linearGradient?: boolean

  /** 是否检测首屏渲染时内部组件高度, 若高度小于收缩容器高度, 直接调用展开回调 */
  checkLayout?: boolean

  /** 展开回调 */
  onExpand?: Fn

  children: ReactNode
}

/*
 * 自定义修改 react-native-hold-menu@0.1.1
 * https://github.com/enesozturk/react-native-hold-menu
 *  - 减轻全屏毛玻璃背景
 *  - 因为 https://github.com/enesozturk/react-native-hold-menu/issues/28 不能修复
 *    在 MenuItem.tsx(48行) 下使用订阅模式绕过 item.onPress 报错, 实现在 Expo@41 下可用此组件
 *
 * @Author: czy0729
 * @Date: 2021-12-27 06:57:47
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-12-27 07:03:06
 */
import HoldMenuProvider from './Provider'

export { HoldMenuProvider }

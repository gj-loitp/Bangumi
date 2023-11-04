/*
 * @Author: czy0729
 * @Date: 2020-04-21 10:09:14
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-11-04 05:51:09
 */
import React from 'react'
import { SafeAreaView as RNSafeAreaView } from 'react-navigation'
import { _ } from '@stores'
import { stl } from '@utils'
import { ob } from '@utils/decorators'
import { Props as SafeAreaViewProps } from './types'

export { SafeAreaViewProps }

export const SafeAreaView = ob(
  ({
    style,
    forceInset = {
      top: 'never'
    },
    children,
    ...other
  }: SafeAreaViewProps) => (
    <RNSafeAreaView
      style={stl(_.container.screen, style)}
      forceInset={forceInset}
      {...other}
    >
      {children}
    </RNSafeAreaView>
  )
)

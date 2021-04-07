/*
 * @Author: czy0729
 * @Date: 2019-05-08 20:23:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-03-21 01:09:35
 */
import React from 'react'
import { Touchable, Iconfont } from '@components'
import { _ } from '@stores'
import { IOS } from '@constants'
import ob from '../observer-props'

function IconBack({ style, navigation, color }) {
  return (
    <Touchable style={[styles.container, style]} onPress={navigation.goBack}>
      <Iconfont name='md-arrow-back' color={color} />
    </Touchable>
  )
}

export default ob(IconBack, {
  color: _.colorPlain
})

const styles = _.create({
  container: {
    padding: _.sm,
    paddingLeft: IOS ? _.sm : _.sm + 4
  }
})
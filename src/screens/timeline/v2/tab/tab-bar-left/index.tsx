/*
 * @Author: czy0729
 * @Date: 2019-04-14 20:26:45
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-01-04 16:58:14
 */
import React from 'react'
import { Button, Flex, Heatmap } from '@components'
import { Popover } from '@_'
import { obc } from '@utils/decorators'
import { MODEL_TIMELINE_SCOPE } from '@constants'
import { TimeLineScopeCn } from '@types'
import { Ctx } from '../../types'
import { COMPONENT, DATA } from './ds'
import { memoStyles } from './styles'

function TabBarLeft(props, { $ }: Ctx) {
  const styles = memoStyles()
  const { scope } = $.state
  return (
    <Popover data={DATA} onSelect={$.onSelectScope}>
      <Flex style={styles.tabBarLeft} justify='center'>
        <Button style={styles.btn} type='ghostMain' size='sm'>
          {MODEL_TIMELINE_SCOPE.getLabel<TimeLineScopeCn>(scope)}
        </Button>
      </Flex>
      <Heatmap id='时间胶囊.切换类型' />
    </Popover>
  )
}

export default obc(TabBarLeft, COMPONENT)

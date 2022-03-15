/*
 * @Author: czy0729
 * @Date: 2022-03-15 02:13:43
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-15 02:17:06
 */
import React from 'react'
import { Header as CompHeader, Flex, Heatmap } from '@components'
import { copy, cnjp, open } from '@utils'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { info } from '@utils/ui'
import HeaderTitle from './header-title'
import Extra from './extra'

function Header({ y, fixed }, { $, navigation }) {
  return (
    <CompHeader
      mode='transition'
      statusBarEventsType='Topic'
      y={y}
      fixed={fixed}
      title='人物'
      hm={[$.monoId, 'Mono']}
      headerTitle={<HeaderTitle $={$} navigation={navigation} />}
      headerRight={() => (
        <Flex>
          <Extra $={$} navigation={navigation} />
          <CompHeader.Popover
            data={['浏览器查看', '复制链接', '复制分享']}
            onSelect={key => {
              t('人物.右上角菜单', {
                key
              })

              switch (key) {
                case '浏览器查看':
                  open($.url)
                  break

                case '复制链接':
                  copy($.url)
                  info('已复制链接')
                  break

                case '复制分享':
                  copy(`【链接】${cnjp($.cn, $.jp)} | Bangumi番组计划\n${$.url}`)
                  info('已复制分享文案')
                  break

                default:
                  break
              }
            }}
          >
            <Heatmap id='人物.右上角菜单' />
          </CompHeader.Popover>
        </Flex>
      )}
    />
  )
}

export default obc(Header)

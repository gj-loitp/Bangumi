/*
 * @Author: czy0729
 * @Date: 2019-07-13 18:48:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-15 22:20:08
 */
import React from 'react'
import { View } from 'react-native'
import {
  HeaderPlaceholder,
  RenderHtml,
  Expand,
  Flex,
  Image,
  Text,
  Loading,
  Heatmap
} from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'

function Info(props, { $ }) {
  const { _title } = $.params
  const { title, content, create, _loaded } = $.groupInfo
  return (
    <View style={[styles.container, _.container.inner]}>
      <HeaderPlaceholder />
      <Text size={20} bold>
        {title || _title}
      </Text>
      {!!$.groupThumb && (
        <Flex style={_.mt.md} justify='center'>
          <Image
            src={$.groupThumb}
            size={80 * _.ratio}
            shadow
            placholder={false}
            imageViewer
            event={{
              id: '小组.封面图查看',
              data: {
                groupId: $.groupId
              }
            }}
          />
          <Heatmap id='小组.封面图查看' />
        </Flex>
      )}
      {!!content && (
        <Expand style={_.mt.lg} ratio={0.64}>
          <RenderHtml
            html={`${content}<p style="text-align:right;color:#999">${create}</p><br/>`}
          />
        </Expand>
      )}
      {!_loaded && (
        <Flex style={styles.loading} justify='center'>
          <Loading />
        </Flex>
      )}
    </View>
  )
}

export default obc(Info)

const styles = _.create({
  container: {
    minHeight: 328
  },
  loading: {
    height: 200
  }
})

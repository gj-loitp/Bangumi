/*
 * @Author: czy0729
 * @Date: 2020-03-22 15:37:07
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-03 12:24:20
 */
import React from 'react'
import { View } from 'react-native'
import { Touchable, Flex, Katakana, Text } from '@components'
import { _, discoveryStore } from '@stores'
import { findSubjectCn, HTMLDecode } from '@utils'
import { t } from '@utils/fetch'
import { obc } from '@utils/decorators'
import { EVENT, IMG_WIDTH } from '@constants'
import { Cover } from '../../base'
import { memoStyles } from './styles'
import { Props as ItemBlogProps } from './types'

export { ItemBlogProps }

export const ItemBlog = obc(
  (
    {
      style,
      id,
      cover,
      title,
      content,
      username,
      subject,
      time,
      replies,
      tags = [],
      event = EVENT
    }: ItemBlogProps,
    { navigation }
  ) => {
    const styles = memoStyles()
    const readed = discoveryStore.blogReaded(id)
    const line = []
    if (username) line.push(username)
    if (subject) line.push(findSubjectCn(subject, id))
    if (time) line.push(time)
    return (
      <Touchable
        style={[styles.container, style, readed && styles.readed]}
        onPress={() => {
          const { id: eventId, data: eventData } = event
          t(eventId, {
            to: 'Blog',
            blogId: id,
            ...eventData
          })

          discoveryStore.updateBlogReaded(id)
          navigation.push('Blog', {
            blogId: id,
            _title: title
          })
        }}
      >
        <Flex align='start' style={styles.wrap}>
          {!!cover && (
            <View style={styles.imgContainer}>
              <Cover src={cover} width={IMG_WIDTH} height={IMG_WIDTH} radius shadow />
            </View>
          )}
          <Flex.Item>
            <Text size={15} numberOfLines={2} bold>
              {HTMLDecode(title)}{' '}
              {replies !== '+0' && (
                <Text size={12} type='main' lineHeight={15} bold>
                  {replies}
                </Text>
              )}
            </Text>
            {!!line.length && (
              <View style={_.mt.xs}>
                <Katakana.Provider size={13}>
                  <Katakana type='sub' size={13}>
                    {line.join(' / ')}
                  </Katakana>
                </Katakana.Provider>
              </View>
            )}
            <Text style={_.mt.sm} size={13} numberOfLines={4} lineHeight={15}>
              {HTMLDecode(content)}
            </Text>
            {!!tags.length && (
              <Flex style={_.mt.sm}>
                <Flex.Item />
                <Text style={styles.tags} size={13}>
                  tags: {typeof tags === 'string' ? tags : tags.join(' ')}
                </Text>
              </Flex>
            )}
          </Flex.Item>
        </Flex>
      </Touchable>
    )
  }
)

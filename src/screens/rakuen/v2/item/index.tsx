/*
 * @Author: czy0729
 * @Date: 2019-04-27 20:21:08
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-14 02:30:32
 */
import React from 'react'
import { View } from 'react-native'
import { obc } from '@utils/decorators'
import { findSubjectCn, getIsBlockUser } from '@utils'
import Item from './item'
import { Ctx } from '../types'
import { LIMIT_HEAVY } from './ds'
import {
  getIsAd,
  getIsBlockGroup,
  getIsBlockKeyword,
  getIsGroup,
  getReplyCount,
  getTopicId,
  getUserId
} from './utils'
import { memoStyles } from './styles'

export default obc(
  (
    { index, avatar, userId, userName, group, groupHref, href, title, time, replies },
    { $ }: Ctx
  ) => {
    global.rerender('Rakuen.Item')

    const { _mounted } = $.state
    if (index >= LIMIT_HEAVY && !_mounted) {
      const styles = memoStyles()
      return <View style={styles.placeholder} />
    }

    const { blockKeywords, blockGroups, blockUserIds, isBlockDefaultUser } = $.setting
    const groupCn = findSubjectCn(group)
    const _userId = userId || getUserId(avatar)
    const replyCount = getReplyCount(replies)
    const topicId = getTopicId(href)
    if (
      getIsBlockKeyword(blockKeywords, title) ||
      getIsBlockGroup(blockGroups, groupCn) ||
      getIsBlockUser(blockUserIds, userName, _userId, `Rakuen|${topicId}|${index}`) ||
      getIsAd(isBlockDefaultUser, avatar, replyCount)
    ) {
      return null
    }

    const styles = memoStyles()
    return (
      <Item
        styles={styles}
        avatar={avatar}
        userId={_userId}
        userName={userName}
        group={group}
        groupHref={groupHref}
        groupCn={groupCn}
        href={href}
        title={title}
        time={time}
        topicId={topicId}
        replyCount={replyCount}
        isReaded={!!$.readed(topicId).time}
        isGroup={getIsGroup(topicId)}
      />
    )
  }
)

/*
 * @Author: czy0729
 * @Date: 2021-08-18 07:29:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-03 17:00:25
 */
import React from 'react'
import { Component } from '@components'
import { ob } from '@utils/decorators'
import Item from './item'
import { memoStyles } from './styles'
import { Props as ItemCommentProps } from './types'

export { ItemCommentProps }

export const ItemComment = ob(
  ({
    navigation,
    style,
    time,
    avatar,
    userId,
    userName,
    star,
    status,
    comment,
    subjectId,
    relatedId,
    event,
    popoverData,
    onSelect
  }: ItemCommentProps) => (
    <Component id='item-comment'>
      <Item
        navigation={navigation}
        styles={memoStyles()}
        style={style}
        time={time}
        avatar={avatar}
        userId={userId}
        userName={userName}
        star={star}
        status={status}
        comment={comment}
        subjectId={subjectId}
        relatedId={relatedId}
        event={event}
        popoverData={popoverData}
        onSelect={onSelect}
      />
    </Component>
  )
)

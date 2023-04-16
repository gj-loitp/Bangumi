/*
 * @Author: czy0729
 * @Date: 2019-04-30 18:47:13
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-16 11:34:34
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Text, Touchable, UserStatus } from '@components'
import { _ } from '@stores'
import { HTMLDecode, stl } from '@utils'
import { memo } from '@utils/decorators'
import { Avatar, Name, HTML, Likes } from '../../base'
import UserLabel from './user-label'
import FloorText from './floor-text'
import IconExtra from './icon-extra'
import ItemSub from './sub'
import { DEFAULT_PROPS, IMAGES_MAX_WIDTH } from './ds'

const AVATAR_SIZE = 36

const Item = memo(
  ({
    navigation,
    styles,
    contentStyle,
    topicId,
    authorId,
    avatar,
    erase,
    floor,
    id,
    isAuthor,
    isExpand,
    isFriend,
    isJump,
    isNew,
    matchLink,
    msg,
    postId,
    readedTime,
    replySub,
    showFixedTextare,
    expandNums,
    sub,
    time,
    translate,
    url,
    userId,
    userName,
    userSign,
    formhash,
    likeType,
    event,
    onToggleExpand
  }) => {
    // global.rerender('Topic.Item.Main')

    return (
      <View style={styles.item}>
        <Flex
          style={stl(
            _.container.item,
            isNew && styles.itemNew,
            isJump && styles.itemJump
          )}
          align='start'
        >
          <UserStatus userId={userId}>
            <Avatar
              style={styles.image}
              navigation={navigation}
              userId={userId}
              name={userName}
              size={AVATAR_SIZE}
              src={avatar}
              event={event}
            />
          </UserStatus>
          <Flex.Item style={stl(styles.content, contentStyle)}>
            <Flex align='start'>
              <Flex.Item>
                <Name
                  userId={userId}
                  size={userName.length > 10 ? 12 : 14}
                  lineHeight={14}
                  bold
                  right={
                    <UserLabel
                      isAuthor={isAuthor}
                      isFriend={isFriend}
                      userSign={userSign}
                    />
                  }
                >
                  {HTMLDecode(userName)}
                </Name>
              </Flex.Item>
              <IconExtra
                topicId={topicId}
                id={id}
                formhash={formhash}
                likeType={likeType}
                msg={msg}
                replySub={replySub}
                erase={erase}
                userId={userId}
                userName={userName}
                showFixedTextare={showFixedTextare}
              />
            </Flex>
            <FloorText time={time} floor={floor} />
            <View style={styles.html}>
              <HTML
                navigation={navigation}
                id={id}
                msg={msg}
                url={url}
                imagesMaxWidth={IMAGES_MAX_WIDTH}
                matchLink={matchLink}
                event={event}
              />
              <Likes
                topicId={topicId}
                id={id}
                formhash={formhash}
                likeType={likeType}
              />
            </View>
            {!!translate && (
              <Text style={styles.translate} size={11}>
                {translate}
              </Text>
            )}
            <View style={styles.sub}>
              <Flex wrap='wrap'>
                {sub
                  .filter((item, index) => (isExpand ? true : index < expandNums))
                  .map(item => (
                    <ItemSub
                      key={item.id}
                      id={item.id}
                      message={item.message}
                      userId={item.userId}
                      userName={item.userName}
                      avatar={item.avatar}
                      floor={item.floor}
                      erase={item.erase}
                      replySub={item.replySub}
                      time={item.time}
                      postId={postId}
                      authorId={authorId}
                      uid={userId}
                      url={url}
                      readedTime={readedTime}
                      matchLink={matchLink}
                      showFixedTextare={showFixedTextare}
                      event={event}
                    />
                  ))}
              </Flex>
              {sub.length > expandNums && (
                <Touchable onPress={() => onToggleExpand(id)}>
                  <Text
                    style={styles.expand}
                    type={isExpand ? 'sub' : 'main'}
                    size={12}
                    align='center'
                    bold
                  >
                    {isExpand ? '收起楼层' : `展开 ${sub.length - expandNums} 条回复`}
                  </Text>
                </Touchable>
              )}
            </View>
          </Flex.Item>
        </Flex>
      </View>
    )
  },
  DEFAULT_PROPS,
  ({ sub, ...other }) => ({
    sub: (sub as any[]).length,
    ...other
  })
)

export default Item

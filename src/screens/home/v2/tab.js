/*
 * @Author: czy0729
 * @Date: 2020-06-03 09:53:54
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-15 20:41:57
 */
import React from 'react'
import { TabBar } from 'react-native-tab-view'
import TabView from '@components/@/react-native-tab-view/TabView'
import { Flex, Text } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { IOS } from '@constants'
import { H_TABBAR } from './store'

function Tab({ routes, renderScene }, { $ }) {
  rerender('Home.Tab')

  const styles = memoStyles()
  const { page } = $.state
  const W_TAB = _.window.width / routes.length
  return (
    <TabView
      style={_.mt._sm}
      sceneContainerStyle={styles.sceneContainerStyle}
      lazy={!IOS}
      lazyPreloadDistance={0}
      navigationState={{
        index: page,
        routes
      }}
      renderTabBar={props => (
        <TabBar
          {...props}
          style={styles.tabBar}
          tabStyle={[
            styles.tab,
            {
              width: W_TAB
            }
          ]}
          labelStyle={styles.label}
          indicatorStyle={[
            styles.indicator,
            {
              marginLeft: (W_TAB - styles.indicator.width) / 2
            }
          ]}
          pressOpacity={1}
          pressColor='transparent'
          scrollEnabled
          renderLabel={({ route, focused }) => (
            <Flex style={styles.labelText} justify='center'>
              <Text type='title' size={13} bold={focused}>
                {route.title}
              </Text>
            </Flex>
          )}
        />
      )}
      renderScene={renderScene}
      onIndexChange={$.onChange}
    />
  )
}

export default obc(Tab, {
  routes: []
})

const memoStyles = _.memoStyles(() => ({
  tabBar: {
    // paddingTop: _.headerHeight - (IOS ? 18 : 24),
    backgroundColor: IOS
      ? 'transparent'
      : _.select(_.colorPlain, _.deepDark ? _._colorPlain : _._colorDarkModeLevel1),
    borderBottomWidth: IOS ? 0 : _.select(_.hairlineWidth, 0),
    borderBottomColor: _.colorBorder,
    elevation: 0
  },
  tab: {
    height: 48 * _.ratio
  },
  label: {
    padding: 0
  },
  labelText: {
    width: '100%'
  },
  indicator: {
    width: _.r(16),
    height: 4,
    backgroundColor: _.colorMain,
    borderRadius: 4
  },
  sceneContainerStyle: {
    marginTop: IOS ? -_.headerHeight - H_TABBAR : 0
  }
}))

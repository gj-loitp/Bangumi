/*
 * @Author: czy0729
 * @Date: 2019-09-20 00:39:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-08 18:26:44
 */
import React from 'react'
import { RefreshControl } from 'react-native'
import { Header, Page, ScrollView } from '@components'
import { _ } from '@stores'
import { inject, obc } from '@utils/decorators'
import { refreshControlProps } from '@tinygrail/styles'
import StatusBarEvents from '@tinygrail/_/status-bar-events'
import Info from './info'
import Slider from './slider'
import Initial from './initial'
import Store from './store'
import { Ctx } from './types'

class TinygrailICODeal extends React.Component {
  state = {
    refreshing: false
  }

  componentDidMount() {
    const { $ }: Ctx = this.context
    $.init()
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      async () => {
        const { $ }: Ctx = this.context
        await $.refresh()

        setTimeout(() => {
          this.setState({
            refreshing: false
          })
        }, 1200)
      }
    )
  }

  render() {
    const { $ }: Ctx = this.context
    const { refreshing } = this.state
    return (
      <>
        <StatusBarEvents />
        <Header
          title='ICO'
          hm={[`tinygrail/ico/deal/${$.monoId}`, 'TinygrailICODeal']}
          statusBarEvents={false}
          statusBarEventsType='Tinygrail'
        />
        <Page style={_.container.tinygrail}>
          <ScrollView
            refreshControl={
              <RefreshControl
                {...refreshControlProps}
                colors={[_.colorMain]}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }
            scrollToTop
          >
            <Info />
            <Slider style={_.mt.sm} />
            <Initial style={_.mt.md} />
          </ScrollView>
        </Page>
      </>
    )
  }
}

export default inject(Store)(obc(TinygrailICODeal))
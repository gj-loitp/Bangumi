/*
 * @Author: czy0729
 * @Date: 2022-03-28 12:31:52
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-04-05 06:38:47
 */
import React from 'react'
import { DEV, Header, Page } from '@components'
import { IconTouchable } from '@_'
import { _ } from '@stores'
import { ic } from '@utils/decorators'
import { useMount, useObserver } from '@utils/hooks'
import List from './list'
import Form from './form'
import Store from './store'

const Smb = (props, { $ }) => {
  useMount(() => {
    $.init()
  })

  return useObserver(() => (
    <>
      <Header
        title='本地条目'
        hm={['smb', 'Smb']}
        headerRight={() => (
          <IconTouchable
            name='md-add'
            color={_.colorTitle}
            size={24}
            onPress={$.onShow}
          />
        )}
      />
      <Page loaded={$.state._loaded}>
        <List />
        <Form />
      </Page>
      <DEV />
    </>
  ))
}

export default ic(Store, Smb)
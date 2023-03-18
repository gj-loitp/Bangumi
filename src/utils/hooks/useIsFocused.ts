/*
 * @Author: czy0729
 * @Date: 2023-02-13 03:43:21
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-18 02:55:13
 */
import { useState, useEffect } from 'react'
import { useIsFocused as useIsFocusedNative } from '@react-navigation/native'
import { runAfter } from '../../utils'

function useIsFocused() {
  const isFocused = useIsFocusedNative()
  const [show, setShow] = useState(isFocused)

  useEffect(() => {
    // blur 时要延迟到切页动画后再隐藏, focus 时马上显示
    if (!isFocused) {
      runAfter(() => {
        setShow(isFocused)
      })
    } else {
      setShow(isFocused)
    }
  }, [isFocused])

  return show
}

export default useIsFocused

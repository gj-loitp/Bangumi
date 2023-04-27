/*
 * @Author: czy0729
 * @Date: 2023-04-22 16:34:52
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-22 16:37:47
 */
import { toJS } from 'mobx'
import { getTimestamp, HTMLDecode, HTMLTrim } from '@utils'
import fetch, { fetchHTML } from '@utils/fetch'
import { fetchCollectionSingleV0, fetchCollectionV0 } from '@utils/fetch.v0'
import { onlines, report } from '@utils/kv'
import {
  API_ACCESS_TOKEN,
  API_USER_COLLECTION,
  API_USER_COLLECTIONS,
  API_USER_COLLECTIONS_STATUS,
  API_USER_INFO,
  API_USER_PROGRESS,
  APP_ID,
  APP_SECRET,
  HTML_PM,
  HTML_PM_DETAIL,
  HTML_PM_OUT,
  HTML_PM_PARAMS,
  HTML_USERS,
  HTML_USER_SETTING,
  LIST_EMPTY,
  URL_OAUTH_REDIRECT
} from '@constants'
import { Id, SubjectId, SubjectType, UserId } from '@types'
import Computed from './computed'
import {
  cheerioPM,
  cheerioPMDetail,
  cheerioPMParams,
  cheerioUserSetting
} from './common'
import { DEFAULT_SCOPE, NAMESPACE } from './init'

export default class Fetch extends Computed {
  /**
   * 获取授权信息
   * @param {*} code 回调获取的 code
   */
  fetchAccessToken = (code: string) => {
    return this.fetch(
      {
        method: 'POST',
        url: API_ACCESS_TOKEN(),
        data: {
          grant_type: 'authorization_code',
          client_id: APP_ID,
          client_secret: APP_SECRET,
          code,
          redirect_uri: URL_OAUTH_REDIRECT
        },
        info: 'access_token'
      },
      'accessToken',
      {
        storage: true,
        namespace: NAMESPACE
      }
    )
  }

  /** 用户信息 */
  fetchUserInfo = (userId: UserId = this.myUserId) => {
    return this.fetch(
      {
        url: API_USER_INFO(userId),
        info: '用户信息'
      },
      'userInfo',
      {
        storage: true,
        namespace: NAMESPACE
      }
    )
  }

  /** @deprecated 获取某人的在看收藏 */
  fetchUserCollection = (userId: UserId = this.myUserId) => {
    return this.fetch(
      {
        url: `${API_USER_COLLECTION(userId)}?cat=all_watching`,
        info: '在看收藏'
      },
      'userCollection',
      {
        list: true,
        storage: true,
        namespace: NAMESPACE
      }
    )
  }

  /** 获取在看收藏 (新 API, 取代 userCollection) */
  fetchCollection = async (userId: UserId = this.myId) => {
    const collection = await fetchCollectionV0({
      userId
    })

    // 这样可能是 access_token 过期了, 需要主动刷新 access_token
    if (!collection.list.length && this.collection.list.length >= 2) return null

    this.setState({
      collection
    })

    this.save('collection')
    return collection
  }

  /** 获取并更新单个在看收藏 */
  fetchCollectionSingle = async (subjectId: SubjectId, userId: UserId = this.myId) => {
    const data = await fetchCollectionSingleV0({
      userId,
      subjectId
    })
    if (!data) return false

    const index = this.collection.list.findIndex(
      item => item.subject_id === data.subject_id
    )
    if (index === -1) return false

    const collection = toJS(this.collection)
    collection.list[index] = data
    this.setState({
      collection
    })

    this.save('collection')
    return true
  }

  /** 获取某人的收视进度 */
  fetchUserProgress = async (subjectId?: SubjectId, userId: UserId = this.myUserId) => {
    const config = {
      url: API_USER_PROGRESS(userId),
      data: {} as {
        subject_id?: SubjectId
      },
      retryCb: () => this.fetchUserProgress(subjectId, userId),
      info: '收视进度'
    }
    if (subjectId) config.data.subject_id = subjectId

    const res = fetch(config)
    const data = await res

    // @issue 当用户没有收视进度, API_USER_PROGRESS接口服务器直接返回null
    // 注意请求单个返回对象, 多个返回数组
    if (data) {
      // 统一结构
      const _data = Array.isArray(data) ? data : [data]

      // 扁平化
      _data.forEach(item => {
        if (!item.eps) return

        const userProgress = {
          _loaded: getTimestamp()
        }
        item.eps.forEach(i => (userProgress[i.id] = i.status.cn_name))
        this.setState({
          userProgress: {
            [item.subject_id]: userProgress
          }
        })
      })
    } else {
      // 没有数据也要记得设置_loaded
      this.setState({
        userProgress: {
          [subjectId]: {
            _loaded: getTimestamp()
          }
        }
      })
    }
    this.save('userProgress')

    return res
  }

  /** 获取用户收藏概览 */
  fetchUserCollections = async (
    scope: SubjectType = DEFAULT_SCOPE,
    userId: UserId = this.myUserId
  ) => {
    const config = {
      url: API_USER_COLLECTIONS(scope, userId),
      data: {
        max_results: 100
      },
      retryCb: () => this.fetchUserCollections(scope, userId),
      info: '收藏概览'
    }
    const res = fetch(config)
    const data = await res

    // 原始数据的结构很臃肿, 扁平一下
    const collections = {
      ...LIST_EMPTY,
      list: [],
      _loaded: getTimestamp()
    }
    if (data) {
      data[0].collects.forEach(item => {
        collections.list.push({
          list: item.list.map(i => i.subject),
          status: item.status.name,
          count: item.count
        })
      })
    }

    const key = 'userCollections'
    const stateKey = `${scope}|${userId}`

    this.setState({
      [key]: {
        [stateKey]: collections
      }
    })

    return res
  }

  /** 获取某用户信息 */
  fetchUsersInfo = (userId: UserId = this.myUserId) => {
    return this.fetch(
      {
        url: API_USER_INFO(userId),
        info: '某用户信息'
      },
      ['usersInfo', userId],
      {
        storage: true,
        namespace: NAMESPACE
      }
    )
  }

  /** 获取用户收藏统计 */
  fetchUserCollectionsStatus = (userId: UserId = this.myUserId) => {
    return this.fetch(
      {
        url: API_USER_COLLECTIONS_STATUS(userId),
        info: '用户收藏统计'
      },
      ['userCollectionsStatus', userId],
      {
        storage: true,
        namespace: NAMESPACE
      }
    )
  }

  /** 用户介绍 */
  fetchUsers = async (config: { userId?: UserId }) => {
    const { userId } = config || {}

    // -------------------- 请求HTML --------------------
    const raw = await fetchHTML({
      url: `!${HTML_USERS(userId)}`
    })
    const HTML = HTMLTrim(raw)

    // -------------------- 分析内容 --------------------
    let users = ''
    const matchHTML = HTML.match(
      /<blockquote class="intro"><div class="bio">(.+?)<\/div><\/blockquote>/
    )
    if (matchHTML) {
      users = HTMLDecode(matchHTML[1])
      this.setState({
        users: {
          [userId]: users
        }
      })
    }

    return users
  }

  /** 短信 */
  fetchPM = async (refresh?: boolean, key: 'pmIn' | 'pmOut' = 'pmIn') => {
    const { list, pagination } = this[key]
    const page = refresh ? 1 : pagination.page + 1

    const HTML = await fetchHTML({
      url: key === 'pmOut' ? HTML_PM_OUT(page) : HTML_PM(page)
    })
    const data = {
      list: refresh ? cheerioPM(HTML) : [...list, ...cheerioPM(HTML)],
      pagination: {
        page,
        pageTotal: 100
      },
      _loaded: getTimestamp()
    }

    this.setState({
      [key]: data
    })
    this.save(key)

    return data
  }

  /** 短信详情 */
  fetchPMDetail = async (config: { id?: Id }) => {
    const { id } = config || {}
    const raw = await fetchHTML({
      url: HTML_PM_DETAIL(id),
      raw: true
    })

    // 这个接口会30
    const { url } = raw
    let HTML
    if (url.includes(id)) {
      HTML = await raw.text()
    } else {
      HTML = await fetchHTML({
        url: HTML_PM_DETAIL(url.match(/\d+/g)[0])
      })
    }

    const key = 'pmDetail'
    const data = {
      ...cheerioPMDetail(HTML),
      pagination: {
        page: 1,
        pageTotal: 1
      },
      _loaded: getTimestamp()
    }
    this.setState({
      [key]: {
        [id]: data
      }
    })
    this.save(key)

    return data
  }

  /** 新短信参数 */
  fetchPMParams = async (config: { userId?: Id }) => {
    const { userId } = config || {}

    const HTML = await fetchHTML({
      url: HTML_PM_PARAMS(userId)
    })
    const key = 'pmParams'

    const data = {
      ...cheerioPMParams(HTML),
      _loaded: getTimestamp()
    }
    this.setState({
      [key]: {
        [userId]: data
      }
    })

    return data
  }

  /** 个人设置 */
  fetchUserSetting = async () => {
    const HTML = await fetchHTML({
      url: HTML_USER_SETTING()
    })

    const key = 'userSetting'
    const data = {
      ...cheerioUserSetting(HTML),
      _loaded: getTimestamp()
    }

    this.setState({
      [key]: data
    })
    return data
  }

  /** 在线用户最后上报时间集 */
  fetchOnlines = async () => {
    if (!this.myId) return false

    const result = await report(this.myId)
    if (result?.code === 200) {
      const data = await onlines()
      if (typeof data === 'object') {
        const key = 'onlines'
        this.setState({
          [key]: data
        })
        this.save(key)
        return data
      }
    }
    return false
  }
}
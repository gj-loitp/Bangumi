/*
 * @Author: czy0729
 * @Date: 2019-05-14 22:06:49
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-06-08 03:27:13
 */
import { observable, computed } from 'mobx'
import { getTimestamp } from '@utils'
import { HTMLTrim, HTMLToTree, findTreeNode } from '@utils/html'
import store from '@utils/store'
import { fetchHTML } from '@utils/fetch'
import { LIST_EMPTY } from '@constants'
import { MODEL_SEARCH_CAT } from '@constants/model'
import { HTML_SEARCH } from '@constants/html'

const namespace = 'Search'
const initCat = MODEL_SEARCH_CAT.getValue('条目')
const initSearchItem = {
  id: '',
  cover: '',
  name: '',
  nameCn: '',
  tip: '',
  score: '',
  total: '',
  rank: '',
  type: '',
  collected: false,
  comments: ''
}

class Search extends store {
  state = observable({
    search: {
      // [`${text}|${cat}`]: LIST_EMPTY | initSearchItem
    }
  })

  async init() {
    const res = Promise.all([this.getStorage('search', namespace)])
    const state = await res
    this.setState({
      search: state[0] || {}
    })

    return res
  }

  // -------------------- get --------------------
  /**
   * 取搜索结果
   * @param {*} text 搜索关键字
   */
  search(text, cat = initCat) {
    const _text = text.replace(/ /g, '+')
    return computed(
      () => this.state.search[`${_text}|${cat}`] || LIST_EMPTY
    ).get()
  }

  // -------------------- fetch --------------------
  /**
   * 搜索
   * @param {*} text 关键字
   * @param {*} cat 类型
   * @param {*} refresh 是否刷新
   */
  async fetchSearch({ text = '', cat = initCat } = {}, refresh) {
    const _text = text.replace(/ /g, '+')

    const { list, pagination } = this.search(_text, cat)
    let page // 下一页的页码
    if (refresh) {
      page = 1
    } else {
      page = pagination.page + 1
    }

    // -------------------- 请求HTML --------------------
    const res = fetchHTML({
      url: HTML_SEARCH(_text, cat, page),
      cookie: 'chii_searchDateLine=0;' // 搜索不加这个会无条件返回错误
    })
    const raw = await res
    const HTML = HTMLTrim(raw)

    if (HTML.includes('秒内只能进行一次搜索')) {
      return Promise.reject()
    }

    // -------------------- 分析HTML --------------------
    let node

    const search = []
    let { pageTotal = 0 } = pagination
    let searchHTML

    // 条目
    if (cat.includes('subject')) {
      searchHTML = HTML.match(
        /<ul id="browserItemList" class="browserFull">(.+?)<\/ul> <div id="multipage"/
      )
      if (searchHTML) {
        // 总页数
        if (page === 1) {
          const pageHTML =
            HTML.match(
              /<span class="p_edge">\(&nbsp;\d+&nbsp;\/&nbsp;(\d+)&nbsp;\)<\/span>/
            ) ||
            HTML.match(
              /<a href="\? page=\d+" class="p">(\d+)<\/a><a href="\? page=2" class="p">&rsaquo;&rsaquo;<\/a>/
            )
          if (pageHTML) {
            // eslint-disable-next-line prefer-destructuring
            pageTotal = pageHTML[1]
          } else {
            pageTotal = 1
          }
        }

        const tree = HTMLToTree(searchHTML[1])
        tree.children.forEach(item => {
          const { children } = item

          // 条目Id
          node = findTreeNode(children, 'a|href~/subject/')
          const id = node ? node[0].attrs.href : ''

          // 封面
          node =
            findTreeNode(children, 'a > span > img') ||
            findTreeNode(children, 'a > noscript > img')
          let cover = node ? node[0].attrs.src : ''
          if (cover === '/img/info_only.png') {
            cover = ''
          }

          // 标题
          node = findTreeNode(children, 'div > h3 > small')
          const name = node ? node[0].text[0] : ''

          node = findTreeNode(children, 'div > h3 > a')
          const nameCn = node ? node[0].text[0] : ''

          // 描述
          node = findTreeNode(children, 'div > p|class=info tip')
          const tip = node ? node[0].text[0] : ''

          // 分数
          node = findTreeNode(children, 'div > p > small|class=fade')
          const score = node ? node[0].text[0] : ''

          node = findTreeNode(children, 'div > p > span|class=tip_j')
          const total = node ? node[0].text[0] : ''

          // 排名
          node = findTreeNode(children, 'div > span|class=rank')
          const rank = node ? node[0].text[0] : ''

          // 类型
          node = findTreeNode(children, 'div > h3 > span|class')
          const type = node
            ? node[0].attrs.class.replace(
                /ico_subject_type subject_type_| ll/g,
                ''
              )
            : ''

          // 收藏状态
          node = findTreeNode(children, 'div > div > p > a|title=修改收藏')
          const collected = !!node

          const data = {
            ...initSearchItem,
            id,
            cover,
            name,
            nameCn,
            tip,
            score,
            total,
            rank,
            type,
            collected
          }
          search.push(data)
        })
      }
    }

    // 人物
    if (cat.includes('mono')) {
      searchHTML = HTML.match(
        /<div id="columnSearchB" class="column">(.+?)<div id="columnSearchC"/
      ) // 游戏

      if (searchHTML) {
        // 人物页面没有分页信息, 但是还是能请求到下一页
        pageTotal = 100

        const tree = HTMLToTree(searchHTML[1])
        const items = findTreeNode(tree.children, 'div|class=light_odd clearit')
        items.forEach(item => {
          const { children } = item

          // 人物Id
          node = findTreeNode(children, 'a|class=avatar')
          const id = node ? node[0].attrs.href : ''

          // 封面
          node =
            findTreeNode(children, 'a > img') ||
            findTreeNode(children, 'a > noscript > img')
          let cover = node ? node[0].attrs.src : ''
          if (cover === '/img/info_only.png') {
            cover = ''
          }

          // 标题
          node = findTreeNode(children, 'div > h2 > a')
          const name = node ? node[0].text[0].replace(' / ', '') : ''

          node = findTreeNode(children, 'div > h2 > a > span')
          const nameCn = node ? node[0].text[0] : ''

          // 描述
          node = findTreeNode(children, 'div > div > span')
          const tip = node ? node[0].text[0].replace(' ', '') : ''

          // 讨论数
          node = findTreeNode(children, 'div > small')
          const comments = node ? node[0].text[0] : ''

          const data = {
            ...initSearchItem,
            id,
            cover,
            name,
            nameCn,
            tip,
            comments
          }
          search.push(data)
        })
      }
    }

    const key = 'search'
    const stateKey = `${_text}|${cat}`
    this.setState({
      [key]: {
        [stateKey]: {
          list: refresh ? search : [...list, ...search],
          pagination: {
            page,
            pageTotal: parseInt(pageTotal)
          },
          _loaded: getTimestamp()
        }
      }
    })
    this.setStorage(key, undefined, namespace)

    return res
  }
}

export default new Search()

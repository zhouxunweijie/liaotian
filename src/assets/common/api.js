import HTTP from './http'

/**
 * 聊天模块
 */

// 获取当前用户信息
export const login = data => HTTP.GET('web/selectUser/findUserInfoBasics', data)

// 获取好友列表
export const getFriendsList = data => HTTP.GET('getFriendsList', data)

// 发送聊天信息
export const postMsg = data => HTTP.GET('web/messengerAccount/sendMessage', data)

// 根据容联云账号获取详细信息
export const getFriendMessage = data => HTTP.GET('web/selectUser/queryContactsUserInfo', data)

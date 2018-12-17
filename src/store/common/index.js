const state = {
  active: 0, // 记录当前是哪一页
  member: null // 储存当前选择的会员类型
}
const mutations = {
  // 设置当前显示的是哪一页
  setActive (state, products) {
    state.active = products.active
  }
}

export default {
  state,
  mutations
}
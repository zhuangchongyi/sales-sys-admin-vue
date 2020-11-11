import {
  getLanguage
} from '@/lang/index'
import cookie from 'vue-cookie';

const state = {
  language: getLanguage(),
}

const mutations = {
  SET_LANGUAGE: (state, language) => {
    state.language = language
    cookie.set('language', language);
  },
}

const actions = {
  setLanguage({
    commit
  }, language) {
    commit('SET_LANGUAGE', language)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
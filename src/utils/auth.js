import cookie from 'vue-cookie';

export const TokenKey = 'Authorization'

export function getToken() {
  return cookie.get(TokenKey)
}

export function setToken(token) {
  return cookie.set(TokenKey, token, 7)
}

export function removeToken() {
  return cookie.delete(TokenKey)
}
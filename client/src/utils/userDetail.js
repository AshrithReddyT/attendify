export const getUserName = () => {
  if (localStorage.userProfile) {
    return JSON.parse(localStorage.userProfile).name
  }
  return ''
}

export const getUserEmail = () => {
  if (localStorage.userProfile) {
    return JSON.parse(localStorage.userProfile).email
  }
  return ''
}

export const clearToken = () => {
  if (localStorage.tokens) {
    localStorage.setItem('tokens', '')
  }
  if (localStorage.token) {
    localStorage.setItem('token', '')
  }
  if (localStorage.access_token) {
    localStorage.setItem('access_token', '')
  }
  if (localStorage.refresh_token) {
    localStorage.setItem('refresh_token', '')
  }
  if (localStorage.userProfile) {
    localStorage.setItem('userProfile', '')
  }
  if (localStorage.meeting) {
    localStorage.setItem('meeting', '')
  }
  return ''
}

import { googleSdkLoaded } from 'vue3-google-login'
import axios from 'axios'
const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID

const exchangeCodeForToken = async (code) => {
  try {
    const resp = await axios.post(import.meta.env.VITE_SERVER_ENDPOINT + '/auth/google', {
      code: code
    })
    const { tokens, userProfile } = resp.data

    // Store tokens and userProfile in local storage
    localStorage.setItem('tokens', JSON.stringify(tokens))
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
  } catch (error) {
    console.log(error)
  }
}

export const login = async () => {
  await new Promise((resolve) => {
    googleSdkLoaded(async (google) => {
      await google.accounts.oauth2
        .initCodeClient({
          client_id: googleClientId,
          scope: 'https://www.googleapis.com/auth/calendar',
          callback: async (response) => {
            console.log('Handle the response', response)
            await exchangeCodeForToken(response.code)
            resolve() // Resolve the Promise when the OAuth2 flow has completed
          },
          ux_mode: 'popup'
        })
        .requestCode()
    })
  })
}

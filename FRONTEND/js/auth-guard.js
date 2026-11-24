// auth-guard.js — include in every protected page
(function () {
  const token = localStorage.getItem('profile_token')
  const user = localStorage.getItem('profile_user')

  // Since we are now inside the /pages/ folder, we just redirect to login.html
  if (!token || !user) {
    window.location.href = 'login.html'
    throw new Error('Not authenticated')
  }
  window._profileUser = JSON.parse(user)
  window._profileToken = token
})()

async function logout() {
  try {
    // Updated to use absolute path so it hits the backend API
    await fetch('/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('profile_token') }
    })
  } catch (e) { }
  localStorage.removeItem('profile_token')
  localStorage.removeItem('profile_user')
  window.location.href = 'login.html'
}
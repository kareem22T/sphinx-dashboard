// get admin token
const getToken = JSON.parse(localStorage.getItem("userDetails"))
export const token = getToken ? getToken.refreshToken : null

// main url
export const url = "https://api.sphinx-travel.com"

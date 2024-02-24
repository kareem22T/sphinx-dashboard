// get admin token
const getToken = JSON.parse(localStorage.getItem("userDetails"))
export const token = getToken ? getToken.refreshToken : null

// main url
export const url = "http://127.0.0.1:8000"

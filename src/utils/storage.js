// 用于封装所有的localstorage操作
const TOKEN_KEY = 'geek-pc-hz21-token'

// 保存token
export const setToken = (token)=>{
    localStorage.setItem(TOKEN_KEY,token)
}
// 获取token
export const getToken = ()=>localStorage.getItem(TOKEN_KEY)
// 移除token
export const removeToken = ()=>localStorage.removeItem(TOKEN_KEY)
// 判断是否有token
// ！！ 转化为布尔值
export const hasToken = ()=> !!getToken()

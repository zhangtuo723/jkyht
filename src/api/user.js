import request from 'utils/request'

export const login = (mobile,code)=>{
    return request({
        method:'POST',
        url:'/authorizations',
        data:{mobile,code}
    })
}

export const getUserProfile = ()=>{
    return request({
        method:'get',
        url:'/user/profile'
    })
}
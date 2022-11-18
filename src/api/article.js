// 封装和文章相关的接口
import request from 'utils/request'

export const getArticleList = (params)=>{
    return request({
        url:"/mp/articles",
        params
    })
}

export const delArticle = (id)=>{
    return request({
        url:`/mp/articles/${id}`,
        method:'DELETE'
    })
}

export const pubArticle = (data,draft=false)=>{
    return request({
        url:`/mp/articles?draft=${draft}`,
        method:'post',
        data
    })
}
export const getArticleById =(id)=>{
    return request({
        url:`/mp/articles/${id}`
    })
}

export const updateArticle = (data,id,draft=false)=>{
    return request({
        url:`/mp/articles/${id}?draft=${draft}`,
        method:'put',
        data
    })
}
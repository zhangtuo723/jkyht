// 封装和文章相关的接口
import request from 'utils/request'

export const getArticleList = (params)=>{
    return request({
        url:"/mp/articles",
        params
    })
}
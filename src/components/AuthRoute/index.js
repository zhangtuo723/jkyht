import React, { Component } from 'react'
import {Route,Redirect} from 'react-router-dom'
import {hasToken} from 'utils/storage'

export default class AuthRote extends Component {
  render() {
    // console.log('aaaa',this.props);
    // ...rest解构剩余的属性
    // react组件要满足首字母大写
    const {component:Component,...rest} = this.props
    // console.log(component);
    // console.log(rest);
    // console.log(rest);
    return (
        <Route {...rest} render={(props)=>{
            // render里面这个个props也也不知道是谁穿过来的
            // 不用render的Route应该会自动传给component对应的组件，使用render的话需要自己接收props，然后传给 需要渲染的组件
            // console.log(props,'bbb');
            // render并不会给组件加 路由那三个东西，history，location,match,
            if(hasToken()){
                // 有token，登录了
                return < Component {...props}/>
            }else{
                // 跳转到登录页面时候把当前地址传过去，登录成功调回来
                // Redirect 跳转转组件
                // console.log(props,1111111);
                // return <Redirect to="/login"/> 
                return <Redirect to={{
                    pathname:'/login',
                    search:'?from='+props.location.pathname,
                    state:{
                        from:props.location.pathname
                    }
                }}></Redirect>
            }
        }}></Route>
    )
  }
}

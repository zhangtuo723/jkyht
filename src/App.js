import {Router,Route,Switch} from 'react-router-dom'
// import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Home from './pages/Layout'
import Login from './pages/Login'
import NotFound404 from './NotFound404'
import AuthRote from 'components/AuthRoute'

// import {createBrowserHistory,createHashHistory} from 'history'
// const history = createBrowserHistory()
import history from 'utils/history'
// import Test from 'Test'
function App() {
  return (
    <Router history={history}>
      <div className="App">
        {/* <Link to="/login">登录</Link>
        <Link to="/home">首页</Link> */}
        {/* <Test></Test> */}
        <Switch>
          {/* 可以使用render替换component */}
          {/* <Route path="/login" component={Login}></Route> */}
          {/* <Route path="/login" render={(props)=>{
            // console.log(props);
            return <Login {...props}></Login>
          }}></Route> */}

          {/* 精确匹配也能匹配到带有参数的path */}
          {/* 不管是hash还是brower都不用在path和to里面写#号，会自动加 */}
          <Route  path="/login" component={Login}></Route>

          <AuthRote path="/home" component={Home}></AuthRote>
          {/* 配置404 */}
          {/* <Route component={Test}></Route> */}
          <AuthRote component={NotFound404}></AuthRote>
        </Switch>
        
        
    </div>
    </Router>
  );
}

export default App;

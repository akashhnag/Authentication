angular.module('myApp')
.service('AuthService',($q,$http)=>{
    let LOCAL_TOKEN='akash';
    let isAuthenticated=false;
    let authToken;
    function loadToken(){
        let token=windowlocalStorage.getItem(LOCAL_TOKEN);
        if(token){
            useToken();
        }
    };
    function storeToken(token){
        window.localStorage.setItem(LOCAL_TOKEN,token);
        useToken(token);
    };
    function useToken(){
        isAuthenticated=true;
        authToken=token;
        $http.defaults.headers.common.Authorization=authToken;
    };
    function destroyToken(){
        authToken=undefined;
        isAuthenticated=false;
        $http.defaults.headers.common.Authorization=undefined;
        window.localStorage.removeItem(LOCAL_TOKEN);
    };
    let register=function(user){
        return $q((resolve,reject)=>{
            $http.post('http://localhost:3000/register',user).then((res)=>{
                if(res.data.success){
                    resolve(res.data.mesage);
                }
                else{
                    reject(res.data.mesage);
                }
            })
        })
    };
    let login=function(user){
        return $q((resolve,reject)=>{
            $http.post('http://localhost:3000/login',user).then((res)=>{
                if(res.data.success){
                    storeToken(res.data.token);
                    resolve(res.data.mesage);
                }
                else{
                    reject(res.data.mesage);
                }
            })
        })
    };
    let logout=function(){
        destroyToken();
    };
    loadToken();
    return{
        login:login,
        register:register,
        logout:logout,
        isAuthenticated:function(){
            return isAuthenticated;
        }
    }
})
.factory('AuthInterceptor',function($rootscope,$q){
    return{
        responseError:function(response){
            $rootscope.$broadcast({
                401:'user is not authenticated'}[response.status],response);
                return $q.reject(response);
           
        }
    }

}).config(($httpProvider)=>{
    $httpProvider.interceptors.push('AuthInterceptor');
})
angular.module('myApp',[])
.controller('logCtrl',($scope,$http)=>{
    $scope.logDetails={user:'',pass:''}
    $scope.login=()=>{
        console.log('log controller');
        console.log($scope.logDetails);
   

    $http.post('http://localhost:3000/login',$scope.logDetails).then((res)=>{
        $scope.logDetails={user:'',pass:''}
        console.log(res.data);
        console.log(res.data.token);
        window.localStorage.setItem('tok',res.data.token)
    },(err)=>{
        console.log(err);
        
    })
}
    
})
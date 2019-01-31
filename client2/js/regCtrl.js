angular.module('my App',['ui.router'])
.controller('regCtrl',($scope,$http)=>{
    $scope.regDetails={user:'',pass:''}
    $scope.register=()=>{
        console.log('reg controller');
        console.log($scope.regDetails);
   

    $http.post('http://localhost:3000/register',$scope.regDetails).then((res)=>{
        console.log(res.data);
        
    },(err)=>{
        console.log(err);
        
    })
}
    
})
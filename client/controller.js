angular.module('myApp')
.controller('loginCtrl',($scope,AuthService,$state,$stateParams)=>{
    $scope.user={email:'',pass:''}
    if($stateParams.obj !==null){
        $scope.message=$stateParams.obj;
    };

    $scope.login=()=>{
        AuthService.login($scope.user).then((msg)=>{
            $state.go('profile')
        },(errMsg)=>{
            $scope.user={email:'',password:''};
            let alertMsg={
                title:'Login Failed',
                template:errMsg
            };
            $state.go('home.login',{obj:alertMsg})
        })
    }
})

.controller('loginCtrl',($scope,AuthService,$state,$stateParams)=>{
    $scope.user={email:'',pass:''}
    if($stateParams.obj !==null){
        $scope.message=$stateParams.obj;
    };

    $scope.register=()=>{
        AuthService.register($scope.user).then((msg)=>{
            let alertMsg={
                title:'Registration Successful!',
                template:errMsg
            }
            $state.go('home.login')
        },(errMsg)=>{
            $scope.user={email:'',password:''};            
            let alertMsg={
                title:'Registration failed!!',
                template:errMsg
            };
            $state.go('home.register',{obj:alertMsg})
        })
    }
})

.controller('profileCtrl',($scope,AuthService,$state,$stateParams)=>{
    $scope.getInfo=()=>{
        $http.get('http://localhost:3000/profile').then((res)=>{
        $scope.user.res.data.user
        })
    }
    $scope.logout=()=>{
        AuthService.logout()
        $state.go('home login')
    }
})

.controller('AppCtrl',($scope,AuthService,$state,$stateParams)=>{
    $scope.$on('User is not authenticated',(event)=>{
        AuthService.logout();
        let alertMsg={
            title:'Session is lost',
            template:'You need to login again'
        };
        $state.go('home.login',{obj:alertMsg})
    })
})

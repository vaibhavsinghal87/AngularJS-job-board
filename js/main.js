(function() {
	
	angular.module('JobBoardApp', ['ngRoute'])
		.config(function($routeProvider) {
			$routeProvider.when('/jobs', {
				templateUrl: 'partials/job-board.html',
			}).
			when('/jobDetail/:jobId', {
				templateUrl: 'partials/job-detail.html',
			}).
			otherwise({
				redirectTo: '/jobs'
			});
		}).
		service("JobsService", function ($http, $q){
			var deferred = $q.defer();
			$http.get("data/jobs.json").then(function (data){
				deferred.resolve(data);
			});
			
			this.getJobs = function(){
				return deferred.promise;
			}
		}).
		controller("JobCtrl", function($scope, $location, JobsService) {
			$scope.search={
				location: "",
				keywords: ""
			}
			$scope.jobDetail = {};
			
			var promise = JobsService.getJobs();
			promise.then(function (objData){
				$scope.jobs = objData.data.jobs;
			});
			
			$scope.viewClickHandler = function(jobId){
				var len = $scope.jobs.length;
				for (var i = 0; i < len; i++){
					var objJob = $scope.jobs[i];
					if(objJob.id === jobId){
						$scope.jobDetail = objJob;
					}
				}
				$scope.jobDetail.keywords = $scope.jobDetail.keywords.toString();
				
				//change route
				$location.path('/jobDetail/' + jobId);
			}
		});
})();
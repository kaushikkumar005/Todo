angular.module('todo', ['ionic', 'uuid4'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },

    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

	$scope.shouldShowDelete = false;
 $scope.shouldShowReorder = false;
 $scope.listCanSwipe = true;

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }


  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
  /*
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }*/
	$scope.projectModal.show();
  };
  
  //kaushik:called to edit the task
  $scope.editTask = function(task) {
  
	$scope.editTaskModal.show();
  };
  //end:called to edit the task 

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });
  
  //Create our Modal for new project
     $ionicModal.fromTemplateUrl('new-project.html', function(modal) {
    $scope.projectModal = modal;
  }, {
    scope: $scope
  });
  //create our modal for edit task	
   $ionicModal.fromTemplateUrl('edit-task.html', function(modal) {
    $scope.editTaskModal = modal;
  }, {
    scope: $scope
  });
  
  
  
  //Create project  function 
  $scope.createProject = function(project){
	if(!project) return;
	
	createProject(project.title);
	$scope.projectModal.hide();
  };
  
  //kaushik:create new edit task in db function
  $scope.editTaskInDB=function(task)
  {
    var selectedTask = task;
       
	//add code here    
	var oldTodos = $scope.activeProject.task;
		$scope.activeProject.task = [];
		angular.forEach(oldTodos, function(task){
			if (!task.done)
				$scope.todos.push(todo);
		});
		localStorage.setItem('todos', JSON.stringify($scope.todos));
	//end code here 
	Projects.save($scope.projects);
		 $scope.editTaskModal.hide();
  };
  //END:create new edit task in db function
  
  //Create task function 
  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
	  id: '',
      title: task.title,
	  done: false
    });
    $scope.taskModal.hide();
		
    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };
  
  $scope.markTaskAsDone = function(index,done) {
  
	//$scope.projects[Projects.getLastActiveIndex()].tasks[index].title = task can used for 
	
	Projects.save($scope.projects);
  };
  //kaushik :save button function
   $scope.save= function() {
  
	
	Projects.save($scope.projects);
  };
  //kaushik :camera function
  $scope.takePicture =function () {
  navigator.camera.getPicture(function(imageURI) {

    // imageURI is the URL of the image that we can use for
    // an <img> element or backgroundImage.

  }, function(err) {

    // Ruh-roh, something bad happened

  }, cameraOptions);
}
  //End :camera function
  //End:save button function
  
  //kaushik:cancel task function
  $scope.closeNewProject=function(){
	
	$scope.projectModal.hide();
  };
  //End:cancel task function
  $scope.closeEditTask=function(){
	
	$scope.projectModal.hide();
  };
  //kaushik:cancel the edit task function
   $scope.closeEditTask=function(){
  $scope.editTaskModal.hide();
  };
  //end:cancel the edit task function
  
  //Task edit open the modal
  $scope.editTask = function(task) {
     $scope.editTaskModal.show();
  };
  
  
  //End :Task edit open the modal
  
  
  //adding attribute  done to task
   $scope.doneTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      status: task.done
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.done = "";
  };
  
  //end of adding attribute  done to task

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };


  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

});
window.app = angular.module("bookmarklet", []);
angular.module("bookmarklet").controller "AController", ($scope, $http,$window) ->
  $scope.views = [
    "a"
    "d"
    "b"
    "c"
  ]
  $scope.sg = SelectorGadget.new()
  # $scope.getSelection(->
  #  # $scope.selection = $scope.sg.current_selector
  #   $scope.$apply()
  # )
  $scope.sg.makeInterface()
  $scope.sg.clearEverything()
  $scope.sg.setMode('interactive')

app.run ($rootScope) ->
  $rootScope.URL = location.href
  return

var ContentController = function($scope) {

  $scope.channels = [ { name: 'Channel 1' }, { name: 'Channel 2' } ];

  $scope.data = {
    channels: [
      { color: 'rgb(255, 0, 0)', y: 1024 },
      { color: 'rgb(0, 255, 0)', y: 1024 }
    ],
    frames: [
      { channels: [0, 100] },
      { channels: [100, 0] }
    ]
  };

};
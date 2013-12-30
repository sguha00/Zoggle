'use strict';

/* Controllers */

angular.module('zoggle.controllers', []).
  controller('MainCtrl', ['$scope', function($scope) {
    $scope.words = []
    $scope.board = []
    $scope.timeStart = 0
    $scope.timeEnd = 0
    $scope.time = 0
    $scope.players = []
    $scope.won = []
    $scope.input = {
      word: ''
    }
    $scope.score = 0
    var socket = io.connect();
    socket.on('game', function(GAME) {
      console.log('game', GAME)
      for(var key in GAME) {
        $scope[key] = GAME[key]
      }
      $scope.words = []
    })
    socket.on('name', function(name) {
      if(!$scope.name) {
        $scope.name = name
      }
    })
    socket.on('won', function(winningWords) {
      console.log('words', winningWords)
      $scope.won = winningWords
    })
    socket.on('players', function(players) {
      console.log('players', players)
      $scope.$apply(function() {
        $scope.players = players
      })
    })
    socket.on('word', function(word, score) {
      $scope.words.unshift(word)
      $scope.score = score
    })
    $scope.name = localStorage.name
    if($scope.name) {
      socket.emit('name', $scope.name)
    }
    $scope.guess = function() {
      console.log('word', $scope.input.word)
      socket.emit('word', $scope.input.word)
      $scope.input.word = ''
    }
    function timer(){
      $scope.$apply(function() {
        $scope.time += 10
      })
      setTimeout(timer, 10)
    }
    setTimeout(timer, 10)
  }])
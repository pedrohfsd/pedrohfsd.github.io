---
layout: post
title: Metaheuristic - Simulated Annealing - Part 2
date: 2017-08-04
---

{{ page.title }}
================

Disclaimer
---
I'm dividing this post into 2 parts:
- [Part 1 : Discuss the technique definition, idea and advantages](2017-07-28-simulated-annealing-part1)
- Part 2 (this post) : Applies this technique to a real problem by implementing a metaheuristic algorithm for the Traveling Salesman Problem.

Interactive Demo (SA applied to TSP)
---
<script><% include canvas.js %></script>
<script src="https://rawgit.com/pedrohfsd/TSP/develop/simulated_annealing.js"></script>

<div style="width:640px; margin:auto">
  <canvas id="canvas" width="640px" height="490" style="border:1px solid #000000;"></canvas>
  <br/><br/><input id='cityCountId' value='20' size="5"/> - Cities
  <br/><input id='temperatureId' value='1000' size="5"/> - Initial Temperature
  <br/><input id='dropRateId' value='0.05' size="5"/> - Temperature Drop Rate (in %)
  <br/><input id='delayId' value='20' size="5"/> - Delay (in millis)
  <div style="float:right">
    <br/><button onclick="generate(props);">Generate</button>
    <button onclick="run(props, document.getElementById('temperatureId').value, document.getElementById('dropRateId').value, document.getElementById('delayId').value);">Run</button>
    <button onclick="resetCanvas(props, props.vertices);">Reset</button>
  </div>
</div>

<script>
  var props = {canvas:null, context:null
              , width:640
              , height:490
              , margin:30
              , fontSize:14
              , verticeCount:function(){return document.getElementById('cityCountId').value}
              , vertices:[]
              , background:'#5F636C'
              };
  props.canvas = document.getElementById('canvas');
  props.context = props.canvas.getContext('2d');
  props.context.font = (props.fontSize+2)+'px Arial';
  props.context.fillStyle = props.background;
  props.context.fillRect(0, 0, props.width, props.height);
  props.context.fillStyle = 'white';
  props.context.fillText('\'Input\' the number of cities to \'Generate\' the graph and \'Run\'', props.width/2-220, props.height/2);
  props.context.font = props.fontSize+'px Arial';

  function state_changed(props, event){resetCanvas(props, event.vertices);}
  function log(props, text){setText(props, text);}
</script>

Algorithm
---
The algorithm implementation follows the 5 main steps described for Simluated Annealing in the previous [post](2017-07-28-simulated-annealing-part1), but now applied to TSP:
1. Find a feasible solution for TSP
1. While temperature is greater than 1:
    1. Build new solution from the current one
    1. Try to use the new answer 
        1. If new solution is better than current use new solution as current
        1. Else If \\(E^{\frac{current-new}{temperature}} > random(0,1)\\), use new solution as current
    1. Decrement temperature
1. Return the best answer found


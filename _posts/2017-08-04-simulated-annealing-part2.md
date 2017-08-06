---
layout: post
title: Metaheuristic - Simulated Annealing - Part 2
date: 2017-08-04
---

{{ page.title }}
================
---
I'm dividing this post into 2 parts:
- [Part 1 : Discuss the technique definition, idea and advantages]({% post_url 2017-07-28-simulated-annealing-part1 %})
- Part 2 (this post) : Applies this technique to a real problem by implementing a metaheuristic algorithm for the Traveling Salesman Problem.

Interactive Demo (SA applied to TSP)
---
<script>{% include canvas.js %}</script>
<script src="https://rawgit.com/pedrohfsd/TSP/develop/simulated_annealing.js"></script>

<div style="width:640px; margin:auto">
  <canvas id="canvas" width="640px" height="490" style="border:1px solid #000000;"></canvas>
  <br/><br/><input id='cityCountId' value='20' size="5"/> - Cities
  <br/><input id='temperatureId' value='1000' size="5"/> - Initial Temperature
  <br/><input id='dropRateId' value='0.05' size="5"/> - Temperature Drop Rate (\\(0\leq in<\\)1)
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
The [algorithm implementation](https://github.com/pedrohfsd/TSP/tree/develop){:target="_blank"} follows the 5 main steps described for Simulated Annealing in the previous [post](2017-07-28-simulated-annealing-part1) using stochastic sampling, but now applied to TSP:
1. Find a feasible solution for the TSP
1. While temperature is greater than 1:
    1. Build a new solution from the current one
    1. Try to use the new answer 
        1. If new solution is better than current use new solution as current, keep the best overall
        1. Else If \\(e^{\frac{current-new}{temperature}} > random(0,1)\\), use new solution as current
    1. Decrement temperature
1. Return the overall best answer

The javascript code follows (and for any other language really, the implementation is trivial):
```javascript
while(temperature > 1){
  var newTour = findNeighbour(currTour);
  if(newTour.cost <= currTour.cost || Math.exp((currTour.cost-newTour.cost)/temperature)>Math.random()){
    currTour = newTour;
    bestTour = Math.min(bestTour, currTour);
  }
  temperature *= 1-dropRate; // make it cooler
}
return bestTour;
```
Voila! That's pretty much the algorithm behind the interactive demo at the beginning of this page. Quite naive in some aspects, yes, but faithful tied to the theory.

Those small details
---
Yeah, I know! There's always some minor, but important, details of implementation that usually gone missing but, don't worry, I'll ty to cover them all. Let's repeat the steps but this time going diving into implementation details:
1. **Find a feasible solution for the TSP**: A TSP problem is, by convention, a complete graph (edge from everyone to everyone) so to find a valid tour (hamiltonian cycle) one can just list the cities (vertices) without repetition. Ex. If there are five 5 cities={A,B,C,D,E}, then A-B-C-D-E-A is already a valid tour and so is any random distinct other like C,B,D,E,A,C. 
1. **While temperature is greater than 1**:
    1. **Build a new solution from the current one**: this one can be tricky because this step is very important, an intelligent method here can quite improve the convergence of the algorithm. Although we want to find a random new answer it is no entirely random because we must use the current one to do this and, while we want it to be different from the current, we also want to change it way da it can somehow improve convergence as we just saw. The algorithm of this post chooses 2 random cities and swap them, you can see that ir works it is obviously quite naive.
    1. **Try to use the new answer** 
        1. **If the new solution is less than or equal to current one use the new solution as current**: we are after the best possible answer, if we found one we should keep it.
        1. **Else If \\(E^{\frac{current-new}{temperature}} > random(0,1)\\), use the new solution as current**: here lies all the mathematical fun =D. We will talk about this more in a few, for now we just need to understand that both sides of the equation will return a number between 0 and 1. So based on their size that will more or less chances to return true;
    1. **Keep the overall best answer**: again, we are after the best possible answer so if we found one we should keep it.
    1. **Decrement temperature**: make it some percent smaller so we can, eventually, end the algorithm
1. Return the overall best answer: that's it, our algorithm succeeded (well, it found an answer at least).

The Mathematical Fun
---
You may be challenged by the equation:
\\[e^{\frac{current-new}{temperature}} > random(0,1)\\]
Don' be. Just take a closer look at it and you will understand it. Everytime you reach this line of code is because \\(current>new\\), so this subtraction always return a number \\(< 0\\). This negative result will then be divided by the current temperature so: if the temperature is high then the negative number will be divided by a big number making it small, if the temperature is small then the negative number will be divided by small number making it big. Remember, though, that we are making "e" to the power of this negative number power so it's an inverse relationship the bigger the negative number the smaller will be E 'e' to it's power, ex. \\(e^{-x}>e^{-2x}\\). At the final part we are comparing the result to see if it's bigger than a random number \\(0\leq random(0,1)<1\\) so the bigger the result is, more likely it is to be greater than the randomly generated number. More especifically: if temperature is high, higher are the chances that the result will be greater than the randomly generated number.

The real challenge of this equation is demonstrating the probabilities in play, something in which we are better of reading [one of the papers](https://doi.org/10.1126%2Fscience.220.4598.671){:target="_blank"} that originated it.

References
---
1. [Wikipedia - Simulated Annealing](https://en.wikipedia.org/wiki/Simulated_annealing){:target="_blank"}
1. [Kirkpatrick, Scott, C. Daniel Gelatt, and Mario P. Vecchi. "Optimization by simulated annealing." science 220.4598 (1983): 671-680.](https://doi.org/10.1126%2Fscience.220.4598.671){:target="_blank"}
1. [Černý, V. (1985). "Thermodynamical approach to the traveling salesman problem: An efficient simulation algorithm". Journal of Optimization Theory and Applications. 45: 41–51.](https://doi.org/10.1007%2FBF00940812){:target="_blank"}
1. [Semenovskaya, S.; Khachaturyan, K.; Khachaturyan, A. (1985). "Statistical Mechanics Approach to the Determination of a Crystal". Acta Crystallographica (A41): 268–273.](https://doi.org/10.1107%2FS0108767385000563){:target="_blank"}
1. [Almost Looks Like Work by Jason Cole](https://jasmcole.com/2014/11/16/annealing-the-underground/){:target="_blank"}
1. [Wikipedia - Local optimum](https://en.wikipedia.org/wiki/Local_optimum){:target="_blank"}
1. [Wikipedia - Maxima and minima](https://en.wikipedia.org/wiki/Maxima_and_minima){:target="_blank"}

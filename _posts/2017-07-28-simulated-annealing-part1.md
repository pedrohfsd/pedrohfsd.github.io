---
layout: post
title: Optimization with Simulated Annealing - Part 1
date: 2017-07-28
---

> **I'm dividing this post into 2 parts:**
> - Part 1 (this post): Discuss the technique definition, idea and advantages 
> - [Part 2: Applies this technique to a real problem by implementing a metaheuristic algorithm for the Traveling Salesman Problem.]({% post_url 2017-08-04-simulated-annealing-part2 %})

![Annealing](/img/annealing.jpg)

Definition
---
> "Simulated annealing (SA) is a probabilistic technique for approximating the global optimum of a given function. Specifically, it is a metaheuristic to approximate global optimization in a large search space" ([Wikipedia 2017](https://en.wikipedia.org/wiki/Simulated_annealing){:target="_blank"}).

In other words, Simulated Annealing can be seen as a search strategy to help you find a good answer when finding the optimum one is impractical. It is very handy at finding answers to combinatorial problems (especially np-complete ones since we still don't know a Turing-deterministic polynomial time algorithm to solve them) when you don't have enough time or resource to waste by letting an exact algorithm (eg, a brute-force or Branch and Bound) finish.

The Technique
---
Ok then, so what about this technique? What's the idea behind it? Let's look at [Wikipedia](https://en.wikipedia.org/wiki/Simulated_annealing){:target="_blank"} again: 
> "The name and inspiration come from annealing in metallurgy, a technique involving heating and controlled cooling of a material to increase the size of its crystals and reduce their defects. Both are attributes of the material that depend on its thermodynamic free energy. Heating and cooling the material affects both the temperature and the thermodynamic free energy [...] This notion of slow cooling implemented in the Simulated Annealing algorithm is interpreted as a slow decrease in the probability of accepting worse solutions as the solution space is explored (accepting worse solutions is a fundamental property of metaheuristics because it allows for a more extensive search for the optimal solution). The simulation can be performed either by a solution of kinetic equations for density functions [...] or by using the stochastic sampling method" ([ref2](https://doi.org/10.1126%2Fscience.220.4598.671){:target="_blank"}, [ref3](https://doi.org/10.1007%2FBF00940812){:target="_blank"} and [ref4](https://doi.org/10.1107%2FS0108767385000563){:target="_blank"})

In other words, the idea behind this technique is somewhat similar to that of a heated metal. When it's hot enough (within a high temperature) the, before rigid/non-malleable/uneven, metal becomes malleable again until the heat is dissipated and the temperature drops making it rigid again. The analogy this makes into solving combinatorial problems is that we can think of the problem as a metal within a high temperature: we find a feasible solution and try to improve it as the temperature drops. Initially we will be able to try most of the possibilities, even if doesn't actually improves the current answer, because the metal is hot and we can easily mold it, but as the temperature drops we become less tolerant and only possibilities that do improve the answer can be tested until the metal is rigid again and we can't test any possibility anymore, returning as solution the best answer seen so far.

**Let's divide this process into 5 main steps then**:
1. Find a feasible solution
1. Use the current solution to create a new one
1. Check if we should use the new answer
    1. If new solution is better than current one use the new one as current
    1. Else depending how bad the new one is and how hot we are let's check if we should keep it (kinetic equations or stochastic sampling)
1. Repeat steps 2 and 3 until temperature is cold enough
1. Return the best answer seen so far

Advantages
---
Alright, now why should we use this technique? It doesn't necessarily finds the optimum answer, it's not necessarily fast (depends on the initial temperature, drop rate and perturbation strategy) and it's hard to predict how good the final answer may be. Why should we use it  in first place?

Well, start by noticing that this solution belongs to the metaheuristic solutions class so, like every other metaheuristic, it's not problem dependant, we can apply it to any problem we see fit.
When we don't know an optimum strategy to solve a problem or it's impractical to use an exact one, this technique may be a good option for try to find a good answer in an acceptable time. Actually, its popularity is quite big in many research fields.

Furthermore, because it's problem independant, it doesn't suffers from what many heuristics tend to suffer: [being stuck at local optimum](https://en.wikipedia.org/wiki/Local_optimum){:target="_blank"}. It has higher chances to converge to the global optimum (same as optimum answer) because it will, initially, accept answers that didn't improve the current answer and, by being worst than the previous, this new answer may get it out from the local optimum leading to another local, which this time is global, optimum. The image below, from Wikipedia, illustrates this optimization concept:  
![By KSmrq GFDL 1.2 http://www.gnu.org/licenses/old-licenses/fdl-1.2.html or GFDL http://www.gnu.org/copyleft/fdl.html, via Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Extrema_example_original.svg/256px-Extrema_example_original.svg.png){:target="_blank"}

Back to our initial question another advantage of this technique is that its speed and quality relate to the initial params, so one can balance speed over quality by incrementing or decrementing parameter values. This is ideal for scenarios where one can't prioritize both, making this technique one of the few viable solutions in this case. Using the Stochastic Sampling perturbations one can also use randomness in its favor by executing multiple instances in parallel: both will finish at the same time returning distinct answers, just keep then the best one to increase the chances of finding the optimum one.

#### Summarizing:
- Problem independent, applicable to any problem ("many" would be more precise here, but you got the point)
- Finds a good approximate solution when optimal is impractical
- Avoids local optimum dilemma, higher chances to converge to the global optimum
- Allows balancing speed over quality
- Stochastic, parallel solution improves approximation to optimum answer

Applications
---
Jump to [Part 2]({% post_url 2017-08-04-simulated-annealing-part2 %}) for a hands-on algorithm explaining how to implement Simulated Annealing to solve the Traveling Salesman Problem. 

References
---
1. [Wikipedia - Simulated Annealing](https://en.wikipedia.org/wiki/Simulated_annealing){:target="_blank"}
1. [Kirkpatrick, Scott, C. Daniel Gelatt, and Mario P. Vecchi. "Optimization by simulated annealing." science 220.4598 (1983): 671-680.](https://doi.org/10.1126%2Fscience.220.4598.671){:target="_blank"}
1. [Černý, V. (1985). "Thermodynamical approach to the traveling salesman problem: An efficient simulation algorithm". Journal of Optimization Theory and Applications. 45: 41–51.](https://doi.org/10.1007%2FBF00940812){:target="_blank"}
1. [Semenovskaya, S.; Khachaturyan, K.; Khachaturyan, A. (1985). "Statistical Mechanics Approach to the Determination of a Crystal". Acta Crystallographica (A41): 268–273.](https://doi.org/10.1107%2FS0108767385000563){:target="_blank"}
1. [Almost Looks Like Work by Jason Cole](https://jasmcole.com/2014/11/16/annealing-the-underground/){:target="_blank"}
1. [Wikipedia - Local optimum](https://en.wikipedia.org/wiki/Local_optimum){:target="_blank"}
1. [Wikipedia - Maxima and minima](https://en.wikipedia.org/wiki/Maxima_and_minima){:target="_blank"}

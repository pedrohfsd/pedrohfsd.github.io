---
layout: post
title: Metaheuristic - Simulated Annealing
date: 2017-07-28
---

{{ page.title }}
================
> "Simulated annealing (SA) is a probabilistic technique for approximating the global optimum of a given function. Specifically, it is a metaheuristic to approximate global optimization in a large search space" ([Wikipedia 2017](https://en.wikipedia.org/wiki/Simulated_annealing)).

In other words, Simulated Annealing can be seen as a search strategy to help you find a good answer when finding the optimum one is impractical. It is very handy at finding answers to combinatorial problems (especially np-complete ones since we still don't know a Turing-deterministic polynomial time algorithm to solve them) when you don't have enough time or resource to waste by letting an exact algorithm (eg, a brute-force or Branch and Bound) finish.

Ok then, so what about this technique? What's the idea behind it? Let's look at wikipedia again: 
> "The name and inspiration come from annealing in metallurgy, a technique involving heating and controlled cooling of a material to increase the size of its crystals and reduce their defects. Both are attributes of the material that depend on its thermodynamic free energy. Heating and cooling the material affects both the temperature and the thermodynamic free energy [...] This notion of slow cooling implemented in the Simulated Annealing algorithm is interpreted as a slow decrease in the probability of accepting worse solutions as the solution space is explored (accepting worse solutions is a fundamental property of metaheuristics because it allows for a more extensive search for the optimal solution). The simulation can be performed either by a solution of kinetic equations for density functions [...] or by using the stochastic sampling method" ([ref2](https://doi.org/10.1126%2Fscience.220.4598.671), [ref3](https://doi.org/10.1007%2FBF00940812) and [ref4](https://doi.org/10.1107%2FS0108767385000563))

In other words, the idea behind this technique is somewhat similar to that of a heated metal. When it's hot enough (within a high temperature) the, before rigid/non-malleable/uneven, metal becomes malleable again until the heat is dissipated and the temperature drops making it rigid again. The analogy this makes into solving combinatorial problems is that we can think of the problem as a metal whithin a high temperature: we find a feasible solution and try to improve it as the temperature drops. Initially we will be able to try most of the possibilities, even if doesn't acually improves the current answer, because the metal is hot and we can easily mold it, but as the temperate drops we become less tolerant and only possibilites that do improve the answer can be tested until de metal is rigid again and we can't test any possibility anymore, returning as the solution the best answer seen so far.


Where to use it?
---

References
---
1. [Wikipedia - Simulated Annealing](https://en.wikipedia.org/wiki/Simulated_annealing)
2. [Kirkpatrick, Scott, C. Daniel Gelatt, and Mario P. Vecchi. "Optimization by simulated annealing." science 220.4598 (1983): 671-680.](https://doi.org/10.1126%2Fscience.220.4598.671)
3. [Černý, V. (1985). "Thermodynamical approach to the traveling salesman problem: An efficient simulation algorithm". Journal of Optimization Theory and Applications. 45: 41–51.](https://doi.org/10.1007%2FBF00940812)
4. [Semenovskaya, S.; Khachaturyan, K.; Khachaturyan, A. (1985). "Statistical Mechanics Approach to the Determination of a Crystal". Acta Crystallographica (A41): 268–273.](https://doi.org/10.1107%2FS0108767385000563)

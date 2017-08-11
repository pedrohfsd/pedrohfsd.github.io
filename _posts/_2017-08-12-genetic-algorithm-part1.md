---
layout: post
title: Optimization with Genetic Algorithm - Part 1
date: 2017-08-11
update:
---

> #### I'm dividing this post into 2 parts:
> - Part 1 (this post): Discuss the technique definition, idea and time complexity 
> - [Part 2 (soon): Applies this technique to a real problem by implementing a metaheuristic algorithm for the Traveling Salesman Problem.]()

Member of the [Evolutionary Computing](https://en.wikipedia.org/wiki/Evolutionary_computation) set of algorithms, a Genetic Algorithm is a metaheuristic technique based on Darwin's theory of evolution (which defines the idea of natural selection observed in earth's nature) to gradually improve an objective function value. The analogy is that a problem's answers can be used to build a new generation of improved answers the same way a population of individuals can be used to build a new generation of improved individuals. 

A really nice description for this intuition is given by [Marek Obitko](http://www.obitko.com/tutorials/genetic-algorithms/index.php) at his [site for ]()
> A Genetic Algorithm starts "with a set of solutions (represented by chromosomes) called population. Solutions from one population are taken and used to form a new population. This is motivated by a hope, that the new population will be better than the old one. Solutions which are selected to form new solutions (offspring) are selected according to their fitness - the more suitable they are the more chances they have to reproduce."

References
---
1. [Wikipedia - Evolutionary Computation](https://en.wikipedia.org/wiki/Evolutionary_computation)
1. [Marek Obitko](http://www.obitko.com/tutorials/genetic-algorithms/index.php)

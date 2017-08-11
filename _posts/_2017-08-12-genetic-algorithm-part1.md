---
layout: post
title: Optimization with Genetic Algorithm - Part 1
date: 2017-08-11
update:
---

> #### I'm dividing this post into 2 parts:
> - Part 1 (this post): Discuss the technique definition, idea and time complexity 
> - [Part 2 (soon): Applies this technique to a real problem by implementing a metaheuristic algorithm for the Traveling Salesman Problem.]()

Member of the [Evolutionary Computing](https://en.wikipedia.org/wiki/Evolutionary_computation) set of algorithms, a Genetic Algorithm is a metaheuristic technique (first proposed by [John Holland](https://pt.wikipedia.org/wiki/John_Henry_Holland) in the early 1970's) based on Darwin's theory of evolution (which defines the idea of natural selection observed in earth's nature) that tries to gradually improve an objective function value. The analogy is that a problem's answers can be used to build a new generation of improved answers for the same problem the same way a population of individuals can be used to build a new generation of improved individuals. 

A really nice description for this intuition is given by Marek Obitko at his ["Introduction to Genetic Algorithms" website](http://www.obitko.com/tutorials/genetic-algorithms/index.php) (**which is a highly recommend reading**):
> A Genetic Algorithm starts "with a **set of solutions** (represented by **chromosomes**) called **population**. Solutions from one population are taken and used to form a new population. This is motivated by a hope, that the new population will be better than the old one. Solutions which are selected to form new solutions (**offspring**) are selected according to their fitness - the more suitable they are the more chances they have to reproduce. This is repeated until some condition (for example number of populations or improvement of the best solution) is satisfied."

This intuition is usually translated into the following procedure:

1. Create current generation (a list of feasible answers to the problem at hand)
1. While condition is not meet (a specific fitness values or the max number of generations)
    1. While new generation is not full
      1. Selection (select parents based on fitness (not necessarily two), the higher the fitness higher are the chances of being selected)
      1. Crossover (Cross them based on probability)
      1. Mutate (mutation probability is usually low)
    1. Set new generation as current
    1. Elitism (the fittest of the previous generation can be included in the new one)
1. Return the overall fittest individual

>For all the sections below, please consider reading the ["Introduction to Genetic Algorithms" website](http://www.obitko.com/tutorials/genetic-algorithms/index.php) for more detail. I'm just addin them for quick reference.

Selection
---
- Roulette Wheel Selection: Calculate the sum of fitnesses <code>S</code> from current generation and generate a random number <code>R</code> from 0 to <code>S</code>. Iterate through the current generation while accumulating each fitnesses <code>A</code>, return first indivual where <code>A</code> is greater than <code>R</code>. This selection strategy greatly benefits higher fitness individuals.
- Rank Selection: Sort the current generation by ascending fitness. Number them from 1 to N and execute the Roulette Wheel Selection using their new number instead of their fitness. This changes the probability distribution on the Roulette Wheel Selection to be more uniform and less focused on higher fitness individuals.
- Steady-State Selection: Generate new individuals with the fittest parents, then copy the old generation, remove low fitness individuals and the new indivuals.

Crossover
---
- Binary Encoding
- Permutation Encoding
- Value Encoding
- Tree Encoding

Mutation
---
Based on mutation parameter, randomly change or switch genes.

Application
---


References
---
1. [Wikipedia - Genetic Algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm)
1. [Wikipedia - Evolutionary Computation](https://en.wikipedia.org/wiki/Evolutionary_computation)
1. [Introduction to Genetic Algorithms](http://www.obitko.com/tutorials/genetic-algorithms/index.php)
1. [Genetic Algorithms](https://www.doc.ic.ac.uk/~nd/surprise_96/journal/vol1/hmw/article1.html)
1. [Genetic Algorithms in Plain English](http://www.ai-junkie.com/ga/intro/gat1.html)

---
layout: post
title: Optimization with Genetic Algorithm - Part 1
date: 2017-08-12
update:
---

> #### I'm dividing this post into 2 parts:
> - Part 1 (this post): Discuss the technique definition, idea and time complexity 
> - [Part 2 (soon): Applies this technique to a real problem by implementing a metaheuristic algorithm for the Traveling Salesman Problem.]()

![Evolutionary Computing](/img/evolution.jpg)

Member of the [Evolutionary Computing](https://en.wikipedia.org/wiki/Evolutionary_computation) set of algorithms, a *Genetic Algorithm* is a metaheuristic technique (first proposed by [John Holland](https://pt.wikipedia.org/wiki/John_Henry_Holland) in the early 1970's) based on *Darwin's theory of evolution* (which defines the idea of natural selection observed in earth's nature) that tries to gradually improve an objective function value. The analogy is that a problem's answers can be used to build a new generation of improved answers for the same problem the same way a population of individuals can be used to build a new generation of improved individuals. 

A really nice description for this intuition is given by Marek Obitko at his ["Introduction to Genetic Algorithms" website](http://www.obitko.com/tutorials/genetic-algorithms/index.php) (**which is a highly recommend reading**):
> A Genetic Algorithm starts "with a **set of solutions** (represented by **chromosomes**) called **population**. Solutions from one population are taken and used to form a new population. This is motivated by a hope, that the new population will be better than the old one. Solutions which are selected to form new solutions (**offspring**) are selected according to their fitness - the more suitable they are the more chances they have to reproduce. This is repeated until some condition (for example number of populations or improvement of the best solution) is satisfied."

This intuition is usually translated into the following procedure:

1. Create current chromosome generation (a list of feasible answers to the problem at hand)
1. While condition is not meet (a specific fitness values or the max number of generations)
    1. While new generation is not full
        1. **Selection** (select parents based on fitness (not necessarily a pair), the higher the fitness higher are the chances of being selected)
        1. **Crossover** (cross them based on probability)
        1. **Mutate** (mutation probability is usually low)
    1. Set new generation as current
    1. **Elitism** (the fittest of the previous generation can be included in the new one)
1. Return the overall fittest individual

>For all the sections below, please consider reading the ["Introduction to Genetic Algorithms" website](http://www.obitko.com/tutorials/genetic-algorithms/index.php) for more detail. I'm adding them here mostly for quick reference.

Definitions
---
- **Generation**: Children of a crossover operation
- **Chromosome**: A set of genes; usually a feasible answer to a problem.
- **Population**: Number of chromosomes in the *Generation*
- **Gene**: A single information of the chromosome; usually a bit or a single characteristic of the feasible answer.
- **Genotype**: A particular set of genes and settings that determines the phenotype.
- **Phenotype**: The physical expression of the genotype - the organism itself.

Selection
---
- **Roulette Wheel Selection**  
Calculate the sum of fitnesses <code>S</code> from current generation and generate a random number <code>R</code> from <code>0</code> to <code>S</code>. Iterate through the current generation while accumulating each fitnesses <code>A</code>, return first chromosome where <code>A</code> is greater than <code>R</code>. This selection strategy greatly benefits higher fitness chromosome.
- **Rank Selection**  
Sort the current generation by ascending fitness. Number them from <code>1</code> to <code>N</code> and execute the *Roulette Wheel Selection* using their new number instead of their fitnesses. This changes the probability distribution on the *Roulette Wheel Selection* to be more uniform and less focused on higher fitness chromosomes.
- **Steady-State Selection**  
Generate new chromosomes with the fittest parents, then copy the old generation, remove low fitness chromosomes and add the new chromosomes.

Crossover
---
- **Binary Encoding**  
A chromosome is represented by a string of sequential bits. eg. <code>10100101</code>
- **Permutation Encoding**  
A chromosome is represented by a string of sequential numbers or letters. eg. <code>ABDEFGCH</code> or <code>93847565</code> 
- **Value Encoding**  
A chromosome is represented by a string of real numbers, words or any other multicharacter value. eg. <code>(word1)(word3)(word4)(word5)</code> or <code>(21.5)(32.4)(1.45678)</code>

Mutation
---
Based on mutation parameter, randomly change or switch or or more genes. eg. <code>AB<b>C</b>DE<b>F</b>GH</code> -> <code>AB<b>F</b>DE<b>C</b>GH</code>

Time Complexity
---
If the main loop will run until a specific low fitness chromosome is reached, then it's difficult to predict when it will stop or if it will stop at all. That's one of the reasons why a maximum number of generations if given to the final algorithm, to assure it will stop and to better balance it's speed/quality. In this case time complexity is mostly given by the strategy defined for *Crossover* since the *Population* size, number of *Generations*, *Selection* iterations and *Mutation* iterations will be a constant number, unrelated to the input size.

Application
---
Jump to [Part 2 (soon)]() for a hands-on algorithm explaining how to implement a Genetic Algorithm to solve the Traveling Salesman Problem.

References
---
1. [An introduction to Genetic Algorithms](https://mitpress.mit.edu/books/introduction-genetic-algorithms)
1. [Introduction to Genetic Algorithms](http://www.obitko.com/tutorials/genetic-algorithms/index.php)
1. [Genetic Algorithms](https://www.doc.ic.ac.uk/~nd/surprise_96/journal/vol1/hmw/article1.html)
1. [Genetic Algorithms in Plain English](http://www.ai-junkie.com/ga/intro/gat1.html)
1. [Wikipedia - Genetic Algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm)
1. [Wikipedia - Evolutionary Computation](https://en.wikipedia.org/wiki/Evolutionary_computation)
1. [Wikipedia - Chromosome](https://en.wikipedia.org/wiki/Chromosome)
1. [Wikipedia - Gene](https://en.wikipedia.org/wiki/Gene)
1. [Wikipedia - Genotype](https://en.wikipedia.org/wiki/Genotype)
1. [Wikipedia - Phenotype](https://en.wikipedia.org/wiki/Phenotype)
1. [Wikipedia - Generation](https://en.wikipedia.org/wiki/Generation)

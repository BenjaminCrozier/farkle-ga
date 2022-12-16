## 12/4/22   
the evolution of the player pool is stagnating. 

I believe the number of genes being exchanged is greater than the number of instances in which those genes are initiated and therefore the evolution of the pool is stalled. 

The number of genes activated in a given game is less than the number of genes exchanged each epoch. I suspect evolution is stalled because the player's fitness per game is described with a minority of a players genes, while a greater majority of genes are exchanged each generation. No generation can make meaningful progress (in the evolution of their genes) because the bulk of their genes go untested for multiple generations. 

too many genes are dormant for too many generations and are traded away before they can be expressed to impact the players fitness. each player has the capacity to carry too many bad dormant genes for too long before their expression hurts the player. in the interim they've tainted the gene pool, there is too much opportunity for good genes to be lost in a shuffle of mediocre players surviving by chance. perhaps a more sever reaction to poor gene expression; removing the player from the pool, will ensure poor genes are no longer intermixing.

punishing the fitness scores of players does not seem to be effective in removing bad genes from the pool. I will try a more toxic approach that removes players completely for bad expression. Will also device a test for my theory about dormant gene. 

***

created a zero tolerance policy (player.doom) for objectively suboptimal scoring (leaving points on the table). 
this policy would eliminate any bad genes from propagating. It also seems to create population crashes I can't quite account for. 
Changed the makeNewEpiGene() to 1's by default. This keeps players from violating the zero tolerance policy at birth. I wish it was less opinionated in how to play the game, but the choice of what not to play still remains for the future generations of players. 
added functions to fill in the pool when there is a population collapse. Still not sure why that's happening. 


## 12/5/22   
investigating the population crash phenomenon 

***

even with aggressive punishment (instant death) children have genomes with sub-optimal plays because of natural mutations in the "birthing" process. These can exist for several generations before they're expressed and kill the player/child: thus deadly genes can still propagate within a population. 

Is this a common problem in genetic algorithms? is every gene suppose to be expressed in every epoch? dormant mutated genes seem very problematic, perhaps i need a larger population... This would require a more efficient geneBank, or migrating this project to node.js...

***

avg genome length is stalled. players with genes longer than 700 are rare and my target is 15625. player genomes should be growing exponentially every generation as their genes coalesce, every new generation should be gaining the genes of rolls from both parents. no generations genome should be shorter than their parents. This must be the population collapse that's preventing elongation. 

***

reworking the naming/heritage system yields insight. a player is only able to risk their narrow set of mutated born genes. in every new scenario they "play it safe" with the default epi-genome of '1's. this insures a constant churn new DNA... 

reduced the birthrate of royalty, new heritage emoji reveals redundant DNA with too large a litter. 

low population crash means more rounds per player! this explains the cascading failure of small populations! Also suggests the presence of toxic recessive genes... there is a long pause between when a player is given a mutation and when that mutation is expressed. as a result these recessive genes can lay dormant and spread, polluting the pool! new gene expression must be immediately tested! unclear how DNA IRL avoids this. 

I had a hunch that makeNewEpiGene was too opinionated towards safety! I am vindicated, this seemingly innocuous decision was causing cyclical population collapse. 

genome growth is now slow but steady...


## 12/6/22   
growth was capped at 575 after several hours. the pool now exclusively plays 1 round only. in hindsight it's obvious that if only one DNA pair is mutated the result is a dangerous re-roll that voids all points. 

interesting note: once the pool hit 575, the chromosome pool was completely homogeneous. everybody's epi-genome read "111111": the safest play when rerolling a single dice could void your score completely.  

the mutation rate on an new expressing genome must be significantly higher and must affect more than one pair. 

***

mutating a single pair in a gene is always more dangerous that it's worth. mutating 1 pair means your forcing a single die reroll which is a 66% chance of farkle. 

total gene mutation is required. 

***

removing doom mechanic and replacing it with a cull for negative scores and a scaling punishment per epoch. doom mechanic is just too punishing and does not allow allow for players to survive to 2nd rounds plays which are necessity for genome growth. (local maxima; safe play: simply play the first round and do not engage in a second round)

however, when allowed to survive, bad dormant genes spread quickly and create population collapse in later rounds with greater scale punishment... a punish scale of greater than 4 causes population collapse and the gene-pool average score is trending negative... perhaps allowing non-optimal dice play should never be allowed... 

but if the model can't sufficiently punish suboptimal play, how can it evolve upward and determine optimal play? the model lacks buoyancy, punishing suboptimal play shouldn't be required, it should determine suboptimal play on it's own and punish accordingly...

a toxic gene cannot be allowed to survive a single generation. doom re-instated. 

***

punish mechanic is inherently flawed, choosing to re-roll 1' and 5's is a completely valid choice. this creates a problem of leaving big wins on the table in the form of 6x dice... hopefully cream will rise to the top. 

each choice is a gateway to a new collection of dice: 

6->[1,5][2,4][3,3][null][6]
5->[1,4][2,3][null][6]
4->[1,3][2,2][null][6]
3->[1,2][null][6]
2->[1,1][null][6]
1->[null][6]
where null is farkle and 6 is a re-roll. 
the pairing represents winning collections ([123443]=>[1,5]:keep 1, discard 5, or vice versa: [666663]=>[51]:5 of a kind, discard one (3))

this represents every possible OUTCOME for a given roll, followed by a choice.
* [null] => farkle, no choice
* choose scoring (and reroll) [1,5][2,4][3,3]
* choose [null] (pass with no points)
* choose complete reroll [6]

this logic IS  captured with the schema 123456x111111 (player cashes in on a straight) but deviation from this epi-genome (111111) is not punished immediately, and in a backwater gene-pool can be widely spread; discarding an otherwise great gene. 

There's also an element of luck that might not be accounted for. a player with great genes might fall victim to several unlucky rolls and become removed from the gene pool entirely as a result.

perhaps a schema where exogamous exact female clones of male fathers carry on good genomes and do not remix with family (lowering mutation rate) and maintaining the genome's legacy. I like that this mirrors nature could possibly bridge the luck chasm...

***

female players are perfect clones of their parent. hopefully this creates a greater half-life for winning-est genomes. As parents age and mutate each round, a second chance to add better DNA to their genome exists in their daughters.

***

changing the fitness cull to avg score, rather than recent score, has radically improve this mode on every metric. 

in hindsight, a cumulative punish score would have worked better as well. 

***

...there are 46,656 different combinations of rolling 6 dice, suggesting 2,176,992,736,656 roll attempts to hit every combination and considerably more to evolve this model...  This model would require hitting each combination multiple times to compare/evolve. 

this may not have been a good use case for a brute-force approach to a genetic algorithms.

This game also has the interesting caveat of changing the more people are playing. even though the genomes are not very good at the game, simply by having so many of them playing one is bound to reach the 10k finish-line in less than 10 rounds by sheer luck alone. You would likely beat any 1 genome on it's own, but as a collective they will hog all the luck and beat you. 

gene pool is stagnating at 890 genome length. nowhere near the 46,656 needed for a complete genome. 


## 12/11/2022   
Apparently, the actually number of permutations for six dice is 462. This is derived from a binomial coefficient of $\binom{11}{6}$. 

given we're combining combinations 1-6: 

$\binom{11}{6}$ + $\binom{10}{5}$ + $\binom{9}{4}$ + $\binom{8}{3}$ + $\binom{7}{2}$ + $\binom{6}{1}$
= 462 + 252 + 126 + 56 + 21 + 6
= 923

which is a much more manageable genome! and also a better match for the genome lengths found. 

***

attempted to create a complete genome by interacting in base 6: 1-46656. (ref: `oneOff()`)
I assumed this would encompass all possible combination of dice, converting the number to a set of dice: 
`f(n)=6-n: 11=>[5,5], 554=>[1,1,2]` 
however this fails to include double zeros, as we do not count 98-99-00-100. the base 6 conversion of 1-46656 very nearly approximates all possible combinations of 6 dice, it fails to describe the set of all 6's (or 1's, depending on your bijection/conversion), so 666666, 66666, 6666, 666, and 66 are missing. note, 0 (6), is not missing. No doubt some fantastic mathematical rule or formula is behind this.

## 12/15/2022   
fixed bug in player.splice(). Typescript would have identified this error immediately. In lieu of adding a compiler i've added a undefined check for the geneBank. 

players with max genome length are appearing quickly and seem to persist, 

***

new goal for winner: win 5 games. this should prove a high degree of fitness and be worthy of inspection. 
# farle-ga
### a genetic algorithm that searches for optimal play in the dice game farkle

[farkle](https://en.wikipedia.org/wiki/Farkle) is a dice game where players throw 6 dice and re-roll non-scoring dice (provided at least 1 scoring die is "banked"). 

this genetic algorithm describes the choices of players with the following genome schema: 

`123456x111111`

where: 
* 123456 represents a "straight"
* 111111 represents the decision to bank all dice (yielding: 1500 points)

each gene represents a collection of dice, each epigenome represents the decision of which dice to bank and which to reroll. 

as a javascript object, the genome of a given player is a hash table, each unique string producing an "epi-genome" of decisions on which dice to keep and discard or bank. 

because the dice are sorted small to large the number of genome-object keys is significantly reduced. (there is no "654321" or "123654" key, only "123456")

a segment of a player's genome object may look as follows: 

`{
    ...
    "4444": "1011",
    "4445": "1110",
    "4466": "1111",
    "4555": "1111",
    "111112": "111110",
    "111114": "110110",
    "111115": "111110",
    "111123": "111111",
    "111124": "100110",
    ...
}`

Note: this algorithm does not include any logic for decision making among players to find the most optimal play. Players are allowed to ignore any and all "point bearing" dice and even forfeit their turn. 





# The Moby Thesaurus
Game Edition

## Introduction

The Moby Thesaurus is a delightful and eclectic compendium released into the public domain by Grady Ward in 1995 [Wikipedia](https://en.wikipedia.org/wiki/Moby_Project) and contains 30,260 root terms and over 2.5 million synoyms & related terms in English. I combined it with word frequencies from Google's Trillion Word Corpus with the vague idea of making a semantic word game. What I ended up with is a kind of a logophile's scavenger hunt with the goal of finding paths along shared synonyms between different entries in the thesaurus. In the process I stumbled upon a way of browsing the thesaurus in which synonyms are displayed in a 2D "heat map word cloud" of hyperlinks colored and filtered by the word frequency as an alternate way of browsing the thesaurus without ever having to play the game  

Browse Mode

[Screencast from 2024-09-08 11-28-05.webm](https://github.com/user-attachments/assets/ec5e2382-704e-48db-9706-78494dec9873)

Game Mode

The object of the game is to find a path between two entries in the thesaurus (the start and end entries). The game begins by defaulting to your current location and computing a least cost path to the target when the "Nav" (Navigate) button is pressed with target entry typed in. The ideal path consists of the "rarest" (low frequency) *shared* synonyms from the start to target. It can be very challenging to find any path let alone consisting only of the rarest synonyms. For this reason a "cheat" option is made available: If you're stumped as to which synonym to click on next,the >> button (forward) will take you to the next best synonym from wherever you are. The << (back) button always takes you back and +/- to zoom in and out. Your score, should you even care, is comprised of 3 things - 1) The total path cost (summed frequencies of all the synonyms clcked on), 2) the total number of jumps made and 3) the number of cheats resorted to inorder to get there). There's usually more than one path and it is possible to beat the algorithm by carefully observing how it works. 



[vilify to deify](https://github.com/user-attachments/assets/bfde92c3-4e6f-4b77-99fc-f33bc2ef84c8)


## Notes:
This is super alpha code
The UI in game mode sucks, is non-intuitive etc. I tried to boil it down to the minimum # controls needed to play the game, so things like the >> (forward) button is overloaded to mean "next best synonym" 









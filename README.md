
# The Moby Thesaurus
Game Edition (Now With Cheats!®)

## Introduction

The Moby Thesaurus is a delightful and eclectic compendium released into the public domain by Grady Ward in 1995 [Wikipedia](https://en.wikipedia.org/wiki/Moby_Project). It contains 30,260 root terms and over 2.5 million synoyms & related terms in English, seemingly with plenty of Americana from the post war years through the 70s. I combined it with word frequencies from Google's Trillion Word Corpus with the vague idea of making a semantic word game. What I ended up with is a kind of a logophile's scavenger hunt with the goal of finding paths along shared synonyms between different entries in the thesaurus. In the process I stumbled upon a way of browsing the thesaurus in which synonyms are displayed in a 2D "heat map word cloud" of hyperlinks colored and filtered by the word frequency which provides an alternate way of browsing the thesaurus without ever needing to play the game.  

Browse Mode

[Screencast from 2024-09-08 11-28-05.webm](https://github.com/user-attachments/assets/ec5e2382-704e-48db-9706-78494dec9873)

Game Mode

The object of the game is to find a path between different entries (the start and end entries). The game defaults to your current location and computing a least cost path to the target when the "Nav" (Navigate) button is pressed (after the target entry is typed in). The ideal path consists of the "rarest" (lowest frequency) *shared* synonyms from the start to target. Opposites frequently work well but not always. It can be very challenging to find any path let alone one consisting only of the rarest synonyms. For this reason there's a "cheat" option: If you're stumped the >> button (forward) will take you to the next best synonym from wherever you are. The << (back) button always takes you back and +/- to zoom in and out. Your score is updated at each step and is comprised of 3 numbers - 1) The total path cost (summed frequencies of all the synonyms clcked on), 2) the total number of jumps made and 3) the number of cheats resorted to in order to get there). The minimum cost to the target from your current location is always always displayed as well.  There's usually more than one path and it is sometimes possible to beat the algorithm by carefully observing how it works. Cheat with a clear conscience, you're at the mercy of the authors' whimsical notions of semantics and Google's madness of the crowd (derived word frequencies) 


[vilify to deify](https://github.com/user-attachments/assets/bfde92c3-4e6f-4b77-99fc-f33bc2ef84c8)


## Notes:
- Self contained ("static") React + Vite app, no server side component.
- Super alpha, plenty of warts. Out to the unwitting for demos/feedback.
- The UI in game mode is not intuitive ("cheats" exposed via the >> (forward) button), too many numbers, etc. 
- Obvious optimizations made but the thesaurus entries are read only plain text and likely 50% or more of ~20MB can be saved + a perf boost using a formally concise data structure.
- Stand alone moby.js node console app serves as a CLI reference implementation of sorts and can be fiddled with to find different paths, track down bugs, etc
- Not affiliated with the Moby Project, Grady Ward or the LDS Church.

  










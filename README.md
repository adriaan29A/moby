
# The Moby Thesaurus
Game Edition (Now With Cheats!®)

## Introduction

The Moby Thesaurus is a delightful and eclectic compendium released into the public domain by Grady Ward in 1995 [Wikipedia](https://en.wikipedia.org/wiki/Moby_Project). It contains 30,260 root terms and over 2.5 million synoyms & related terms in English, replete with Americana and old colloquialisms through to the 1970s. I combined it with word frequencies from Google's Trillion Word Corpus with the vague idea of making a semantic word game. What I ended up with is a kind of a logophile's scavenger hunt with the goal of finding paths along shared synonyms forming chains between different entries in the thesaurus. In the process I stumbled upon a way of browsing the thesaurus in which synonyms are displayed in a 2D "heat map word cloud" of hyperlinks colored and filtered by their word frequencies. This provides an alternate way of browsing the thesaurus independent of it's usage in the game.  

Browse Mode

[Screencast from 2024-09-08 11-28-05.webm](https://github.com/user-attachments/assets/ec5e2382-704e-48db-9706-78494dec9873)

Game Mode

The object of the game is to find a path between two different entries through their shared synonyms subject to the constraint that the sum of the word freqencies for each synonym along the path is to be minimized (ideally consists of the "rarest" shared synonyms).  

To play - Choose two words or phrases in advance, call them the start and the target. Navigate to the start. Type in the target and instead of clicking "Go" or hitting <ret> click "Nav" (for navigate to) instead. You'll see some new info pop up, note particularly "Min Cost/Jumps" which always gives the lowest possible cost (& the # required clicks) to reach the target from the current location (without revealing the path). As you navigate you will see your path being tracked just under the text input form. 

Finding any path can be challenging. When you're stumped hit the >> (forward) button and you will be navigated to the next best synonym at the cost of 1 cheat. The << (back) button takes you back and use +/- buttons to zoom in and out (games are typically played at the lowest levels, 50k - 200k). The cumulative score is updated at each step and has three components: 1) The total path cost (summed frequencies of all the synonyms visited), 2) the total number of synonyms visited (usually the # jumps) and 3) the total # of cheats resorted to. There are frequently multiple paths to the target and it is actually possible sometimes to beat the algorithm... 


[vilify to deify](https://github.com/user-attachments/assets/bfde92c3-4e6f-4b77-99fc-f33bc2ef84c8)


## Notes:
- Self contained ("static") React + Vite app, no server side component.
- Super alpha, plenty of warts. Out to the unwitting for demos/feedback.
- The UI in game mode is not intuitive ("cheats" exposed via the >> (forward) button), too many numbers, etc. 
- Obvious optimizations made but the thesaurus entries are read only plain text and likely 50% or more of ~20MB can be saved + a perf boost using a formally concise data structure.
- Stand alone moby.js node console app serves as a CLI reference implementation of sorts and can be fiddled with to find different paths, track down bugs, etc
- Not affiliated with the Moby Project, Grady Ward or the LDS Church.

  










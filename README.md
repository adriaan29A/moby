
# The Moby Thesaurus
Game Edition (Now With Cheats!®)

## Introduction

The Moby Thesaurus is a delightful and eclectic compendium released into the public domain by Grady Ward in 1995 [Wikipedia](https://en.wikipedia.org/wiki/Moby_Project). It contains 30,260 root terms and over 2.5 million synoyms & related terms in English, replete with Americana and old colloquialisms through to the 1970s. I combined it with word frequencies from Google's Trillion Word Corpus with the vague idea of making a semantic word game. What I ended up with is a kind of a logophile's scavenger hunt with the goal of finding paths along shared synonyms between different entries. In the process I found a simple way of incorporating the frequencies into a main view such that sets of synonyms (synsets) are displayed in a 2D "heat map word cloud" of hyperlinks colored and filtered by their respective frequencies. While originally intended with the game in mind, I think it ends up being a reasonable way to browse the thesaurus on its own. 


Browse Mode

[Screencast from 2024-09-08 11-28-05.webm](https://github.com/user-attachments/assets/ec5e2382-704e-48db-9706-78494dec9873)

Game Mode

The object of the game is to find a path between two different entries through their shared synonyms. Common synonyms (high frequency) cost the most, less commonplace cost less and the range spans 7 orders of magnitude. Finding any path can be challenging. I added a concept of "cheats" to the game because it would be just too hard to play otherwise. I think they play something akin to "par" score in golf.  In game mode (see below) click the ">>" button (fwd/next) and you will be navigated 1 step to the next synonym along a minimum cost path path towards the target from your current location. This is true for any location you happen to be and repeatedly clicking ">>" will always take you to the target along the/a minimum cost path. Dyjkstra's algorithm in action! The #cheats is tracked as a second component to the score and the two (cost, #cheats) comprise your compound game score. The #jumps (navigations) is useful data. Not to overemphasize the metrics, the idea here is to provide a semi-structured way of browsing through the work with a little playful competitiveness thrown in. 


To play - 
- To navigate either click on a term you see or type one in, click "Go" or hit "<ret>" Use the "+/-" to zoom in/out and "<<" to go back.
- Start from your current location or navigate to the word/phrase you'd like to start from Type in a term and click "Nav"
- Type in the target and click the "Nav" button (for Navigate) You will see additional info pop up
- Note the "Min Cost/Jumps" - this is the minimum cost to meet or beat*
- Mouse over synynoms to see their raw frequencies
- Click on synonyms you think will get you to the target
- Click on ">>" to cheat and be moved 1 synonym towards the target

* It's actually possible to beat Dyjkstra's altgoritm *as implemented* which is kind of cute. I didn't plan it, it's just a happy circumstance of how the thesaurus is designed and the way Dyjkstra's works. I don't want to say how until I figure out if it can be used as a general strategy in practice or people might figure it out anyway, so lmk! :-) 


[Screencast from 2024-09-11 10-12-56.webm](https://github.com/user-attachments/assets/b022f348-5793-42c9-881f-3f6793020eee)

## Notes:
- Self contained ("static") React + Vite app, no server side component.
- Super alpha, plenty of warts. Out to the unwitting for demos/feedback.
- The UI in game mode is not intuitive ("cheats" exposed via the >> (forward) button), too many numbers, etc. 
- Obvious optimizations made but the thesaurus entries are read only plain text and likely 50% or more of ~20MB can be saved + a perf boost using a formally concise data structure.
- Stand alone moby.js node console app serves as a CLI reference implementation of sorts and can be fiddled with to find different paths, track down bugs, etc
- Not affiliated with the Moby Project, Grady Ward or the LDS Church.

  










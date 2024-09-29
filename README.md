# The Moby Thesaurus
Game Edition (Now With Cheats!®)

## Introduction

The Moby Thesaurus is an eclectic and delightful compendium released into the public domain by Grady Ward in 1995 [(Wikipedia)](https://en.wikipedia.org/wiki/Moby_Project). This English version contains 30,260 root terms and over 2.5 million related synonym and related sayings replete with Americana and oft amusing colloquialisms ranging from the antedeluvian through 1960s Hippiedom. I combined it with word frequencies from [Google's Trillion Word Corpus](https://research.google/blog/all-our-n-gram-are-belong-to-you/) with the vague idea of making a semantic word game. What I ended up with is a kind of a logophile's scavenger hunt with the goal of finding synonyms along paths between different entries. Along the way a simple method of incorporating the frequencies into a view fell out such that sets of synonyms (synsets) are displayed in a 2D "heat map word cloud" of hyperlinks colored and filtered by their respective frequencies. While originally intended with the game in mind it ends up being the main view by which the thesaurus is browsed.


Browse Mode

[Screencast from 2024-09-08 11-28-05.webm](https://github.com/user-attachments/assets/ec5e2382-704e-48db-9706-78494dec9873)

Game Mode

The object of the game is to find a path between two different terms through their shared synonyms. More commonplace synonyms (high frequency) cost the most, less popular ones cost less, with a range spanning 7 orders of magnitude. Finding any path can be challenging so a "cheat" option is provided because it would be too difficult to play otherwise. Cheats play something akin to a "par" score in golf  When in game mode you can cheat by clicking the ">>" button (fwd/next) button which navigates 1 step to the next best synonym along a *minimum cost path path towards the target*.  Repeatedly clicking ">>" will always take you to the target along the (or a) lowest cost path. Dijkstra's algorithm in action! Your running (cost, #cheats and  #jumps (navigations)) is tracked and comprise your compound game score. This is not to overemphasize the metrics, the idea here is to provide a semi-structured way of browsing through the work with a little playful competitiveness thrown in. 


To play - 
- Click on a term or type one in, click "Go" or hit "\<return\>"
- Use the "+/-" to zoom in/out and "<<" to go back.
- Start from your current location or navigate to the word/phrase you'd like to start.
- Type in the target and click the "Nav" button (for navigate) You will see additional info pop up
- Note the "Min Jumps/Cost" - this is the minimum cost to meet or beat* 
- Mouse over synynoms to see word/phrase frequencies
- Click on the best lowest cost synonyms you think will get you to the target
- Click on ">>" to cheat and be moved 1 synonym towards the target at the cost of 1 cheat and the cost of the word
- Click on "Clear" to exit game mode.

* It's actually sometimes possible to beat Dijkstra's altgoritm which is kind of cheeky. This is *as implemented* and wasn't planned, rather just a happy circumstance of combining the thesaurus with word frequencies and the way Dijkstra's works.

[Screencast from 2024-09-11 10-12-56.webm](https://github.com/user-attachments/assets/b022f348-5793-42c9-881f-3f6793020eee)

## Notes:
- Self contained ("static") React + Vite app, no server side component.
- Super alpha, plenty of warts. Out to the unwitting for demos/feedback.
- The UI in game mode is not intuitive ("cheats" exposed via the >> (forward) button), too many numbers, etc. It can definitely be improved.
- Obvious optimizations made but the thesaurus entries are read only plain text and likely 50% or more of ~20MB can be saved + a perf boost using formally concise data structures.
- Stand alone moby.js node console app serves as a CLI reference implementation of sorts and can be fiddled with. moby.py ditto is used to generate nodes.json and graph.json.
- The thesaurus contains terms that some people may find offensive.
- Not affiliated with the Moby Project, Project Guttenberg, Grady Ward or the LDS Church.

  










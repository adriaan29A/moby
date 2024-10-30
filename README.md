# The Moby Thesaurus
Game Edition (Now With Cheats!®)

## Introduction

The Moby Thesaurus is an eclectic and delightful compendium released into the public domain by Grady Ward in 1995 [(Wikipedia)](https://en.wikipedia.org/wiki/Moby_Project). This English version contains 30,260 root terms and 130,360* related synonyms and related sayings replete with Americana and oft amusing colloquialisms ranging from the antedeluvian through 1960s Hippiedom. I combined it with word frequencies from [Google's Trillion Word Corpus](https://research.google/blog/all-our-n-gram-are-belong-to-you/) with the vague idea of making a semantic word game. What I ended up with is a kind of a logophile's scavenger hunt with the goal of finding synonyms along paths between different entries. Along the way a simple method of incorporating the frequencies into the view fell out such that sets of synonyms (synsets) are displayed in a 2D "heat map word cloud" of hyperlinks colored and filtered by their respective frequencies. While originally intended with the game in mind it ends up being the main view by which the thesaurus is browsed.


Browse Mode

![Screenshot from 2024-10-30 08-05-44](https://github.com/user-attachments/assets/032f6c22-af36-4405-b3ed-4e556cfe0b02)

To browse the thesaurus:
- Click on a term or type one in, click &#128270; or hit "\<return\>"
- Use the "+/-" to zoom in/out and &#x276E; and &#x276F; to go back/next.
  
![Screenshot from 2024-10-30 07-07-36](https://github.com/user-attachments/assets/16e562fe-9e1d-4757-8e20-5aeaf311dcb1)

- Hover over a synonym to see it's cost (frequency) and # links (synonyms/related terms). These will become important when playing the game.
- The Zoom level filters on frequency. In the above, 500K means that all synonyms with a frequency of less than half a million are displayed.
- The  &#x1F3AE; button initiates Game Mode:

Game Mode

[Screencast from 2024-10-29 19-53-24.webm](https://github.com/user-attachments/assets/442e43c2-9ea7-4f5f-89bf-b140b786f433)

The object of the game is to find a path between two different terms through their shared synonyms. More commonplace synonyms (high frequency) cost the most, less popular ones cost less, with a range spanning 7 orders of magnitude. The path should consist of the least costly (i.e. rare) synonyms you can find. In practice, finding any path can be so challenging that an option is provided to help you along the way, ie cheat. When in game mode you can get an an "assist" by clicking &#x276F; (forward). This will navigate 1 step to the next best synonym along a *minimum cost path path towards the target* Repeatedly clicking &#x276F; will take you to the target along a lowest cost path. Dijkstra's algorithm in action! Your running scores (cost, #assists and  #jumps) are tracked and comprise your compound game score. I think the #assists figure is akin to a par score in golf if you squint hard enough. Not to overemphasize the metrics, the idea here is to provide a semi-structured way of browsing through the work with a little playful competitiveness thrown in. 


- Start from your current location or navigate to the word/phrase you'd like to start from.
- Type in the target and click the &#x1F3AE; button (for navigate) You will see additional info pop up


![Screenshot from 2024-10-30 07-20-12](https://github.com/user-attachments/assets/9dec0d09-8d3d-4f28-a2be-c70a76fdb418)

- Your navigation path is tracked from the starting point (origin) and displayed until you exit the game.
- Note the "Best To Target #s" - this is the minimum cost (and associated #jumps) to meet or beat**. These are updated on each navigation so that the minimum *cost* and  #jumps to the target is always displayed from wherever you are without divulging the path that gets you there.


![Screenshot from 2024-10-30 06-36-07](https://github.com/user-attachments/assets/3a983777-1ad0-42ad-9bb9-5f91722c8e7e)


- Click on the best (lowest cost, semantically closest)  synonyms you think will get you to the target
- Click on &#x276F; to get an assist and be moved 1 synonym towards the target at the cost of 1 assist and the synonym's cost (this button's action is overloaded from its simple navigation stack usage in Browse Mode).
- Click on &#x1f6d1; to exit the game.

\* The Wikipedia entry cites a figure of ~2.5 million related words and phrases.  I'm not entirely certain where that number comes from but might be referencing the Gutenbergu project as a whole.

\** It's actually possible to beat Dijkstra's altgorithm which is kind of cheeky. This is *as implemented* and wasn't planned, rather just a happy circumstance of combining the rich interconnectedness of the thesaurus with word frequencies and the way Dijkstra's algorithm works.


## Notes:
- Self contained ("static") React + Vite app. No network i/o after initial download. Will run offline if you don't close the browser/tab.
- Alpha code, plenty of warts. Out to the unwitting for demos/feedback.
- The UI in game mode is not intuitive ("Assists" exposed via the overlading &#x276F; (forward) button), too many #s maybe?
- Obvious optimizations made but the thesaurus entries are read only plain text and likely 50% or more of ~20MB can be saved + a perf boost using formally concise data structures for compressing both text and graph information.
- Stand alone moby.js node console app serves as a CLI reference implementation of sorts and can be fiddled with. moby.py ditto is used to generate nodes.json and graph.json.
- The thesaurus contains terms that some people may find offensive.
- Not affiliated with the Moby Project, Project Guttenberg, Grady Ward or the LDS Church.










# The Moby Thesaurus
Game Edition

## Introduction

The Moby Thesaurus is a delightful and eclectic compendium released into the public domain by Grady Ward in 1995 [Wikipedia](https://en.wikipedia.org/wiki/Moby_Project) and contains 30,260 root terms and over 2.5 million synoyms & related terms in English. I combined it with word frequencies from Google's Trillion Word Corpus to see what kind of word game I could come up wih. I ended up with a kind of a logophile's scavenger hunt with the goal of finding the rarest (least commonly occurring) synonyms lying on a path between two words. Along the way a simple and (sort of) natural way of browsing the thesaurus fell out in which synonym sets are displayed as color-coded "heat map word cloud" sets of hyperlinks filtered by frequency as controlled by zoom level.

The View

![Screenshot from 2024-09-04 10-27-50](https://github.com/user-attachments/assets/e99c6011-fcc1-4133-96ab-bb9f1a434072)

The object of the game is to find a path starting from your current location to a target/destination synonym chosen by you or an adversary. The ideal path consists of the "rarest" (low frequency) *shared* synonyms from where you started to the chosen target. It can be quite a challenge just to find any path let alone along only the rarest. That's why you can "cheat": If you're stumped as to which synonym to click on next,the >> button (forward) will take you to the next best synonym from wherever you are. The << (back) button takes you back and +/- to zoom in and out. Your score, should you even care, is comprised of 3 things - 1) The total cost (summed frequencies of all the synonyms you clcked on on your journey from the beginning to end), 2) total number of jumps and 3) the number of cheats you resorted to to get there). There's usually more than one path and it is possible to beat the machine HINT - pay attention to the absolute rarest of synonyms.

A Sample Game

[vilify to deify](https://github.com/user-attachments/assets/bfde92c3-4e6f-4b77-99fc-f33bc2ef84c8)


## Notes:
This is super alpha code
The UI in game mode sucks, is non-intuitive etc. I tried to boil it down to the minimum # controls needed to play the game, so things like the >> (forward) button is overloaded to mean "next best synonym" 











# The Moby Thesaurus
Game Edition

![Screenshot from 2024-08-26 18-35-00](https://github.com/user-attachments/assets/6ac8bf8a-cba2-4639-bf10-5234478660ea)
## Introduction

The Moby Thesaurus is a delightful and eclectic work released into the public domain by Grady Ward in 1995 (see Wikipedia articles and contains 30,260 root terms and phrases in English. I combined it with word frequencies from Google's Trillion Word Corpus to create a word game as an alternative to the way one normally uses a thesaurus, where finding paths between synonyms is the goal.

Synonyms are displayed as a "heat map word cloud" colored by raw word frequenies. These are also used to to provide a filtered view over the synonym sets, adding a "3rd" dimension in effect by simply redacting terms in an alphabetized paragraph: In the picture above the view at an "altitude" of 1 million, meaning you're seeing all synonyms with a word frequency count less than that. You can adjust the altitude to filter in more or less of the synonyms, and much of the game is played at the lowest levels (50k to 200k) 

The object of the game is to find a path starting from your current location to a target/destination synonym chosen by you or an adversary. The ideal path consists of the "rarest" (low frequency) *shared* synonyms from where you started to the chosen target. *It can be quite a challenge just to find any path let alone along only the rarest*. That's why there is the option to "cheat". The If you're stumped as to which synonym to click on you can click on the >> button (forward)) and moby will calculate then next best synonym for you and jump you to it from wherever you happen to be. Clicking << takes you back and +/- to zoom in and out. Your score, should you even care, is comprised of 3 things - 1) The total cost (summed frequencies of all the synonyms you clcked on on your journey from the beginning to end), 2) total number of jumps and 3) the number of cheats you resorted to to get there). There's usually more than one path, though none with a minimum cost of less than what is computed by the machine. Example of a game being played:


[Screencast from 2024-08-26 11-08-21.webm](https://github.com/user-attachments/assets/bfde92c3-4e6f-4b77-99fc-f33bc2ef84c8)









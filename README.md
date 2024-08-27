# Introduction

I think Wordle is actually more fun when you can cheat (just a little)! Use this CLI solver app when you play online, or play alone. It's also a great illustration of the application of Information Theory to play Wordle using a statistically optimal strategy. In the case of Wordle we want to maximize the amount of information that can be obtained from each guess by first computing the average expected value, also known as the Von Neumann entropy, for each word in the game's dictionary:

![wordle3](https://user-images.githubusercontent.com/88779001/210249127-dda88378-8f22-40a4-be2f-ec5208492b25.png)

A sorted list of word and entropy tuples is then used to play the game. See 3Blue1Brown's video [Solving Wordle Using Infformation Theory](https://youtu.be/v68zYyaEmEA) for an excellent in-depth discussion of how the algorithm works. 

It would be be boring if you cheated at every turn so don't! Play against a Wordle site and have a peek at the top guesses only when you're really stumped.  It's fun to see how far you can get without a 'cheat' and a relief to know you can when you want to. You can also play with different word sizes: 4-10 chars are supported.

# Example Usage

1) Play against an online site, manually entering the hints the site provides (b/g/y are mnemonics for black, green, yellow):

> wordle-sidekick

>? Play mode: m

>? Guess, hint: rates bybyb

...
![wordle0](https://user-images.githubusercontent.com/88779001/210251566-f1755de3-040e-4f8f-b59a-3552ed04357a.gif)

# DiceGameGoofed 

A browser-based dice game inspired by historical dice games dating back to the early 1600s.
This project recreates the experience of rolling physical dice using JavaScript and a 2D interface.

**Live Demo:**
https://michaelgalloway404.github.io/DiceGameGoofed/

---

# Overview

DiceGameGoofed is a turn-based browser game where players roll six dice and score points based on combinations. The goal is to reach **5000 points before your opponent**.

The project focuses on recreating the **logic and probability of real dice rolling** while presenting the game in a **2D graphical interface** using HTML Canvas and sprite graphics.

Players can choose between:

* **Two-player local mode**
* **Single-player mode vs an NPC**

---

# Historical Inspiration

Dice games similar to this one have existed for centuries. Variants of these games appeared as early as the **1600s** and have been known by many different names across cultures.

Modern versions are commonly recognized as games similar to **Farkle**, where players:

* Roll multiple dice
* Score based on combinations
* Decide whether to keep rolling or bank their points

This project recreates that style of gameplay in a web-based format.

---

# Gameplay Rules

The objective is to be the **first player to reach 5000 points**.

### Basic Scoring

| Combination | Points |
| ----------- | ------ |
| 1           | 100    |
| 5           | 50     |
| Three 2s    | 150    |
| Three 3s    | 225    |
| Three 4s    | 300    |
| Three 6s    | 450    |

### Special Combinations

| Combination                          | Points |
| ------------------------------------ | ------ |
| Three unique pairs (ex: 1,1 2,2 4,4) | 1500   |
| Straight (1,2,3,4,5,6)               | 2500   |

Players may roll multiple times per turn but risk losing their turn if they roll a combination that produces no score.

---

# Core Concept: Simulating Real Dice

One of the main goals of this project is to make the digital dice behave **logically identical to real physical dice**.

Although the dice appear visually as **2D images**, their values are determined using the same randomness principles as rolling physical dice.

### How Real Dice Work

A real six-sided die has:

* 6 possible outcomes
* Each outcome has equal probability
* Every roll is independent of previous rolls

Mathematically:

```
P(face) = 1 / 6
```

The digital dice in this game follow the same rule.

---

# How the Game Simulates Dice

When the player rolls, JavaScript generates a random integer between **1 and 6** for each die.

Example logic:

```javascript
Math.floor(Math.random() * 6) + 1
```

This produces a uniform distribution where each face has the same probability of appearing.

For six dice:

```
6 independent random values
range: 1–6
```

This creates the same statistical behavior as physically rolling six dice on a table.

---

# 2D Dice Representation

The dice faces are displayed using a **sprite sheet**.

Each die is represented as a square element that shows a different portion of the image depending on its value.

Example concept:

```
Dice Sprite Sheet
[1][2][3][4][5][6]
```

CSS `background-position` shifts the visible section of the sprite:

```
Die_1 → position 0px
Die_2 → position -50px
Die_3 → position -100px
Die_4 → position -150px
Die_5 → position -200px
Die_6 → position -250px
```

This approach allows the game to:

* Render dice quickly
* Avoid loading multiple images
* Keep visuals consistent

---

# Game Architecture

The project uses a simple front-end architecture built with:

### HTML

Provides the layout structure including:

* Score displays
* Game buttons
* Dice staging area
* Canvas for interaction

### CSS

Handles visual styling including:

* Dice sprite rendering
* UI layout
* Responsive design

### JavaScript

Controls all game logic:

* Dice rolling
* Score calculation
* Turn management
* Player vs NPC logic
* Canvas interaction

---

# Key Systems

## Dice Roll Engine

Generates six independent dice values and updates the visual representation.

Responsibilities:

* Random number generation
* Dice state tracking
* Rendering dice sprites

---

## Scoring System

Evaluates dice combinations after each roll.

The algorithm checks for:

* singles
* triples
* pairs
* straights
* special combinations

Points are accumulated in a **temporary turn score** until the player chooses to keep them.

---

## Turn System

The game alternates between players.

Turn logic handles:

* active player
* scoring accumulation
* ending turns
* determining victory

---

## NPC Player

In single-player mode the game includes a basic AI opponent.

The NPC:

* Rolls dice automatically
* Evaluates scoring opportunities
* Decides when to bank points

The AI mimics a human player's decision process.

---

# Technologies Used

* **HTML5**
* **CSS3**
* **JavaScript**
* **HTML Canvas**
* **Sprite-based rendering**

No external libraries or frameworks are used.

---

# What This Project Demonstrates

This project highlights several core programming concepts:

### Randomness Simulation

Recreating real-world probability using deterministic code.

### Game State Management

Tracking turns, scores, and dice states.

### Sprite-Based Rendering

Using image sheets to display multiple visual states efficiently.

### Event-Driven Programming

Handling user interaction through mouse events and button controls.

### Algorithmic Scoring Logic

Evaluating dice combinations dynamically.

---

# Future Improvements

Potential enhancements include:

* Dice roll animations
* Improved AI decision making
* Sound effects
* Mobile UI improvements
* Online multiplayer

---

# Author

Michael Galloway

GitHub:
https://github.com/MichaelGalloway404

---

# Play the Game

You can try the game here:

https://michaelgalloway404.github.io/DiceGameGoofed/

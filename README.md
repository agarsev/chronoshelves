Chronoshelves
=============
"Chronoshelves" is an interactive display and quizz of chronological data.

Time units are represented by named and colored drawers, which can be dragged
around. Time is represented (not to scale) as shelving, where shelves on top of
one another represent consecutive time periods. There can also be vertical
shelves to the left, which represent "macro" units, containing an arbitrary (and
possibly nested) number of subdivisions.

The drawers start in random positions outside the shelves, and the user has to
drag and drop them in the correct place. A score can then be computed, and
incorrectly placed drawers marked.

Live demo
---------
See live demos at:
- [https://garciasevilla.com/apps/chronoshelves](https://garciasevilla.com/apps/chronoshelves): the periods of Earth history.
- [https://garciasevilla.com/apps/chronoshelves/history](https://garciasevilla.com/apps/chronoshelves/history): an example alternative scale.

Usage
-----
To generate a different timescale, run make with the AGES parameter set to the
appropriate datafile:

    make AGES=history/history.yaml

Distribution
------------
The author of this application is Antonio F. G. Sevilla <antonio@garciasevilla.com>.

You can use and distribute the application under the terms of the GNU AGPL.

Contact
-------
If you want to use this app for your teaching, want help or advice generating a
different timescale, or have ideas for educational apps, feel free to contact me!

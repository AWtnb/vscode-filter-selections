# filter-selections README

This extension reduces the number of selections according to a regular expression or the position of the cursor. Useful when executed after <kbd>ctrl+shift+l</kbd>.

Selections that do not match the criteria are cleared, **but the cursor itself remains**. If you want to remove the cursor itself, use [awtnb.cursor-eraser](https://marketplace.visualstudio.com/items?itemName=awtnb.cursor-eraser).

## Features

### Unselect by regexp

+ `filter-selections.filter-inclusive`: Selections on lines that do not match the specified regular expression will be unselected.
+ `filter-selections.filter-exclusive`: Selection on lines that matches the specified regular expression will be unselected.

### Unselect by position

+ `filter-selections.filter-upward`: Unselect below the starting position of multi-cursor-mode.
+ `filter-selections.filter-downward`: Unselect above the starting position of multi-cursor-mode.

The starting point is the cursor position at the beginning of the multi-cursor mode.

### configuration

Case-sensitivity is configurable in `filter-selections.caseSensitive` of `setting.json`.




**Enjoy!**

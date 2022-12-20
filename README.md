# filter-selections README

Filter multi-cursor selections with regexp. Useful when executed after <kbd>ctrl+shift+l</kbd>.

## Features

+ `filter-selections.filter-upward`: Unselect below the starting position of multi-cursor-mode.
+ `filter-selections.filter-downward`: Unselect above the starting position of multi-cursor-mode.
+ `filter-selections.filter-inclusive`: Selections on lines that do not match the specified regular expression will be unselected.
+ `filter-selections.filter-exclusive`: Selection on lines that matches the specified regular expression will be unselected.

Case-sensitivity is configurable in `filter-selections.caseSensitive` of `setting.json`.

**Enjoy!**

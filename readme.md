# Token HUD Artwork Button
This module adds a button to the token or tile HUD that opens the target actor's artwork, or their token artwork on right-click. Hold the shift key to automatically show to everyone.

It also adds shortcut keybindings:
- Shift+Z: Show Tile/Token to everyone.
- Shift+X: Show token Actor's artwork to everyone.
- Add an Alt to either to show only yourself.
- Only the GM can show to everyone.

Additionally, it is now possible to show Video tiles, or any other .mp4 or .webm video using the new class `MultiMediaPopout` which has the same basic interface as `ImagePopout` (buit doens't support things like editing the image since this is for display purposes). This class can be used in a macro like so:

```js
new MultiMediaPopout("path/to/video.webm", { shareable: true })
	.render(true)
	.shareImage();
```

*Token buttons suggested by: [Apostol Apostolov](https://trello.com/apostolatwork/activity) on [League of Extraordinary FoundryVTT Developers](https://trello.com/c/dWLMm99A/29-show-monster-artwork-via-token)*

*Tile buttons and keybindings suggested by: akeran#7102 (Discord)*
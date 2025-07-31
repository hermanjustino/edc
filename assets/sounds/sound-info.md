# Sound Effects

## Required Files
Place these audio files in the `/assets/sounds/` directory:

### correct.mp3
- **Usage**: Plays when user answers correctly
- **Volume**: 0.6 (60%)
- **Recommended**: Short, pleasant chime or success sound (1-2 seconds)
- **Format**: MP3 for broad browser compatibility

### incorrect.mp3
- **Usage**: Plays when user answers incorrectly  
- **Volume**: 0.5 (50%)
- **Recommended**: Gentle buzz or error sound (1-2 seconds)
- **Format**: MP3 for broad browser compatibility

## Implementation Notes
- Sounds are preloaded for better performance
- Volume levels are pre-set to avoid being too loud
- Error handling prevents crashes if sound files are missing
- Browser autoplay policies are handled gracefully
- Sounds reset to beginning each time they play

## File Size Recommendations
- Keep files under 100KB each for fast loading
- Use compressed MP3 format
- Mono audio is sufficient for simple sound effects

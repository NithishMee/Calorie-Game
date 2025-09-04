# 🎮 Game Demo Instructions

## 🚀 How to Run the Game

### Option 1: Web Browser (Easiest)
1. Make sure the project is running: `npm start`
2. Press `w` in the terminal to open in web browser
3. The game will load in your browser

### Option 2: Mobile Device
1. Install Expo Go app on your phone
2. Scan the QR code from the terminal
3. The game will load on your device

### Option 3: Android Emulator
1. Start Android Studio emulator
2. Press `a` in the terminal to run on Android

## 🎯 What You Should See

### 1. Home Screen
- 🥗 "Healthy Food Catch" title
- Instructions on how to play
- "Start Game" button
- Preview of foods (healthy vs unhealthy)

### 2. Game Screen
- Beautiful gradient background (sky blue to green)
- Score and timer at the top
- Bowl at the bottom (🥣 emoji)
- Foods falling from the top
- Touch controls (left/right arrows)

### 3. Results Screen
- Final score display
- Foods you caught
- Health analysis and tips
- Option to play again

## 🎮 Game Controls

- **Touch Controls**: Use left/right arrow buttons
- **Swipe**: Swipe left/right on the screen
- **Drag**: Touch and drag to move the bowl

## 🍎 Game Mechanics

- **Healthy Foods** (+10 points): 🍎 🍌 🥕 🥦 🥬 🍊 🍓 🍅 🥒 🫑
- **Unhealthy Foods** (-15 points): 🍔 🍕 🍟 🍦 🍫 🥤 🍩 🍬 🌭 🥔
- **Game Duration**: 60 seconds
- **Goal**: Catch healthy foods, avoid unhealthy ones

## 🔧 Troubleshooting

If you encounter issues:

1. **Metro bundler errors**: Press `r` to reload
2. **Performance issues**: Close other apps
3. **Touch not working**: Try refreshing the page/app
4. **Database errors**: The game will still work without database

## 📱 Expected Behavior

✅ **Working Features**:
- Smooth food falling animation
- Touch controls responsive
- Score calculation
- Timer countdown
- Navigation between screens
- Beautiful UI with gradients

⚠️ **Known Limitations**:
- SQLite database only works on mobile devices
- Haptic feedback only works on mobile devices
- Some animations may be slower on web

## 🎉 Success Indicators

The game is working correctly if you can:
1. Navigate from Home → Game → Results
2. Move the bowl left and right
3. See foods falling from the top
4. Catch foods and see score change
5. Complete a 60-second game round
6. View results with caught foods

---

**Enjoy your healthy food catching adventure! 🥗🎮**

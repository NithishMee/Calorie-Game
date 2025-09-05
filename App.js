import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BOWL_WIDTH = 120;
const BOWL_HEIGHT = 100;
const FOOD_SIZE = 40;
const COLUMNS = 6;
const COLUMN_WIDTH = width / COLUMNS;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute
  const [gameActive, setGameActive] = useState(false);
  const [bowlPosition, setBowlPosition] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [foods, setFoods] = useState([]);
  const [caughtFoods, setCaughtFoods] = useState([]);
  const [lastScoreChange, setLastScoreChange] = useState(0);
  
  const gameTimerRef = useRef(null);
  const foodSpawnTimerRef = useRef(null);
  const heartbeatAnim = useRef(new Animated.Value(1)).current;

  // Heartbeat animation effect
  useEffect(() => {
    const heartbeat = () => {
      Animated.sequence([
        Animated.timing(heartbeatAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(heartbeat, 1000);
      });
    };
    
    if (currentScreen === 'home') {
      heartbeat();
    }
  }, [currentScreen, heartbeatAnim]);

  // Food types - Expanded variety
  const foodTypes = [
    // Healthy foods - Fruits
    { name: 'Apple', emoji: '🍎', isHealthy: true, points: 10, calories: 52 },
    { name: 'Banana', emoji: '🍌', isHealthy: true, points: 10, calories: 89 },
    { name: 'Orange', emoji: '🍊', isHealthy: true, points: 10, calories: 47 },
    { name: 'Strawberry', emoji: '🍓', isHealthy: true, points: 10, calories: 32 },
    { name: 'Grapes', emoji: '🍇', isHealthy: true, points: 10, calories: 62 },
    { name: 'Watermelon', emoji: '🍉', isHealthy: true, points: 10, calories: 30 },
    { name: 'Pineapple', emoji: '🍍', isHealthy: true, points: 10, calories: 50 },
    { name: 'Peach', emoji: '🍑', isHealthy: true, points: 10, calories: 39 },
    { name: 'Kiwi', emoji: '🥝', isHealthy: true, points: 10, calories: 61 },
    { name: 'Mango', emoji: '🥭', isHealthy: true, points: 10, calories: 60 },
    
    // Healthy foods - Vegetables
    { name: 'Carrot', emoji: '🥕', isHealthy: true, points: 10, calories: 41 },
    { name: 'Broccoli', emoji: '🥦', isHealthy: true, points: 10, calories: 34 },
    { name: 'Spinach', emoji: '🥬', isHealthy: true, points: 10, calories: 23 },
    { name: 'Tomato', emoji: '🍅', isHealthy: true, points: 10, calories: 18 },
    { name: 'Cucumber', emoji: '🥒', isHealthy: true, points: 10, calories: 16 },
    { name: 'Bell Pepper', emoji: '🫑', isHealthy: true, points: 10, calories: 31 },
    { name: 'Corn', emoji: '🌽', isHealthy: true, points: 10, calories: 86 },
    { name: 'Eggplant', emoji: '🍆', isHealthy: true, points: 10, calories: 25 },
    { name: 'Avocado', emoji: '🥑', isHealthy: true, points: 10, calories: 160 },
    { name: 'Potato', emoji: '🥔', isHealthy: true, points: 10, calories: 77 },
    
    // Healthy foods - Nuts & Seeds
    { name: 'Peanuts', emoji: '🥜', isHealthy: true, points: 10, calories: 567 },
    { name: 'Coconut', emoji: '🥥', isHealthy: true, points: 10, calories: 354 },
    
    // Unhealthy foods - Fast Food
    { name: 'Hamburger', emoji: '🍔', isHealthy: false, points: -15, calories: 354 },
    { name: 'Pizza', emoji: '🍕', isHealthy: false, points: -15, calories: 266 },
    { name: 'French Fries', emoji: '🍟', isHealthy: false, points: -15, calories: 365 },
    { name: 'Hot Dog', emoji: '🌭', isHealthy: false, points: -15, calories: 290 },
    { name: 'Taco', emoji: '🌮', isHealthy: false, points: -15, calories: 226 },
    { name: 'Burrito', emoji: '🌯', isHealthy: false, points: -15, calories: 326 },
    { name: 'Sandwich', emoji: '🥪', isHealthy: false, points: -15, calories: 250 },
    
    // Unhealthy foods - Desserts & Sweets
    { name: 'Ice Cream', emoji: '🍦', isHealthy: false, points: -15, calories: 207 },
    { name: 'Chocolate', emoji: '🍫', isHealthy: false, points: -15, calories: 546 },
    { name: 'Donut', emoji: '🍩', isHealthy: false, points: -15, calories: 452 },
    { name: 'Cookie', emoji: '🍪', isHealthy: false, points: -15, calories: 502 },
    { name: 'Cake', emoji: '🍰', isHealthy: false, points: -15, calories: 257 },
    { name: 'Pie', emoji: '🥧', isHealthy: false, points: -15, calories: 237 },
    { name: 'Candy', emoji: '🍬', isHealthy: false, points: -15, calories: 394 },
    { name: 'Lollipop', emoji: '🍭', isHealthy: false, points: -15, calories: 408 },
    
    // Unhealthy foods - Drinks & Snacks
    { name: 'Soda', emoji: '🥤', isHealthy: false, points: -15, calories: 139 },
    { name: 'Beer', emoji: '🍺', isHealthy: false, points: -15, calories: 154 },
    { name: 'Popcorn', emoji: '🍿', isHealthy: false, points: -15, calories: 375 },
    { name: 'Chips', emoji: '🥨', isHealthy: false, points: -15, calories: 536 },
  ];

  const startGame = () => {
    
    // Clear any existing timers first
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (foodSpawnTimerRef.current) {
      clearInterval(foodSpawnTimerRef.current);
      foodSpawnTimerRef.current = null;
    }
    
    setCurrentScreen('game');
    setScore(0);
    setTimeLeft(60); // 2 minutes
    setFoods([]);
    setCaughtFoods([]);
    setGameActive(true);
  };

  const spawnFood = () => {
    if (!gameActive) return;
    
    const randomFood = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    const column = Math.floor(Math.random() * COLUMNS);
    const newFood = {
      id: Date.now() + Math.random(),
      ...randomFood,
      x: column * COLUMN_WIDTH + (COLUMN_WIDTH - FOOD_SIZE) / 2, // Center in column
      y: -FOOD_SIZE,
      speed: 3.5 + Math.random() * 3, // Slightly reduced speed for better control
    };
    

    setFoods(prev => [...prev, newFood]);
  };

  // Game loop effect
  useEffect(() => {
    if (!gameActive) return;

    // Clear any existing timers first
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (foodSpawnTimerRef.current) clearInterval(foodSpawnTimerRef.current);

    // Start spawning food immediately and then every 1.5 seconds (faster pace)
    spawnFood();
    foodSpawnTimerRef.current = setInterval(spawnFood, 1500);

    // Start game timer - this should count down properly
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Game loop for moving foods
    const gameLoop = setInterval(() => {
      setFoods(prevFoods => {
        const updatedFoods = prevFoods.map(food => ({
          ...food,
          y: food.y + food.speed,
        }));

        // Check for collisions and missed foods
        const foodsToRemove = [];
        updatedFoods.forEach((food, index) => {
          // Direct collision check - food in same column and touching bowl
          const foodColumn = Math.floor(food.x / COLUMN_WIDTH);
          const isInSameColumn = foodColumn === currentColumn;
          const bowlTop = height - BOWL_HEIGHT;
          const isTouchingBowl = food.y + FOOD_SIZE >= bowlTop && food.y < height;
          
          if (isInSameColumn && isTouchingBowl) {
            catchFood(food);
            foodsToRemove.push(index);
          } else if (food.y >= height) {
            foodsToRemove.push(index);
          }
        });

        // Remove caught and missed foods
        return updatedFoods.filter((food, index) => !foodsToRemove.includes(index));
      });
    }, 16); // Update every 16ms (~60fps) for ultra-smooth movement

    return () => {
      clearInterval(gameLoop);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (foodSpawnTimerRef.current) clearInterval(foodSpawnTimerRef.current);
    };
  }, [gameActive, currentColumn]); // Include currentColumn so collision detection updates

  const isColliding = (food) => {
    // Check if food is in the same column as bowl
    const foodColumn = Math.floor(food.x / COLUMN_WIDTH);
    const isInSameColumn = foodColumn === currentColumn;
    
    // Simple collision: food bottom reaches the bowl area
    const bowlTop = height - BOWL_HEIGHT;
    const isTouchingBowl = food.y + FOOD_SIZE >= bowlTop;
    
    return isInSameColumn && isTouchingBowl;
  };

  const catchFood = (food) => {
    setScore(prev => prev + food.points);
    setCaughtFoods(prev => [...prev, food]);
    setLastScoreChange(food.points);
    
    // Clear the score change indicator after 1 second
    setTimeout(() => setLastScoreChange(0), 1000);
  };

  const moveBowl = (direction) => {
    if (direction === 'left') {
      setCurrentColumn(prev => Math.max(0, prev - 1));
    } else {
      setCurrentColumn(prev => Math.min(COLUMNS - 1, prev + 1));
    }
  };

  const endGame = () => {
    setGameActive(false);
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (foodSpawnTimerRef.current) {
      clearInterval(foodSpawnTimerRef.current);
      foodSpawnTimerRef.current = null;
    }
    setCurrentScreen('results');
  };

  const goHome = () => {
    setCurrentScreen('home');
  };

  const playAgain = () => {
    startGame();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (foodSpawnTimerRef.current) clearInterval(foodSpawnTimerRef.current);
    };
  }, []);

  // Render Home Screen
  if (currentScreen === 'home') {
    return (
      <LinearGradient
        colors={['#fceabb', '#f8b500']}
        style={styles.homeContainer}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Healthy Bites</Text>
        </View>
        
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionHeader}>
            <Text style={styles.instructionsTitle}>How to Play</Text>
          </View>
          <View style={styles.instructionGrid}>
            <TouchableOpacity style={styles.instructionCard} activeOpacity={0.7}>
              <View style={styles.instructionIconContainer}>
                <View style={styles.instructionIcon}>
                  <Text style={styles.instructionIconText}>✓</Text>
                </View>
              </View>
              <Text style={styles.instructionText}>Catch healthy foods</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.instructionCard} activeOpacity={0.7}>
              <View style={styles.instructionIconContainer}>
                <View style={styles.instructionIcon}>
                  <Text style={styles.instructionIconText}>✗</Text>
                </View>
              </View>
              <Text style={styles.instructionText}>Avoid junk food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.instructionCard} activeOpacity={0.7}>
              <View style={styles.instructionIconContainer}>
                <View style={styles.instructionIcon}>
                  <Text style={styles.instructionIconText}>⟷</Text>
                </View>
              </View>
              <Text style={styles.instructionText}>Tap to move bowl</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.instructionCard} activeOpacity={0.7}>
              <View style={styles.instructionIconContainer}>
                <View style={styles.instructionIcon}>
                  <Text style={styles.instructionIconText}>60</Text>
                </View>
              </View>
              <Text style={styles.instructionText}>Seconds to play</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.startButtonContainer, { transform: [{ scale: heartbeatAnim }] }]}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <View style={styles.startButtonGradient}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
  }

  // Render Game Screen
  if (currentScreen === 'game') {
    return (
      <LinearGradient
        colors={['#fceabb', '#f8b500']}
        style={styles.gameContainer}
      >
        {/* Game UI */}
        <View style={styles.gameUI}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            {lastScoreChange !== 0 && (
              <Text style={[
                styles.scoreChange,
                { color: lastScoreChange > 0 ? '#4CAF50' : '#F44336' }
              ]}>
                {lastScoreChange > 0 ? '+' : ''}{lastScoreChange}
              </Text>
            )}
            <Text style={styles.timeText}>Time: {timeLeft}s</Text>
          </View>
        </View>

        {/* Game Area */}
        <View style={styles.gameArea}>
          {/* Column Lines */}
          {Array.from({ length: COLUMNS - 1 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.columnLine,
                { left: (i + 1) * COLUMN_WIDTH }
              ]}
            />
          ))}
          
          {/* Falling Foods */}
          {foods.map(food => (
            <View
              key={food.id}
              style={[
                styles.food,
                {
                  left: food.x,
                  top: food.y,
                },
              ]}
            >
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
            </View>
          ))}

          {/* Bowl */}
          <View
            style={[
              styles.bowl,
              {
                left: currentColumn * COLUMN_WIDTH,
              },
            ]}
          >
            <View style={styles.bowlInner}>
              <Text style={styles.bowlEmoji}>🥣</Text>
            </View>
          </View>
        </View>

        {/* Touch Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => moveBowl('left')}
          >
            <View style={styles.controlButtonInner}>
              <Text style={styles.controlText}>←</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => moveBowl('right')}
          >
            <View style={styles.controlButtonInner}>
              <Text style={styles.controlText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>


      </LinearGradient>
    );
  }

  // Render Results Screen
  if (currentScreen === 'results') {
    const healthyCount = caughtFoods.filter(f => f.isHealthy).length;
    const unhealthyCount = caughtFoods.filter(f => !f.isHealthy).length;
    const totalCalories = caughtFoods.reduce((total, food) => total + food.calories, 0);

    return (
      <LinearGradient
        colors={['#fceabb', '#f8b500']}
        style={styles.resultsContainer}
      >
        <Text style={styles.resultsTitle}>Game Results</Text>
        
        <View style={styles.scoreCard}>
          <Text style={styles.finalScore}>{score}</Text>
          <Text style={styles.scoreLabel}>Final Score</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{healthyCount}</Text>
            <Text style={styles.statLabel}>Healthy Foods</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{unhealthyCount}</Text>
            <Text style={styles.statLabel}>Unhealthy Foods</Text>
          </View>
        </View>

        <Text style={styles.caloriesText}>Total Calories: {totalCalories} kcal</Text>

        <ScrollView style={styles.foodsSection} showsVerticalScrollIndicator={true}>
          <Text style={styles.sectionTitle}>Foods You Caught:</Text>
          {caughtFoods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCalories}>{food.calories} kcal</Text>
              <View style={[
                styles.healthIndicator,
                { backgroundColor: food.isHealthy ? '#4CAF50' : '#F44336' }
              ]}>
                <Text style={styles.healthText}>
                  {food.isHealthy ? 'Healthy' : 'Unhealthy'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.playAgainButton} onPress={playAgain}>
            <View style={styles.playAgainButtonInner}>
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} onPress={goHome}>
            <View style={styles.homeButtonInner}>
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  // Home Screen Styles
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#f8b500',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
    letterSpacing: 1,
    padding: 10,
    borderWidth: 3,
    borderColor: '#f8b500',
    borderRadius: 20,
    backgroundColor: 'rgba(248, 181, 0, 0.3)',
  },
  instructionsContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 25,
    marginBottom: 30,
    width: width - 40,
    borderWidth: 3,
    borderColor: '#f8b500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  instructionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8b500',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  instructionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  instructionCard: {
    width: '48%',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 15,
    borderWidth: 2,
    borderColor: '#f8b500',
    borderRadius: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  instructionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8b500',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  instructionIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 5,
  },
  startButtonContainer: {
    marginBottom: 20,
  },
  startButton: {
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  startButtonGradient: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#f8b500',
  },
  startButtonText: {
    color: '#f8b500',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Game Screen Styles
  gameContainer: {
    flex: 1,
  },
  gameUI: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreText: {
    fontSize: 24,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreChange: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  timeText: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  columnLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
  },
  food: {
    position: 'absolute',
    width: FOOD_SIZE + 10,
    height: FOOD_SIZE + 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  foodEmoji: {
    fontSize: 28,
  },
  bowl: {
    position: 'absolute',
    bottom: 0,
    width: COLUMN_WIDTH,
    height: BOWL_HEIGHT,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bowlInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bowlEmoji: {
    fontSize: 50,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  controlButton: {
    backgroundColor: '#ff6b6b',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  debugInfo: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },

  // Results Screen Styles
  resultsContainer: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 36,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    minWidth: 200,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 120,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  caloriesText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  foodsSection: {
    width: '100%',
    marginBottom: 20,
    maxHeight: 300,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  foodItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  foodCalories: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  healthIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  healthText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonSection: {
    alignItems: 'center',
    width: '100%',
  },
  playAgainButton: {
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  playAgainButtonInner: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#f8b500',
  },
  playAgainButtonText: {
    color: '#f8b500',
    fontSize: 18,
    fontWeight: '600',
  },
  homeButton: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  homeButtonInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  homeButtonText: {
    color: '#8B4513',
    fontSize: 18,
    fontWeight: '600',
  },
});

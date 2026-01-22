import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  BASE_POSITIONS,
  COORDINATES_MAP,
  HOME_ENTRANCE,
  HOME_POSITIONS,
  SAFE_POSITIONS,
  START_POSITIONS,
  STATE,
  STEP_LENGTH,
  TURNING_POINTS,
} from '../engine/constants';

import { router, useLocalSearchParams } from 'expo-router';
import Header from '../ui/Header';

/* ---------------- CONFIG ---------------- */

const ALL_PLAYERS: any = ['P1', 'P3', 'P2', 'P4'];


const PIECE_IMAGES: any = {
  P1: require('../../assets/pieces/blue.png'),
  P3: require('../../assets/pieces/green.png'),
  P2: require('../../assets/pieces/yellow.png'),
  P4: require('../../assets/pieces/red.png'),
};

const DICE_IMAGES: any = {
  1: require('../../assets/dice/1.png'),
  2: require('../../assets/dice/2.png'),
  3: require('../../assets/dice/3.png'),
  4: require('../../assets/dice/4.png'),
  5: require('../../assets/dice/5.png'),
  6: require('../../assets/dice/6.png'),
};

const GAME_MODE = {
  BOT: 'BOT',
  FRIEND: 'FRIEND',
};

const PLAYER_NAMES = ['Alex', 'John', 'Emma', 'Mia', 'Liam'];
const BOT_NAMES = ['Robo', 'Neo', 'BotX', 'AI Max'];

const randomPlayerName = () =>
  PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];

const randomBotName = () =>
  BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];

/* ---------------- LAYOUT ---------------- */

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width, height) - 20;
const PIECE_SIZE = 22;

const PIN_OFFSET = {
  x: PIECE_SIZE * 0.05,
  y: PIECE_SIZE * 0.25,
};


/* ---------------- COMPONENT ---------------- */

export default function GameScreen() {
  /* ---------- FLOW STATE ---------- */
  const { mode, pc, playerName } = useLocalSearchParams<{
    mode: 'bot' | 'friend';
    pc: any;
    playerName: any
  }>();

  const [gameMode, setGameMode] = useState<any>(mode || null);
  const [playerCount, setPlayerCount] = useState<any>(pc || 2);

  /* ---------- GAME STATE ---------- */
  const [players, setPlayers] = useState([]);
  const [botPlayers, setBotPlayers] = useState<string[]>([]);
  const [playerNames, setPlayerNames] = useState({});

  const [currentPositions, setCurrentPositions] = useState<any>({});
  const [turn, setTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [state, setState] = useState(STATE.DICE_NOT_ROLLED);
  const [highlighted, setHighlighted] = useState<any>({ player: null, pieces: [] });
  const [isMoving, setIsMoving] = useState(false);

  const [winner, setWinner] = useState<string | null>('');
  const [showWinner, setShowWinner] = useState(false);

  const animatedPositions: any = useRef(
    Object.fromEntries(
      ALL_PLAYERS.map((p: any) => [p, [0, 1, 2, 3].map(() => new Animated.ValueXY())])
    )
  ).current;

  /* ⭐ HOME BLINK ANIMATION */
  const homeScale: any = useRef(
    Object.fromEntries(ALL_PLAYERS.map((p: any) => [p, new Animated.Value(1)]))
  ).current;

  /* ⭐ PIECE PULSE */
  const pulse: any = useRef(
    Object.fromEntries(
      ALL_PLAYERS.map((p: any) => [p, [0, 1, 2, 3].map(() => new Animated.Value(1))])
    )
  ).current;

  /* ⭐ KILL SCALE */
  const killScale: any = useRef(
    Object.fromEntries(
      ALL_PLAYERS.map((p: any) => [p, [0, 1, 2, 3].map(() => new Animated.Value(1))])
    )
  ).current;

  // ⭐ DICE ANIMATION
  const diceScale = useRef(new Animated.Value(1)).current;
  const diceRotate = useRef(new Animated.Value(0)).current;
  const [diceFace, setDiceFace] = useState(1);
  const rotateInterpolate = diceRotate.interpolate({
    inputRange: [0, 3],
    outputRange: ['0deg', '1440deg'],
  });

  /* ---------- HELPERS ---------- */

  const pixel = (pos: any) => {
    const coord = COORDINATES_MAP[pos];
    if (!coord) {
      console.warn('Missing COORDINATE for pos:', pos);
      return { x: 0, y: 0 }; // fail-safe
    }

    const [x, y] = coord;
    return {
      x: (x * STEP_LENGTH * BOARD_SIZE) / 100,
      y: (y * STEP_LENGTH * BOARD_SIZE) / 100,
    };
  };

  useEffect(() => {
    if (state !== STATE.DICE_ROLLED) return;

    const player: any = players[turn] || '';
    if (!botPlayers.includes(player)) return;
    if (!highlighted.pieces.length) return;

    // Small delay to feel natural
    const t = setTimeout(() => {
      const piece =
        highlighted.pieces[Math.floor(Math.random() * highlighted.pieces.length)];
      movePiece(player, piece);
    }, 700);

    return () => clearTimeout(t);
  }, [highlighted, state]);


  /* ---------- SETUP GAME ---------- */

  useEffect(() => {
    const active = ALL_PLAYERS.slice(0, playerCount);
    setPlayers(active);

    const names: any = {};
    active.forEach((p: any, i: any) => {
      if (p == 'P1') {
        names[p] = playerName;
      } else {
        names[p] =
          gameMode === GAME_MODE.BOT && i > 0
            ? randomBotName() || `Bot ${i}`
            : randomPlayerName() || `Player ${i + 1}`;
      }
    });

    setPlayerNames(names);
    setBotPlayers(gameMode === GAME_MODE.BOT ? active.slice(1) : []);
  }, []);

  useEffect(() => {
    if (!players.length) return;

    const positions: any = {};
    players.forEach((p) => (positions[p] = [...BASE_POSITIONS[p]]));
    setCurrentPositions(positions);

    players.forEach((p) =>
      BASE_POSITIONS[p].forEach((pos: any, i: any) =>
        animatedPositions[p][i].setValue(pixel(pos))
      )
    );
  }, [players]);

  /* ⭐ HOME BLINK EFFECT */
  useEffect(() => {
    const active = players[turn];
    if (!active) return;

    console.log(active, "active")

    ALL_PLAYERS.forEach((p: any) => {
      homeScale[p].stopAnimation();
      homeScale[p].setValue(1);
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(homeScale[active], {
          toValue: 1.02,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(homeScale[active], {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [turn, players]);

  /* ⭐ PIECE PULSE EFFECT */
  useEffect(() => {
    ALL_PLAYERS.forEach((p: any) =>
      pulse[p].forEach((a: any) => {
        a.stopAnimation();
        a.setValue(1);
      })
    );

    if (!highlighted.player) return;

    highlighted.pieces.forEach((i: any) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse[highlighted.player][i], {
            toValue: 1.3,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(pulse[highlighted.player][i], {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, [highlighted]);

  /* ---------- BOT TURN ---------- */

  useEffect(() => {
    const currentPlayer = players[turn];
    if (
      botPlayers.includes(currentPlayer) &&
      state === STATE.DICE_NOT_ROLLED &&
      !isMoving
    ) {
      setTimeout(rollDice, 700);
    }
  }, [turn, state]);

  /* ---------- DICE ---------- */

  const diceAnim = useRef(new Animated.Value(1)).current;

  const rollDice = () => {
    // if (state !== STATE.DICE_NOT_ROLLED || isMoving) return;

    // const v = Math.floor(Math.random() * 6) + 1;
    // setDiceValue(v);
    // setState(STATE.DICE_ROLLED);

    // Animated.sequence([
    //   Animated.timing(diceAnim, { toValue: 1.4, duration: 200, useNativeDriver: false }),
    //   Animated.timing(diceAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
    // ]).start();

    // findEligible(v);
    if (state !== STATE.DICE_NOT_ROLLED || isMoving) return;

    setState(STATE.ROLLING_DICE);

    diceRotate.setValue(0);
    diceScale.setValue(1);

    let frame = 0;
    const faceTimer = setInterval(() => {
      frame++;
      setDiceFace((frame % 6) + 1);
    }, 90);

    Animated.parallel([
      // 🔄 smooth continuous spin
      Animated.timing(diceRotate, {
        toValue: 4,               // 3 full rotations
        duration: 1600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),

      // 🔍 natural scale bounce
      Animated.sequence([
        Animated.timing(diceScale, {
          toValue: 1.18,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(diceScale, {
          toValue: 1,
          duration: 1100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      clearInterval(faceTimer);

      const finalValue: any = Math.floor(Math.random() * 6) + 1;
      setDiceFace(finalValue);
      setDiceValue(finalValue);
      setState(STATE.DICE_ROLLED);

      diceRotate.setValue(0);
      findEligible(finalValue);
    });
  };

  const findEligible = (dice: any) => {
    const player = players[turn];

    const pieces = [0, 1, 2, 3].filter((i) => {
      const pos = currentPositions[player][i];
      if (pos === HOME_POSITIONS[player]) return false;
      if (BASE_POSITIONS[player].includes(pos) && dice !== 6) return false;
      if (HOME_ENTRANCE[player].includes(pos) && dice > HOME_POSITIONS[player] - pos)
        return false;
      return true;
    });

    pieces.length
      ? setHighlighted({ player, pieces })
      : nextTurn();
  };

  /* ---------- MOVE ---------- */

  const movePiece = async (player: any, piece: any) => {
    if (isMoving) return;
    setIsMoving(true);
    setHighlighted({ player: null, pieces: [] });

    let pos = currentPositions[player][piece];
    let path = [];

    if (BASE_POSITIONS[player].includes(pos)) {
      path.push(START_POSITIONS[player]);
    } else {
      let steps: any = diceValue;
      while (steps--) {
        pos =
          pos === TURNING_POINTS[player]
            ? HOME_ENTRANCE[player][0]
            : pos === 51
              ? 0
              : pos + 1;
        path.push(pos);
      }
    }

    for (const p of path) {
      await Animated.timing(animatedPositions[player][piece], {
        toValue: pixel(p),
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    finishMove(player, piece, path[path.length - 1]);
  };


  const finishMove = (player: any, piece: any, finalPos: any) => {
    let killed = false;

    const updated = { ...currentPositions };
    updated[player][piece] = finalPos;

    players.forEach((op) => {
      if (op === player) return;
      updated[op] = updated[op].map((p: any, i: any) => {
        if (p === finalPos && !SAFE_POSITIONS.includes(p)) {
          killed = true;

          Animated.sequence([
            Animated.timing(killScale[op][i], {
              toValue: 0,
              duration: 150,
              useNativeDriver: false,
            }),
            Animated.timing(animatedPositions[op][i], {
              toValue: pixel(BASE_POSITIONS[op][i]),
              duration: 1,
              useNativeDriver: false,
            }),
            Animated.timing(killScale[op][i], {
              toValue: 1,
              duration: 150,
              useNativeDriver: false,
            }),
          ]).start();

          // animatedPositions[op][i].setValue(pixel(BASE_POSITIONS[op][i]));
          return BASE_POSITIONS[op][i];
        }
        return p;
      });
    });

    setCurrentPositions(updated);
    setIsMoving(false);

    // 🏆 WIN CHECK (ADD THIS)
    console.log("finalPos", finalPos);
    console.log("PLAYER POSITION :>", HOME_POSITIONS[player]);
    console.log("updated :>", updated);

    if (finalPos === HOME_POSITIONS[player]) {
      //triggerWin(player);
      console.log("🎉 WINNER SINGLE POINT...");
      pulse[player][piece].stopAnimation();
      pulse[player][piece].setValue(1);

      killScale[player][piece].stopAnimation();
      killScale[player][piece].setValue(1);
    }

    if (updated[player].every((pos: any) => pos === HOME_POSITIONS[player])) {
      console.log("🎉 🎉 🎉 ... WINNER PLAYER ... 🎉 🎉 🎉");
      setWinner(player);
      setShowWinner(true);
      setIsMoving(false);
      return;
    }


    killed || diceValue === 6 ? setState(STATE.DICE_NOT_ROLLED) : nextTurn();
  };

  const nextTurn = () => {
    setTurn((t) => (t + 1) % players.length);
    setState(STATE.DICE_NOT_ROLLED);
  };

  const triggerWin = (player: any) => {
    console.log("🎉 WINNER -- WINNER -- WINNER -- WINNER -- WINNER 🎉", player, "🎉 WINNER -- WINNER -- WINNER -- WINNER -- WINNER 🎉");
  }


  if (players.some((p) => !currentPositions[p])) {
    return null;
  }

  const goHome = () => {
    setShowWinner(false);
    router.replace('/');
  };
  /* ---------- GAME UI ---------- */

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <Header />
      <View style={styles.container}>
        <Text style={styles.turnText}>
          Turn: <Text style={styles.playerName}>{playerNames[players[turn]]}</Text>
        </Text>

        <View style={styles.boardShadow}>
          <ImageBackground source={require('../../assets/ludo-bg.jpg')} style={styles.board}>
            {players.map((p) => (
              <Animated.View
                key={`home-${p}`}
                style={[styles.home, styles[p], { transform: [{ scale: homeScale[p] }] }]}
              >
                <Text style={styles.homeLabel}>{playerNames[p]}</Text>
              </Animated.View>
            ))}

            {players.map((p) =>
              currentPositions[p].map((_: any, i: any) => {
                const isAtHome =
                  currentPositions[p][i] === HOME_POSITIONS[p];

                const selectable =
                  highlighted.player === p && highlighted.pieces.includes(i) &&
                  !isAtHome;

                return (
                  <Animated.View
                    key={p + i}
                    style={[
                      styles.piece,
                      {
                        position: 'absolute',
                        zIndex: 50,                 // 🔥 important
                        elevation: 50,              // 🔥 android
                        transform: [
                          ...animatedPositions[p][i].getTranslateTransform(),
                          { translateX: -PIN_OFFSET.x },
                          { translateY: -PIN_OFFSET.y },
                          { scale: Animated.multiply(pulse[p][i], killScale[p][i]) },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={!selectable || isMoving || currentPositions[p][i] === HOME_POSITIONS[p]}
                      onPress={() => movePiece(p, i)}
                      style={{ width: PIECE_SIZE, height: PIECE_SIZE }}
                    >
                      <Image
                        source={PIECE_IMAGES[p]}
                        style={styles.pieceImage}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                  // <TouchableOpacity
                  //   key={p + i}
                  //   disabled={isAtHome || !selectable || isMoving}
                  //   onPress={() => movePiece(p, i)}
                  //   style={{ position: 'absolute' }}
                  //   activeOpacity={0.8}
                  // >
                  //   <Animated.View
                  //     key={p + i}
                  //     style={[
                  //       styles.piece,
                  //       {
                  //         opacity: isAtHome ? 0.5 : 1,
                  //         transform: [
                  //           ...animatedPositions[p][i].getTranslateTransform(),
                  //           { translateX: -PIN_OFFSET.x },
                  //           { translateY: -PIN_OFFSET.y },
                  //           { scale: isAtHome ? 1 : Animated.multiply(pulse[p][i], killScale[p][i]) },
                  //         ],
                  //       },
                  //     ]}
                  //   >
                  //     <Image source={PIECE_IMAGES[p]} style={styles.pieceImage} />
                  //   </Animated.View>
                  // </TouchableOpacity>
                );
              })
            )}
          </ImageBackground>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={rollDice} disabled={state !== STATE.DICE_NOT_ROLLED}>
            {/* <Text style={styles.btnText}>Roll Dice</Text> */}

            <Animated.Image
              source={DICE_IMAGES[diceFace]}
              style={[
                styles.diceImage,
                {
                  transform: [
                    { scale: diceScale },
                    { rotate: rotateInterpolate },
                  ],
                },
              ]}
            />
          </TouchableOpacity>
        </View>

      </View>

      {showWinner && (
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.winTitle}>🏆 WINNER 🏆</Text>
            <Text style={styles.winName}>{winner}</Text>

            {/* <TouchableOpacity style={styles.popupBtn} onPress={goHome}>
              <Text style={styles.popupBtnText}>🔁 Retry</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={goHome}
            >
              <Image
                source={require('../../assets/buttons/home.png')} // 🔁 your PNG path
                style={styles.homeImageBtn}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width,
    height
  },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  board: { width: BOARD_SIZE, height: BOARD_SIZE, backgroundColor: '#fff' },
  boardShadow: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 16,

    // Android
    elevation: 12,

    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,

    backgroundColor: '#fff',
  },

  piece: { width: PIECE_SIZE, height: PIECE_SIZE },
  pieceImage: { width: '100%', height: '100%' },

  controls: { marginTop: 10, alignItems: 'center' },
  dice: { fontSize: 24, marginVertical: 10 },
  turnText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginVertical: 12,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff", // nice indigo / game-like accent
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  home: {
    position: 'absolute',
    width: '40%',
    height: '40%',
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  P1: { bottom: 0, left: 0, borderColor: '#2196f3' },
  P3: { top: 0, right: 0, borderColor: '#4caf50' },
  P2: { top: 0, left: 0, borderColor: '#ffeb3b' },
  P4: { bottom: 0, right: 0, borderColor: '#f44336' },

  diceImage: {
    width: 60,
    height: 60,
    marginVertical: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  popup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },

  winTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },

  winName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 20,
  },

  homeImageBtn: {
    width: 160,
    height: 55,
    resizeMode: 'contain',
    marginTop: 14,
  },

  popupBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

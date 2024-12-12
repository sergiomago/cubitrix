import { useRef, useState } from 'react';
import { SceneManager } from '../utils/sceneManager';
import { GameEngine } from '../utils/gameEngine';
import { getRandomPiece } from '../utils/pieces';
import GameUI from "@/components/GameUI";
import GameScene from './game/GameScene';
import GameControls from './game/GameControls';

const GameBoard = () => {
  const gameEngineRef = useRef<GameEngine>();
  const [score, setScore] = useState(0);
  const [nextPiece, setNextPiece] = useState(getRandomPiece());

  const spawnNewPiece = () => {
    if (!gameEngineRef.current) return;
    const wasPlaced = gameEngineRef.current.spawnPiece(nextPiece);
    if (wasPlaced) {
      setNextPiece(getRandomPiece());
    }
  };

  const rotatePiecePitch = () => {
    if (!gameEngineRef.current) return;
    gameEngineRef.current.rotatePiece('x');
  };

  const rotatePieceYaw = () => {
    if (!gameEngineRef.current) return;
    gameEngineRef.current.rotatePiece('y');
  };

  const rotatePieceRoll = () => {
    if (!gameEngineRef.current) return;
    gameEngineRef.current.rotatePiece('z');
  };

  const rotateCubePitch = () => {
    if (!gameEngineRef.current) return;
    gameEngineRef.current.rotateMainCube('x');
  };

  const rotateCubeYaw = () => {
    if (!gameEngineRef.current) return;
    gameEngineRef.current.rotateMainCube('y');
  };

  const rotateCubeRoll = () => {
    if (!gameEngineRef.current) return;
    gameEngineRef.current.rotateMainCube('z');
  };

  return (
    <div className="game-container">
      <GameScene 
        onScoreChange={setScore}
        onNextPieceChange={setNextPiece}
      />
      <GameControls 
        gameEngine={gameEngineRef.current}
        onSpawnNewPiece={spawnNewPiece}
      />
      <GameUI 
        score={score}
        nextPiece={nextPiece}
        onRotateX={rotatePiecePitch}
        onRotateY={rotatePieceYaw}
        onRotateZ={rotatePieceRoll}
        onRotateCubeX={rotateCubePitch}
        onRotateCubeY={rotateCubeYaw}
        onRotateCubeZ={rotateCubeRoll}
      />
    </div>
  );
};

export default GameBoard;
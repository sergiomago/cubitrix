import { useEffect, useRef, useState } from 'react';
import { SceneManager } from '../utils/sceneManager';
import { GameEngine } from '../utils/gameEngine';
import { getRandomPiece } from '../utils/pieces';
import GameUI from "@/components/GameUI";

const GameBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager>();
  const gameEngineRef = useRef<GameEngine>();
  
  const [score, setScore] = useState(0);
  const [nextPiece, setNextPiece] = useState(getRandomPiece());

  const spawnNewPiece = () => {
    if (!gameEngineRef.current) return;
    gameEngineRef.current.spawnPiece(nextPiece);
    setNextPiece(getRandomPiece());
  };

  const rotatePiecePitch = () => {
    gameEngineRef.current?.rotatePiece('x');
  };

  const rotatePieceYaw = () => {
    gameEngineRef.current?.rotatePiece('y');
  };

  const rotatePieceRoll = () => {
    gameEngineRef.current?.rotatePiece('z');
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!gameEngineRef.current) return;

    switch (event.key) {
      case 'ArrowLeft':
        gameEngineRef.current.movePiece('left');
        break;
      case 'ArrowRight':
        gameEngineRef.current.movePiece('right');
        break;
      case 'ArrowUp':
        gameEngineRef.current.movePiece('forward');
        break;
      case 'ArrowDown':
        gameEngineRef.current.movePiece('backward');
        break;
      case ' ': // Space bar
        gameEngineRef.current.movePiece('down');
        break;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const sceneManager = new SceneManager(containerRef.current);
    sceneManagerRef.current = sceneManager;
    
    const gameEngine = new GameEngine(sceneManager.getScene());
    gameEngineRef.current = gameEngine;

    // Spawn initial piece for gameplay
    spawnNewPiece();

    // Add keyboard controls
    window.addEventListener('keydown', handleKeyDown);

    // Start animation loop
    sceneManager.animate(() => {
      // Game loop logic will go here
    });

    // Handle window resize
    const handleResize = () => sceneManager.handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      sceneManager.cleanup();
    };
  }, []);

  return (
    <div ref={containerRef} className="game-container">
      <GameUI 
        score={score}
        onRotateX={rotatePiecePitch}
        onRotateY={rotatePieceYaw}
        onRotateZ={rotatePieceRoll}
      />
    </div>
  );
};

export default GameBoard;
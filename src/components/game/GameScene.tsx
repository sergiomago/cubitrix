import { useEffect, useRef } from 'react';
import { SceneManager } from '../../utils/sceneManager';
import { GameEngine } from '../../utils/gameEngine';
import { getRandomPiece } from '../../utils/pieces';

interface GameSceneProps {
  onScoreChange: (score: number) => void;
  onNextPieceChange: (piece: any) => void;
}

const GameScene = ({ onScoreChange, onNextPieceChange }: GameSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager>();
  const gameEngineRef = useRef<GameEngine>();

  useEffect(() => {
    if (!containerRef.current) return;

    const sceneManager = new SceneManager(containerRef.current);
    sceneManagerRef.current = sceneManager;
    
    const gameEngine = new GameEngine(sceneManager.getScene());
    gameEngineRef.current = gameEngine;

    // Spawn initial piece
    const initialPiece = getRandomPiece();
    gameEngine.spawnPiece(initialPiece);
    onNextPieceChange(getRandomPiece());

    // Start animation loop
    sceneManager.animate(() => {
      // Game loop logic here
    });

    // Handle window resize
    const handleResize = () => sceneManager.handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      sceneManager.cleanup();
    };
  }, [onNextPieceChange]);

  return <div ref={containerRef} className="game-canvas" />;
};

export default GameScene;
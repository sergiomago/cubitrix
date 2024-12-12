import { useEffect } from 'react';
import { GameEngine } from '../../utils/gameEngine';

interface GameControlsProps {
  gameEngine: GameEngine | undefined;
  onSpawnNewPiece: () => void;
}

const GameControls = ({ gameEngine, onSpawnNewPiece }: GameControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameEngine) return;

      switch (event.key) {
        case 'ArrowLeft':
          gameEngine.movePiece('left');
          break;
        case 'ArrowRight':
          gameEngine.movePiece('right');
          break;
        case 'ArrowUp':
          gameEngine.movePiece('forward');
          break;
        case 'ArrowDown':
          gameEngine.movePiece('backward');
          break;
        case ' ': // Space bar
          const wasPlaced = gameEngine.movePiece('down');
          if (wasPlaced) {
            onSpawnNewPiece();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameEngine, onSpawnNewPiece]);

  return null;
};

export default GameControls;
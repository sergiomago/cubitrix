import { Button } from "@/components/ui/button";
import { PieceDefinition } from "@/utils/pieces";
import PiecePreview from "./game/PiecePreview";

interface GameUIProps {
  score: number;
  nextPiece: PieceDefinition;
  onRotateX: () => void;
  onRotateY: () => void;
  onRotateZ: () => void;
  onRotateCubeX: () => void;
  onRotateCubeY: () => void;
  onRotateCubeZ: () => void;
}

const GameUI = ({ 
  score, 
  nextPiece, 
  onRotateX, 
  onRotateY, 
  onRotateZ,
  onRotateCubeX,
  onRotateCubeY,
  onRotateCubeZ 
}: GameUIProps) => {
  return (
    <>
      <div className="game-ui">
        <div className="score">Score: {score}</div>
      </div>
      <div className="next-piece">
        <h2 className="text-lg font-semibold mb-2">Next Piece</h2>
        <PiecePreview piece={nextPiece} />
      </div>
      <div className="controls">
        <div className="flex flex-col gap-4">
          <div className="text-white text-center mb-2">Piece Rotation</div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="bg-black/20 border-white/20"
              onClick={onRotateX}
            >
              Rotate X
            </Button>
            <Button 
              variant="outline" 
              className="bg-black/20 border-white/20"
              onClick={onRotateY}
            >
              Rotate Y
            </Button>
            <Button 
              variant="outline" 
              className="bg-black/20 border-white/20"
              onClick={onRotateZ}
            >
              Rotate Z
            </Button>
          </div>
          <div className="text-white text-center mb-2">Cube Rotation</div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="bg-black/20 border-white/20"
              onClick={onRotateCubeX}
            >
              Cube X
            </Button>
            <Button 
              variant="outline" 
              className="bg-black/20 border-white/20"
              onClick={onRotateCubeY}
            >
              Cube Y
            </Button>
            <Button 
              variant="outline" 
              className="bg-black/20 border-white/20"
              onClick={onRotateCubeZ}
            >
              Cube Z
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameUI;
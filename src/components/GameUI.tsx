import { Button } from "@/components/ui/button";

interface GameUIProps {
  score: number;
  onRotateX: () => void;
  onRotateY: () => void;
  onRotateZ: () => void;
}

const GameUI = ({ score, onRotateX, onRotateY, onRotateZ }: GameUIProps) => {
  return (
    <>
      <div className="game-ui">
        <div className="score">Score: {score}</div>
      </div>
      <div className="next-piece">
        <h2 className="text-lg font-semibold mb-2">Next Piece</h2>
        <div className="w-20 h-20 bg-black/30 rounded"></div>
      </div>
      <div className="controls">
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
    </>
  );
};

export default GameUI;
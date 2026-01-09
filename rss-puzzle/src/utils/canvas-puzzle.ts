import { MainPageConstants, PuzzleRenderConstants } from '../core/constants';

export function drawPuzzlePiece(
  word: string,
  width: number,
  bgImage: HTMLImageElement | undefined,
  bgX: number,
  bgY: number,
  isFirst: boolean,
  isLast: boolean,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context not available');
  }

  const height = MainPageConstants.PuzzleRowHeightPx;
  const tabSize = PuzzleRenderConstants.TabSize;

  const canvasWidth = width + (isLast ? PuzzleRenderConstants.StartPoint : tabSize);
  
  canvas.width = canvasWidth;
  canvas.height = height;

  context.beginPath();
  context.lineWidth = PuzzleRenderConstants.StrokeWidth;
  context.strokeStyle = PuzzleRenderConstants.StrokeColor;

  const x = PuzzleRenderConstants.StartPoint;
  const y = PuzzleRenderConstants.StartPoint;

  context.moveTo(x, y);
  context.lineTo(x + width, y);

  if (isLast) {
    context.lineTo(x + width, y + height);
  } else {
    const tabHeight = height / PuzzleRenderConstants.TabHeightDivider;
    const tabYStart = y + tabHeight;
    const tabYEnd = y + tabHeight * 2;
    const tabX = x + width;

    context.lineTo(tabX, tabYStart);
    context.bezierCurveTo(
      tabX + tabSize, tabYStart,
      tabX + tabSize, tabYEnd,
      tabX, tabYEnd,
    );
    context.lineTo(tabX, y + height);
  }

  context.lineTo(x, y + height);

  if (isFirst) {
    context.lineTo(x, y);
  } else {
    const tabHeight = height / PuzzleRenderConstants.TabHeightDivider;
    const tabYEnd = y + tabHeight;
    const tabYStart = y + tabHeight * 2;
    
    context.lineTo(x, tabYStart);
    context.bezierCurveTo(
      x + tabSize, tabYStart, 
      x + tabSize, tabYEnd,
      x, tabYEnd,
    );
    context.lineTo(x, y);
  }
  
  context.closePath();
  context.clip();

  if (bgImage) {
    context.drawImage(bgImage, -bgX, -bgY);
    context.fillStyle = PuzzleRenderConstants.OverlayStyle;
    context.fill();
  } else {
    context.fillStyle = PuzzleRenderConstants.PlaceholderColor;
    context.fill();
  }
  context.stroke();

  context.font = PuzzleRenderConstants.Font;
  context.textAlign = PuzzleRenderConstants.TextAlign;
  context.textBaseline = PuzzleRenderConstants.TextBaseline;
  
  context.shadowColor = PuzzleRenderConstants.ShadowColor;
  context.shadowBlur = PuzzleRenderConstants.ShadowBlur;
  context.lineWidth = PuzzleRenderConstants.TextStrokeWidth;
  context.strokeStyle = PuzzleRenderConstants.ShadowColor;

  const centerX = width / 2; 
  const centerY = height / 2;

  context.strokeText(word, centerX, centerY);
  
  context.shadowBlur = PuzzleRenderConstants.StartPoint;
  context.fillStyle = PuzzleRenderConstants.TextColor;
  context.fillText(word, centerX, centerY);

  return canvas;
}
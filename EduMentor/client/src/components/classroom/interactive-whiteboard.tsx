import { useState, useEffect, useRef } from "react";
import { Pencil, Copy, Share, Trash2, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveWhiteboardProps {
  lessonId: number;
}

const InteractiveWhiteboard = ({ lessonId }: InteractiveWhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(3);
  const [currentFormula, setCurrentFormula] = useState<string>("f'(g(x)) = f'(g(x)) · g'(x)");

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        setContext(ctx);
      }
      
      // Set canvas size to match container
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }
      };
      
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      
      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [canvasRef, color, brushSize]);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    setIsDrawing(true);
    
    let clientX: number, clientY: number;
    
    if ("touches" in e) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      context.beginPath();
      context.moveTo(x, y);
      context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      context.lineWidth = tool === "eraser" ? brushSize * 3 : brushSize;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    let clientX: number, clientY: number;
    
    if ("touches" in e) {
      e.preventDefault(); // Prevent scrolling while drawing
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const endDrawing = () => {
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const copyToClipboard = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(blob => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(() => {
            alert('Whiteboard copied to clipboard!');
          }).catch(err => {
            console.error('Error copying to clipboard:', err);
          });
        }
      });
    }
  };

  const downloadCanvas = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `lesson-${lessonId}-whiteboard.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Get formula demonstration based on lessonId
  useEffect(() => {
    // In a real app, this would fetch from an API
    const formulasByLesson: Record<number, string> = {
      1: "f'(x) = lim_{h→0} \\frac{f(x+h) - f(x)}{h}",
      2: "\\lim_{x \\to a} f(x) = L",
      3: "\\frac{d}{dx}[x^n] = nx^{n-1}",
      4: "f'(g(x)) = f'(g(x)) · g'(x)",
      5: "\\int f(x) dx = F(x) + C",
    };
    
    setCurrentFormula(formulasByLesson[lessonId] || "f'(g(x)) = f'(g(x)) · g'(x)");
  }, [lessonId]);

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-inner border border-neutral-200">
      <h3 className="text-neutral-800 font-medium mb-2">Interactive Whiteboard</h3>
      
      <div className="border border-neutral-300 rounded-md h-48 bg-white relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-md"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        
        {/* Overlaid formula */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-neutral-400">The instructor is showing a visual explanation of the Chain Rule</p>
            <div className="inline-block px-3 py-1 mt-2 bg-primary-100 text-primary-800 text-sm rounded-md">
              {currentFormula}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between">
        <div className="flex space-x-2">
          <div className="flex rounded-md overflow-hidden border border-neutral-300">
            <button 
              className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${tool === "pen" ? "bg-primary-100 text-primary-800" : "bg-white text-neutral-700"}`}
              onClick={() => setTool("pen")}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Draw
            </button>
            <button 
              className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${tool === "eraser" ? "bg-primary-100 text-primary-800" : "bg-white text-neutral-700"}`}
              onClick={() => setTool("eraser")}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Erase
            </button>
          </div>
          
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="h-[30px] w-8 p-0 border border-neutral-300 rounded"
          />
          
          <select 
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="h-[30px] text-xs border border-neutral-300 rounded px-1"
          >
            <option value="1">Thin</option>
            <option value="3">Medium</option>
            <option value="5">Thick</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-[30px] text-xs"
            onClick={copyToClipboard}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-[30px] text-xs"
            onClick={downloadCanvas}
          >
            <Download className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-[30px] text-xs"
            onClick={clearCanvas}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;

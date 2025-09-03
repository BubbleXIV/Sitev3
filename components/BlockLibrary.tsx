import React from "react";
import { Button } from "./Button";
import { 
  Type, 
  Image, 
  Video, 
  List, 
  Table, 
  Columns, 
  Minus,
  ChevronDown,
  Square,
  FileText,
  Code,
  Grid3X3,
  Play
} from "lucide-react";
import styles from "./BlockLibrary.module.css";
import { ContentBlockType } from "../helpers/schema";

interface BlockLibraryProps {
  onAddBlock: (blockType: ContentBlockType) => void;
}

const blockTypes: Array<{
  type: ContentBlockType;
  label: string;
  icon: React.ReactNode;
  category: string;
}> = [
  // Content blocks
  { type: "heading", label: "Heading", icon: <Type size={16} />, category: "Content" },
  { type: "paragraph", label: "Paragraph", icon: <FileText size={16} />, category: "Content" },
  { type: "list", label: "List", icon: <List size={16} />, category: "Content" },
  { type: "table", label: "Table", icon: <Table size={16} />, category: "Content" },
  
  // Layout blocks
  { type: "section", label: "Section", icon: <Square size={16} />, category: "Layout" },
  { type: "columns", label: "Columns", icon: <Columns size={16} />, category: "Layout" },
  { type: "divider", label: "Divider", icon: <Minus size={16} />, category: "Layout" },
  
  // Media blocks
  { type: "image", label: "Image", icon: <Image size={16} />, category: "Media" },
  { type: "video", label: "Video", icon: <Video size={16} />, category: "Media" },
  { type: "gallery", label: "Gallery", icon: <Grid3X3 size={16} />, category: "Media" },
  
  // Interactive blocks
  { type: "button", label: "Button", icon: <Square size={16} />, category: "Interactive" },
  { type: "accordion", label: "Accordion", icon: <ChevronDown size={16} />, category: "Interactive" },
  { type: "tabs", label: "Tabs", icon: <Minus size={16} />, category: "Interactive" },
  { type: "form", label: "Form", icon: <FileText size={16} />, category: "Interactive" },
  { type: "modal", label: "Modal", icon: <Square size={16} />, category: "Interactive" },
  { type: "carousel", label: "Carousel", icon: <Play size={16} />, category: "Interactive" },
  
  // Advanced blocks
  { type: "custom_html", label: "Custom HTML", icon: <Code size={16} />, category: "Advanced" },
];

const categories = Array.from(new Set(blockTypes.map(block => block.category)));

export const BlockLibrary: React.FC<BlockLibraryProps> = ({ onAddBlock }) => {
  return (
    <div className={styles.blockLibrary}>
      <h2 className={styles.title}>Add Blocks</h2>
      
      {categories.map(category => (
        <div key={category} className={styles.category}>
          <h3 className={styles.categoryTitle}>{category}</h3>
          <div className={styles.blockGrid}>
            {blockTypes
              .filter(block => block.category === category)
              .map(block => (
                <Button
                  key={block.type}
                  variant="ghost"
                  size="sm"
                  className={styles.blockButton}
                  onClick={() => onAddBlock(block.type)}
                >
                  {block.icon}
                  {block.label}
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
import React from "react";
import { Selectable } from "kysely";
import { PageContentBlocks } from "../helpers/schema";
import { Button } from "./Button";
import { Textarea } from "./Textarea";
import { Input } from "./Input";
import { Trash2, GripVertical, Edit3 } from "lucide-react";
import styles from "./BlockRenderer.module.css";

interface BlockRendererProps {
  block: Selectable<PageContentBlocks>;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

const getDefaultContent = (blockType: string) => {
  switch (blockType) {
    case 'heading':
      return { text: 'New Heading', level: 1 };
    case 'paragraph':
      return { text: 'Enter your paragraph text here...' };
    case 'list':
      return { items: ['List item 1', 'List item 2'], type: 'unordered' };
    case 'image':
      return { src: '', alt: '', caption: '' };
    case 'video':
      return { src: '', title: '' };
    case 'button':
      return { text: 'Click me', href: '#', variant: 'primary' };
    case 'divider':
      return { style: 'solid' };
    case 'section':
      return { title: 'Section Title' };
    case 'columns':
      return { columns: 2 };
    case 'table':
      return { 
        headers: ['Column 1', 'Column 2'], 
        rows: [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']] 
      };
    case 'gallery':
      return { images: [] };
    case 'accordion':
      return { items: [{ title: 'Accordion Item', content: 'Content here' }] };
    case 'tabs':
      return { tabs: [{ title: 'Tab 1', content: 'Tab content' }] };
    case 'form':
      return { fields: [], submitText: 'Submit' };
    case 'modal':
      return { title: 'Modal Title', content: 'Modal content' };
    case 'carousel':
      return { items: [] };
    case 'custom_html':
      return { html: '<div>Custom HTML content</div>' };
    default:
      return {};
  }
};

const renderBlockContent = (block: Selectable<PageContentBlocks>) => {
  const content = block.content || getDefaultContent(block.blockType);
  
  switch (block.blockType) {
    case 'heading':
      const level = Math.min(Math.max((content as any).level || 1, 1), 6);
      return React.createElement(
        `h${level}`,
        { className: styles.heading },
        (content as any).text || 'New Heading'
      );
      
    case 'paragraph':
      return <p className={styles.paragraph}>{(content as any).text || 'Enter your paragraph text here...'}</p>;
      
    case 'list':
      const ListTag = (content as any).type === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag className={styles.list}>
          {((content as any).items || []).map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      );
      
    case 'image':
      return (
        <div className={styles.imageBlock}>
          {(content as any).src ? (
            <img 
              src={(content as any).src} 
              alt={(content as any).alt || ''} 
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>No image selected</span>
            </div>
          )}
          {(content as any).caption && (
            <p className={styles.caption}>{(content as any).caption}</p>
          )}
        </div>
      );
      
    case 'video':
      return (
        <div className={styles.videoBlock}>
          {(content as any).src ? (
            <video controls className={styles.video}>
              <source src={(content as any).src} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className={styles.videoPlaceholder}>
              <span>No video selected</span>
            </div>
          )}
        </div>
      );
      
    case 'button':
      return (
        <Button 
          variant={(content as any).variant || 'primary'}
          className={styles.buttonBlock}
        >
          {(content as any).text || 'Click me'}
        </Button>
      );
      
    case 'divider':
      return <hr className={styles.divider} />;
      
    case 'section':
      return (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{(content as any).title || 'Section Title'}</h2>
          <div className={styles.sectionContent}>
            <p className={styles.placeholder}>Section content will go here</p>
          </div>
        </div>
      );
      
    case 'columns':
      const columnCount = (content as any).columns || 2;
      return (
        <div className={styles.columns} style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
          {Array.from({ length: columnCount }, (_, index) => (
            <div key={index} className={styles.column}>
              <p className={styles.placeholder}>Column {index + 1} content</p>
            </div>
          ))}
        </div>
      );
      
    case 'table':
      return (
        <table className={styles.table}>
          <thead>
            <tr>
              {((content as any).headers || []).map((header: string, index: number) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {((content as any).rows || []).map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
      
    case 'custom_html':
      return (
        <div 
          className={styles.customHtml}
          dangerouslySetInnerHTML={{ __html: (content as any).html || '<div>Custom HTML content</div>' }}
        />
      );
      
    default:
      return (
        <div className={styles.placeholder}>
          <p>{block.blockType} block</p>
          <p className={styles.placeholderText}>Content will be rendered here</p>
        </div>
      );
  }
};

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  onMove
}) => {
  return (
    <div 
      className={`${styles.blockWrapper} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className={styles.blockControls}>
          <div className={styles.controlsLeft}>
            <Button
              size="icon-sm"
              variant="ghost"
              className={styles.dragHandle}
            >
              <GripVertical size={14} />
            </Button>
            <span className={styles.blockType}>{block.blockType}</span>
          </div>
          <div className={styles.controlsRight}>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMove('up');
              }}
            >
              ↑
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMove('down');
              }}
            >
              ↓
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit3 size={14} />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      )}
      
      <div className={styles.blockContent}>
        {renderBlockContent(block)}
      </div>
    </div>
  );
};
import React from "react";
import { Selectable } from "kysely";
import { PageContentBlocks } from "../helpers/schema";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Button } from "./Button";
import styles from "./BlockInspector.module.css";

interface BlockInspectorProps {
  block: Selectable<PageContentBlocks> | null;
  onUpdateBlock: (blockId: number, updates: Partial<Selectable<PageContentBlocks>>) => void;
}

export const BlockInspector: React.FC<BlockInspectorProps> = ({
  block,
  onUpdateBlock
}) => {
  if (!block) {
    return (
      <div className={styles.inspector}>
        <div className={styles.emptyState}>
          <h2 className={styles.title}>Block Inspector</h2>
          <p className={styles.emptyText}>Select a block to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateContent = (updates: any) => {
    const newContent = { ...(block.content as any), ...updates };
    onUpdateBlock(block.id, { content: newContent });
  };

  const updateSettings = (updates: any) => {
    const newSettings = { ...(block.settings as any), ...updates };
    onUpdateBlock(block.id, { settings: newSettings });
  };

  const updateStyles = (updates: any) => {
    const newStyles = { ...(block.styles as any), ...updates };
    onUpdateBlock(block.id, { styles: newStyles });
  };

  const renderContentEditor = () => {
    const content = block.content as any || {};
    
    switch (block.blockType) {
      case 'heading':
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <div className={styles.field}>
              <label className={styles.label}>Text</label>
              <Input
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder="Enter heading text"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Level</label>
              <Select
                value={String(content.level || 1)}
                onValueChange={(value) => updateContent({ level: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                  <SelectItem value="5">H5</SelectItem>
                  <SelectItem value="6">H6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'paragraph':
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <div className={styles.field}>
              <label className={styles.label}>Text</label>
              <Textarea
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder="Enter paragraph text"
                rows={4}
              />
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <div className={styles.field}>
              <label className={styles.label}>Image URL</label>
              <Input
                value={content.src || ''}
                onChange={(e) => updateContent({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Alt Text</label>
              <Input
                value={content.alt || ''}
                onChange={(e) => updateContent({ alt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Caption</label>
              <Input
                value={content.caption || ''}
                onChange={(e) => updateContent({ caption: e.target.value })}
                placeholder="Optional caption"
              />
            </div>
          </div>
        );
        
      case 'button':
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <div className={styles.field}>
              <label className={styles.label}>Button Text</label>
              <Input
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder="Click me"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Link URL</label>
              <Input
                value={content.href || ''}
                onChange={(e) => updateContent({ href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Variant</label>
              <Select
                value={content.variant || 'primary'}
                onValueChange={(value) => updateContent({ variant: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'section':
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <div className={styles.field}>
              <label className={styles.label}>Section Title</label>
              <Input
                value={content.title || ''}
                onChange={(e) => updateContent({ title: e.target.value })}
                placeholder="Section Title"
              />
            </div>
          </div>
        );
        
      case 'columns':
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Layout</h3>
            <div className={styles.field}>
              <label className={styles.label}>Number of Columns</label>
              <Select
                value={String(content.columns || 2)}
                onValueChange={(value) => updateContent({ columns: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'custom_html':
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <div className={styles.field}>
              <label className={styles.label}>HTML Code</label>
              <Textarea
                value={content.html || ''}
                onChange={(e) => updateContent({ html: e.target.value })}
                placeholder="<div>Your HTML here</div>"
                rows={8}
                style={{ fontFamily: 'var(--font-family-monospace)', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <p className={styles.placeholder}>
              Content editor for {block.blockType} blocks is not yet implemented.
            </p>
          </div>
        );
    }
  };

  const renderStyleEditor = () => {
    const styles = block.styles as any || {};
    
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Styling</h3>
        <div className={styles.field}>
          <label className={styles.label}>CSS Classes</label>
          <Input
            value={styles.className || ''}
            onChange={(e) => updateStyles({ className: e.target.value })}
            placeholder="custom-class another-class"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Background Color</label>
          <Input
            type="color"
            value={styles.backgroundColor || '#ffffff'}
            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Text Color</label>
          <Input
            type="color"
            value={styles.color || '#000000'}
            onChange={(e) => updateStyles({ color: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Padding</label>
          <Input
            value={styles.padding || ''}
            onChange={(e) => updateStyles({ padding: e.target.value })}
            placeholder="16px or 1rem"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Margin</label>
          <Input
            value={styles.margin || ''}
            onChange={(e) => updateStyles({ margin: e.target.value })}
            placeholder="16px or 1rem"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.inspector}>
      <div className={styles.header}>
        <h2 className={styles.title}>Block Inspector</h2>
        <div className={styles.blockInfo}>
          <span className={styles.blockType}>{block.blockType}</span>
          <span className={styles.blockId}>ID: {block.id}</span>
        </div>
      </div>
      
      <div className={styles.content}>
        {renderContentEditor()}
        {renderStyleEditor()}
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Settings</h3>
          <div className={styles.field}>
            <label className={styles.label}>Display Order</label>
            <Input
              type="number"
              value={block.displayOrder || 0}
              onChange={(e) => onUpdateBlock(block.id, { displayOrder: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={block.isActive !== false}
                onChange={(e) => onUpdateBlock(block.id, { isActive: e.target.checked })}
              />
              Block is active
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
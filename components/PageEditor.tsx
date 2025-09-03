import React, { useState, useEffect } from "react";
import { PageWithContent } from "../endpoints/pages/by-id_GET.schema";
import { usePage } from "../helpers/usePage";
import { usePageMutations } from "../helpers/usePageMutations";
import { Selectable } from "kysely";
import { PageContentBlocks, ContentBlockType } from "../helpers/schema";
import { Button } from "./Button";
import { Input } from "./Input";
import { Spinner } from "./Spinner";
import { BlockLibrary } from "./BlockLibrary";
import { BlockRenderer } from "./BlockRenderer";
import { ContentBlockEditor } from "./ContentBlockEditor";
import { Save, Eye, Globe, AlertCircle } from "lucide-react";
import styles from "./PageEditor.module.css";

interface PageEditorProps {
  pageData: PageWithContent;
}

export const PageEditor: React.FC<PageEditorProps> = ({ pageData }) => {
  const pageId = pageData.id;
  const { useUpdatePage, useUpdatePageContent, usePublishPage } = usePageMutations();
  
  const updatePageMutation = useUpdatePage();
  const updateContentMutation = useUpdatePageContent();
  const publishPageMutation = usePublishPage();
  
  const [contentBlocks, setContentBlocks] = useState<Selectable<PageContentBlocks>[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize state when page data loads
  useEffect(() => {
    if (pageData) {
      setContentBlocks(pageData.contentBlocks || []);
      setPageTitle(pageData.title);
      setHasUnsavedChanges(false);
    }
  }, [pageData]);

  const selectedBlock = contentBlocks.find(block => block.id === selectedBlockId) || null;

  const handleAddBlock = (blockType: ContentBlockType) => {
    const newBlock: Partial<Selectable<PageContentBlocks>> = {
      id: Date.now(), // Temporary ID for new blocks
      pageId: pageId,
      blockType,
      content: getDefaultContent(blockType),
      displayOrder: contentBlocks.length,
      isActive: true,
      settings: null,
      styles: null,
      parentBlockId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setContentBlocks(prev => [...prev, newBlock as Selectable<PageContentBlocks>]);
    setSelectedBlockId(newBlock.id!);
    setHasUnsavedChanges(true);
  };

  const handleUpdateBlock = (blockId: number, updates: Partial<Selectable<PageContentBlocks>>) => {
    setContentBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, ...updates, updatedAt: new Date() }
          : block
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleDeleteBlock = (blockId: number) => {
    setContentBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    setHasUnsavedChanges(true);
  };

  const handleMoveBlock = (blockId: number, direction: 'up' | 'down') => {
    setContentBlocks(prev => {
      const blocks = [...prev];
      const currentIndex = blocks.findIndex(block => block.id === blockId);
      
      if (currentIndex === -1) return blocks;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= blocks.length) return blocks;
      
      // Swap blocks
      [blocks[currentIndex], blocks[newIndex]] = [blocks[newIndex], blocks[currentIndex]];
      
      // Update display orders
      blocks.forEach((block, index) => {
        block.displayOrder = index;
      });
      
      return blocks;
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveDraft = async () => {
    if (!pageData) return;
    
    try {
      // Update page title if changed
      if (pageTitle !== pageData.title) {
        await updatePageMutation.mutateAsync({
          id: pageId,
          title: pageTitle
        });
      }
      
      // Update content blocks
      await updateContentMutation.mutateAsync({
        pageId: pageId,
        contentBlocks: contentBlocks.map(block => ({
          blockType: block.blockType,
          content: block.content,
          settings: block.settings,
          styles: block.styles
        }))
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handlePublish = async () => {
    if (!pageData) return;
    
    try {
      // Save changes first
      await handleSaveDraft();
      
      // Then publish
      await publishPageMutation.mutateAsync({
        id: pageId,
        publish: true
      });
    } catch (error) {
      console.error('Failed to publish page:', error);
    }
  };

  const getDefaultContent = (blockType: ContentBlockType) => {
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

  return (
    <div className={styles.editorLayout}>
      <header className={styles.editorHeader}>
        <div className={styles.headerLeft}>
          <Input
            value={pageTitle}
            onChange={(e) => {
              setPageTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            className={styles.titleInput}
            placeholder="Page title"
          />
          {hasUnsavedChanges && (
            <span className={styles.unsavedIndicator}>Unsaved changes</span>
          )}
        </div>
        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={updatePageMutation.isPending || updateContentMutation.isPending}
          >
            {(updatePageMutation.isPending || updateContentMutation.isPending) ? (
              <Spinner size="sm" />
            ) : (
              <Save size={16} />
            )}
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishPageMutation.isPending}
          >
            {publishPageMutation.isPending ? (
              <Spinner size="sm" />
            ) : (
              <Globe size={16} />
            )}
            Publish
          </Button>
        </div>
      </header>
      
      <div className={styles.editorBody}>
        <aside className={styles.leftPanel}>
          <BlockLibrary onAddBlock={handleAddBlock} />
        </aside>
        
        <main className={styles.canvas}>
          <div className={styles.canvasHeader}>
            <h2 className={styles.canvasTitle}>Page Content</h2>
            <div className={styles.canvasActions}>
              <Button variant="ghost" size="sm">
                <Eye size={16} />
                Preview
              </Button>
            </div>
          </div>
          
          <div className={styles.canvasContent}>
            {contentBlocks.length === 0 ? (
              <div className={styles.emptyCanvas}>
                <h3>Start building your page</h3>
                <p>Add content blocks from the left panel to get started.</p>
              </div>
            ) : (
              <div className={styles.blockList}>
                {contentBlocks
                  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                  .map(block => (
                    <BlockRenderer
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                      onEdit={() => setSelectedBlockId(block.id)}
                      onMove={(direction) => handleMoveBlock(block.id, direction)}
                    />
                  ))}
              </div>
            )}
          </div>
        </main>
        
        <aside className={styles.rightPanel}>
          <ContentBlockEditor
            block={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
          />
        </aside>
      </div>
    </div>
  );
};
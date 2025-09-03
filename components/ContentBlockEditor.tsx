import React from "react";
import { Selectable } from "kysely";
import { PageContentBlocks } from "../helpers/schema";
import { BlockInspector } from "./BlockInspector";
import styles from "./ContentBlockEditor.module.css";

interface ContentBlockEditorProps {
  block: Selectable<PageContentBlocks> | null;
  onUpdateBlock: (blockId: number, updates: Partial<Selectable<PageContentBlocks>>) => void;
}

export const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  onUpdateBlock
}) => {
  return (
    <div className={styles.contentBlockEditor}>
      <BlockInspector block={block} onUpdateBlock={onUpdateBlock} />
    </div>
  );
};
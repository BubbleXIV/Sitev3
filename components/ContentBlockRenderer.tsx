import React from "react";
import { Selectable } from "kysely";
import { PageContentBlocks } from "../helpers/schema";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import styles from "./ContentBlockRenderer.module.css";

interface ContentBlockRendererProps {
  blocks: Selectable<PageContentBlocks>[];
  className?: string;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  blocks,
  className,
}) => {
  const sortedBlocks = [...blocks].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const renderBlock = (block: Selectable<PageContentBlocks>) => {
    if (!block.isActive) return null;

    const content = block.content as any;
    const styles_block = block.styles as any;
    const blockStyle = styles_block ? { ...styles_block } : {};

    switch (block.blockType) {
      case "heading":
        const headingLevel = content.level && content.level >= 1 && content.level <= 6 ? content.level : 2;
        const headingTag = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        
        return React.createElement(
          headingTag,
          {
            key: block.id,
            className: styles.heading,
            style: blockStyle,
          },
          content.text
        );

      case "paragraph":
        return (
          <p
            key={block.id}
            className={styles.paragraph}
            style={blockStyle}
            dangerouslySetInnerHTML={{ __html: content.text || content.html }}
          />
        );

      case "image":
        return (
          <div key={block.id} className={styles.imageContainer} style={blockStyle}>
            <img
              src={content.src}
              alt={content.alt || ""}
              className={styles.image}
              style={content.style || {}}
            />
            {content.caption && (
              <p className={styles.imageCaption}>{content.caption}</p>
            )}
          </div>
        );

      case "button":
        return (
          <div key={block.id} className={styles.buttonContainer} style={blockStyle}>
            {content.href ? (
              content.external ? (
                <Button asChild variant={content.variant || "primary"}>
                  <a href={content.href} target="_blank" rel="noopener noreferrer">
                    {content.text}
                  </a>
                </Button>
              ) : (
                <Button asChild variant={content.variant || "primary"}>
                  <Link to={content.href}>{content.text}</Link>
                </Button>
              )
            ) : (
              <Button variant={content.variant || "primary"}>
                {content.text}
              </Button>
            )}
          </div>
        );

      case "section":
        const childBlocks = blocks.filter(b => b.parentBlockId === block.id);
        return (
          <section
            key={block.id}
            className={`${styles.section} ${content.className || ""}`}
            style={blockStyle}
          >
            <ContentBlockRenderer blocks={childBlocks} />
          </section>
        );

      case "divider":
        return (
          <hr
            key={block.id}
            className={styles.divider}
            style={blockStyle}
          />
        );

      case "custom_html":
        return (
          <div
            key={block.id}
            className={styles.customHtml}
            style={blockStyle}
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        );

      default:
        return (
          <div key={block.id} className={styles.unknownBlock} style={blockStyle}>
            <p>Unsupported block type: {block.blockType}</p>
          </div>
        );
    }
  };

  // Only render top-level blocks (no parent)
  const topLevelBlocks = sortedBlocks.filter(block => !block.parentBlockId);

  return (
    <div className={className}>
      {topLevelBlocks.map(renderBlock)}
    </div>
  );
};
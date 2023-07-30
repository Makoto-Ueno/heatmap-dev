import { FC, useCallback, useEffect, useState } from 'react';
import { TbH1, TbH2, TbH3 } from 'react-icons/tb';
import {
  MdFormatQuote,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdChecklist,
} from 'react-icons/md';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import styles from './ToolbarPlugin.module.scss';
import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
  $createQuoteNode,
} from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $setBlocksType } from '@lexical/selection';

const SupportedBlockType = {
  paragraph: 'Paragraph',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  quote: 'Quote',
  number: 'Numbered List',
  bullet: 'Bulleted List',
  check: 'Check List',
} as const;
type BlockType = keyof typeof SupportedBlockType;

export const ToolbarPlugin: FC = () => {
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const [editor] = useLexicalComposerContext();

  const formatHeading = useCallback(
    (type: HeadingTagType) => {
      if (blockType !== type) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(type));
          }
        });
      }
    },
    [blockType, editor]
  );

  const formatQuote = useCallback(() => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  }, [blockType, editor]);

  const formatBulletList = useCallback(() => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  }, [blockType, editor]);

  const formatNumberedList = useCallback(() => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  }, [blockType, editor]);

  const formatCheckList = useCallback(() => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
  }, [blockType, editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const targetNode =
          anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag();
          setBlockType(tag);
        } else if ($isListNode(targetNode)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const listType = parentList
            ? parentList.getListType()
            : targetNode.getListType();

          setBlockType(listType);
        } else {
          const nodeType = targetNode.getType();
          if (nodeType in SupportedBlockType) {
            setBlockType(nodeType as BlockType);
          } else {
            setBlockType('paragraph');
          }
        }
      });
    });
  }, [editor]);

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h1']}
        aria-label={SupportedBlockType['h1']}
        aria-checked={blockType === 'h1'}
        onClick={() => formatHeading('h1')}
      >
        <TbH1 />
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h2']}
        aria-label={SupportedBlockType['h2']}
        aria-checked={blockType === 'h2'}
        onClick={() => formatHeading('h2')}
      >
        <TbH2 />
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h3']}
        aria-label={SupportedBlockType['h3']}
        aria-checked={blockType === 'h3'}
        onClick={() => formatHeading('h3')}
      >
        <TbH3 />
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['bullet']}
        aria-label={SupportedBlockType['bullet']}
        aria-checked={blockType === 'bullet'}
        onClick={formatBulletList}
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['number']}
        aria-label={SupportedBlockType['number']}
        aria-checked={blockType === 'number'}
        onClick={formatNumberedList}
      >
        <MdFormatListNumbered />
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['check']}
        aria-label={SupportedBlockType['check']}
        aria-checked={blockType === 'check'}
        onClick={formatCheckList}
      >
        <MdChecklist />
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['quote']}
        aria-label={SupportedBlockType['quote']}
        aria-checked={blockType === 'quote'}
        onClick={formatQuote}
      >
        <MdFormatQuote />
      </button>
    </div>
  );
};

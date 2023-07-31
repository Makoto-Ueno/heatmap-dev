import { ComponentProps, FC } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import styles from './Editor.module.scss';
import { AutoFocusPlugin } from '@/plugins/AutoFocusPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { nodes } from '@/nodes/nodes';
import { ToolbarPlugin } from '@/plugins/ToolbarPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { theme } from '../editorTheme/editorTheme';
import { CodeHighlightPlugin } from '@/plugins/CodeHighlightPlugin';
import { InlineToolbarPlugin } from '@/plugins/InlineToolbarPlugin';
import { MarkdownPlugin } from '@/plugins/MarkdownPlugin';

const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
  namespace: 'MyEditor',
  onError: (error) => console.error(error),
  nodes: nodes,
  theme: theme,
};

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <InlineToolbarPlugin />
      <div className={styles.editorContainer}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className={styles.contentEditable} />
          }
          placeholder={
            <div className={styles.placeholder}>いまなにしてる？</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <AutoFocusPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <CodeHighlightPlugin />
      <MarkdownPlugin />
    </LexicalComposer>
  );
};

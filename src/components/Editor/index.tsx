import { ComponentProps, FC } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import styles from './Editor.module.scss';

const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
  namespace: 'MyEditor',
  onError: (error) => console.error(error),
};

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
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
    </LexicalComposer>
  );
};

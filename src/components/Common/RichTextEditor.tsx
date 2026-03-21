import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Box, 
  Button, 
  Divider, 
  Typography,
  Tooltip,
  ButtonGroup
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link as LinkIcon,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Undo,
  Redo
} from '@mui/icons-material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  minHeight?: number;
  error?: boolean;
  helperText?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  maxLength = 1000,
  minHeight = 150,
  error = false,
  helperText
}) => {
  const [characterCount, setCharacterCount] = useState(0);

  const getTextContent = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'rich-text-link'
        }
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content: value,
    onUpdate: ({ editor }: { editor: any }) => {
      const html = editor.getHTML();
      onChange(html);
      const textContent = getTextContent(html);
      setCharacterCount(textContent.length);
    },
    editable: !disabled
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
    const textContent = getTextContent(value);
    setCharacterCount(textContent.length);
  }, [value, editor]);
  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      const textContent = getTextContent(html);
      setCharacterCount(textContent.length);
    }
  }, [editor]);

  if (!editor) return null;
  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };
  const isActive = (name: string, attrs?: any) => {
    return editor.isActive(name, attrs);
  };

  const getCharacterCount = () => {
    return characterCount;
  };

  const isOverLimit = () => {
    return characterCount > maxLength;
  };

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0',
          p: 1,
          bgcolor: 'grey.50',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          alignItems: 'center'
        }}
      >
        {/* Text Formatting */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Bold">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              variant={isActive('bold') ? 'contained' : 'outlined'}
              size="small"
            >
              <FormatBold fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Italic">
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              variant={isActive('italic') ? 'contained' : 'outlined'}
              size="small"
            >
              <FormatItalic fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Underline">
            <Button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              variant={isActive('underline') ? 'contained' : 'outlined'}
              size="small"
            >
              <FormatUnderlined fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Lists */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Bullet List">
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              variant={isActive('bulletList') ? 'contained' : 'outlined'}
              size="small"
            >
              <FormatListBulleted fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Numbered List">
            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              variant={isActive('orderedList') ? 'contained' : 'outlined'}
              size="small"
            >
              <FormatListNumbered fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Quote & Code */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Quote">
            <Button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              variant={isActive('blockquote') ? 'contained' : 'outlined'}
              size="small"
            >
              <FormatQuote fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Code">
            <Button
              onClick={() => editor.chain().focus().toggleCode().run()}
              variant={isActive('code') ? 'contained' : 'outlined'}
              size="small"
            >
              <Code fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Link */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Add Link">
            <Button
              onClick={addLink}
              size="small"
            >
              <LinkIcon fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Undo/Redo */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Undo">
            <Button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              size="small"
            >
              <Undo fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Redo">
            <Button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              size="small"
            >
              <Redo fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>

      {/* Editor Content */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: '0 0 4px 4px',
          minHeight: `${minHeight}px`,
          '& .ProseMirror': {
            outline: 'none',
            padding: 2,
            minHeight: `${minHeight - 16}px`,
            '& p': {
              margin: '0 0 8px 0',
              '&:last-child': {
                marginBottom: 0
              }
            },
            '& ul, & ol': {
              paddingLeft: 3,
              margin: '8px 0'
            },
            '& blockquote': {
              borderLeft: '3px solid #ddd',
              paddingLeft: 2,
              margin: '8px 0',
              fontStyle: 'italic',
              color: 'text.secondary'
            },
            '& code': {
              backgroundColor: 'grey.100',
              padding: '2px 4px',
              borderRadius: 1,
              fontSize: '0.875em',
              fontFamily: 'monospace'
            },
            '& .rich-text-link': {
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.dark'
              }
            },
            '& .is-editor-empty:first-child::before': {
              content: 'attr(data-placeholder)',
              float: 'left',
              color: 'text.disabled',
              pointerEvents: 'none',
              height: 0
            }
          }
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* Helper Text & Character Count */}
      {(helperText || maxLength) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
            px: 1
          }}
        >
          {helperText && (
            <Typography
              variant="caption"
              color={error ? 'error' : 'text.secondary'}
            >
              {helperText}
            </Typography>
          )}
          {maxLength && (
            <Typography
              variant="caption"
              color={isOverLimit() ? 'error' : 'text.secondary'}
              sx={{ ml: 'auto' }}
            >
              {getCharacterCount()}/{maxLength}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RichTextEditor;
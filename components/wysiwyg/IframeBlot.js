import React from 'react';
import { Quill } from 'react-quill';

const BlockEmbed = Quill.import('blots/block/embed');

class IframeBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();

    node.setAttribute('width', value.width);
    node.setAttribute('height', value.height);
    node.setAttribute('src', value.src);
    return node;
  }

  static value(node) {
    return {
      width: node.getAttribute('width'),
      height: node.getAttribute('height'),
      src: node.getAttribute('src')
    };
  }
}

IframeBlot.blotName = 'iframe';
IframeBlot.tagName = 'iframe';
IframeBlot.className = 'inline-iframe';

Quill.register(IframeBlot);

import { Quill } from 'react-quill';

const Parchment = Quill.import('parchment');
const BlockEmbed = Quill.import('blots/block/embed');

class WidgetLayoutBlot extends BlockEmbed {
  static getColumns(length) {
    if (length === 1) {
      return 'small-12';
    }

    if (length > 1 && length % 3 !== 0) {
      return 'medium-6 small-12';
    }

    if (length % 3 === 0) {
      return 'medium-4 small-12';
    }

    return 'small-12';
  }

  static create(value) {
    const node = super.create();
    const { widgets } = value;

    if (widgets && widgets.length) { node.setAttribute('data-widgets', JSON.stringify(widgets)); }

    const row = document.createElement('div');
    row.classList.add('row');

    widgets.forEach((w) => {
      const col = document.createElement('div');
      col.classList.add('column');
      this.getColumns(widgets.length).split(' ').forEach(c => col.classList.add(c));

      const embed = document.createElement('iframe');
      embed.setAttribute('width', '100%');
      embed.setAttribute('height', 500);
      embed.setAttribute('frameborder', 0);
      embed.setAttribute('src', `/embed/${w.type || 'widget'}/${w.id}`);

      col.appendChild(embed);
      row.appendChild(col);
    });

    node.appendChild(row);

    return node;
  }

  static value(node) {
    return {
      widgets: JSON.parse(node.getAttribute('data-widgets'))
    };
  }
}

WidgetLayoutBlot.blotName = 'widget-layout';
WidgetLayoutBlot.scope = Parchment.Scope.BLOCK_BLOT;
WidgetLayoutBlot.tagName = 'div';
WidgetLayoutBlot.className = 'widget-layout';

Quill.register(WidgetLayoutBlot);

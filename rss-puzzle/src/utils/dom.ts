import type { Child, CreateElementOptions } from '../core/types';

function appendChild(parent: ParentNode, child: Child): void {
  if (child === undefined || child === false) {
    return;
  }

  if (child instanceof Node) {
    parent.append(child);
    return;
  }

  parent.append(String(child));
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: CreateElementOptions<HTMLElementTagNameMap[K]> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  const {
    props,
    className,
    classes,
    style,
    dataset,
    attrs,
    on,
    text,
  } = options;

  if (props) {
    Object.assign(node, props);
  }

  if (className) {
    node.className = className;
  }

  if (classes && classes.length > 0) {
    node.classList.add(...classes);
  }

  if (style) {
    Object.assign(node.style, style);
  }

  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      node.dataset[key] = value;
    }
  }

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (typeof value === 'boolean') {
        if (value) {
          node.setAttribute(key, '');
        }
        continue;
      }
      node.setAttribute(key, String(value));
    }
  }

  if (on) {
    for (const [type, handler] of on) {
      node.addEventListener(type, handler);
    }
  }

  if (text !== undefined) {
    node.textContent = text;
  }

  for (const child of children) {
    appendChild(node, child);
  }

  return node;
}
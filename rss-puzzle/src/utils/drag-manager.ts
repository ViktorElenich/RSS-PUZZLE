import { MainPageConstants } from '../core/constants';

import type { DragManagerOptions } from '../core/types';

export class DragManager {
  private readonly puzzleArea: HTMLElement;
  private readonly sourceArea: HTMLElement;
  private readonly getCurrentRow: () => HTMLElement | undefined;
  private readonly onUpdate: () => void;
  private readonly onValidationClear: () => void;

  private draggingElement: HTMLElement | undefined = undefined;

  private touchDragItem: HTMLElement | undefined = undefined;
  private touchDragItemClone: HTMLElement | undefined = undefined;
  private initialX = 0;
  private initialY = 0;
  private isDragProcess = false;

  constructor(options: DragManagerOptions) {
    this.puzzleArea = options.puzzleArea;
    this.sourceArea = options.sourceArea;
    this.getCurrentRow = options.getCurrentRow;
    this.onUpdate = options.onUpdate;
    this.onValidationClear = options.onValidationClear;

    this.initListeners();
  }

  private initListeners(): void {
    const areas = [this.puzzleArea, this.sourceArea];

    areas.forEach((area) => {
      area.addEventListener('dragstart', this.handleDragStart.bind(this));
      area.addEventListener('dragend', this.handleDragEnd.bind(this));
      area.addEventListener('dragover', this.handleDragOver.bind(this));
      
      area.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      area.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      area.addEventListener('touchend', this.handleTouchEnd.bind(this));
    });
  }

  private handleDragStart(event: DragEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement) || 
      !target.classList.contains(MainPageConstants.WordPieceClass)) {
      return;
    }

    this.draggingElement = target;

    setTimeout(() => {
      if (this.draggingElement) {
        this.draggingElement.classList.add(MainPageConstants.ClassDragging);
      }
    }, 0);

    this.onValidationClear();
  }

  private handleDragEnd(): void {
    if (this.draggingElement) {
      this.draggingElement.classList.remove(MainPageConstants.ClassDragging);
      this.draggingElement = undefined;
    }
    this.onUpdate();
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();

    if (!this.draggingElement) { return; }

    const target = event.target;
    if (!(target instanceof HTMLElement)) { return; }

    const container = this.getContainer(target);
    if (!container) { return; }

    const afterElement = this.getDragAfterElement(container, event.clientX);

    if (afterElement) {
      afterElement.before(this.draggingElement);
    } else {
      container.append(this.draggingElement);
    }
  }

  private handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];

    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!(target instanceof HTMLElement) || 
      !target.classList.contains(MainPageConstants.WordPieceClass)) {
      return;
    }

    this.touchDragItem = target;
    this.initialX = touch.clientX;
    this.initialY = touch.clientY;
    this.isDragProcess = false;
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.touchDragItem) { return; }

    const touch = event.touches[0];

    const deltaX = touch.clientX - this.initialX;
    const deltaY = touch.clientY - this.initialY;

    if (Math.abs(deltaX) < MainPageConstants.DragThresholdPx && 
      Math.abs(deltaY) < MainPageConstants.DragThresholdPx) {
      return;
    }

    this.isDragProcess = true;
    event.preventDefault();

    if (!this.touchDragItemClone) {
      this.createTouchClone(this.touchDragItem);
      this.touchDragItem.classList.add(MainPageConstants.ClassDragging);
      this.onValidationClear();
    }

    if (this.touchDragItemClone) {
      this.touchDragItemClone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (!this.isDragProcess) {
      this.cleanupTouch();
      return;
    }

    if (this.touchDragItem) {
      const touch = event.changedTouches[0];
      if (this.touchDragItemClone) {
        this.touchDragItemClone.style.display = 'none';
      }

      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const container = this.getContainer(dropTarget);

      if (container) {
        const afterElement = this.getDragAfterElement(container, touch.clientX);
        if (afterElement) {
          afterElement.before(this.touchDragItem);
        } else {
          container.append(this.touchDragItem);
        }
      }
      
    }

    this.cleanupTouch();
    this.onUpdate();
  }

  private cleanupTouch(): void {
    if (this.touchDragItem) {
      this.touchDragItem.classList.remove(MainPageConstants.ClassDragging);
      this.touchDragItem = undefined;
    }
    if (this.touchDragItemClone) {
      this.touchDragItemClone.remove();
      this.touchDragItemClone = undefined;
    }
    this.isDragProcess = false;
  }

  private createTouchClone(target: HTMLElement): void {
    const rect = target.getBoundingClientRect();
    const clone = target.cloneNode(true);

    if (!(clone instanceof HTMLElement)) { return; }

    this.touchDragItemClone = clone;
    
    this.touchDragItemClone.style.position = 'fixed';
    this.touchDragItemClone.style.left = `${rect.left}px`;
    this.touchDragItemClone.style.top = `${rect.top}px`;
    this.touchDragItemClone.style.width = `${rect.width}px`;
    this.touchDragItemClone.style.height = `${rect.height}px`;
    this.touchDragItemClone.style.zIndex = MainPageConstants.DragZIndex;
    this.touchDragItemClone.style.opacity = MainPageConstants.DragOpacity;
    this.touchDragItemClone.style.pointerEvents = 'none';
    this.touchDragItemClone.classList.add(MainPageConstants.ClassClone);

    document.body.append(this.touchDragItemClone);
  }

  private getContainer(target: EventTarget | null): HTMLElement | undefined {
    if (!(target instanceof HTMLElement)) { return undefined; }

    const currentRow = this.getCurrentRow();

    if (this.sourceArea.contains(target) || target === this.sourceArea) {
      return this.sourceArea;
    }

    if (currentRow && (currentRow.contains(target) || target === currentRow)) {
      return currentRow;
    }

    return undefined;
  }

  private getDragAfterElement(container: HTMLElement, x: number): HTMLElement | undefined {
    const children = [...container.children];
    
    const draggableElements = children.filter((child): child is HTMLElement => 
      child instanceof HTMLElement &&
      child.classList.contains(MainPageConstants.WordPieceClass) && 
      !child.classList.contains(MainPageConstants.ClassDragging),
    );

    return draggableElements.reduce<{ offset: number; element: HTMLElement | undefined }>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: undefined },
    ).element;
  }
}
import Columns from './Columns';

export default class Control {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.draggedEl = null;
    this.draggingClone = null;
  }

  bindToDOM() {
    const cols = new Columns(this.parentEl);

    if (localStorage.getItem('task')) {
      cols.bindToDOM(localStorage.getItem('task'));
    } else {
      cols.bindToDOM(cols.getMarkDown());
    }

    this.columns = this.parentEl.querySelector('.columns');
    this.addListeners();
  }

  addListeners() {
    this.columns.addEventListener('mouseover', (e) => {
      const { target } = e;
      if (target.classList.contains('card-remover')) target.classList.add('remove-active');
      if (target.classList.contains('card-wrapper') || target.classList.contains('card-content')) {
        const cardWrapper = target.closest('.card-wrapper');
        const remover = cardWrapper.querySelector('.card-remover');
        remover.classList.add('remove-active');
      }
    });

    this.columns.addEventListener('mouseout', (e) => {
      const { target } = e;
      if (target.classList.contains('card-wrapper') || target.classList.contains('card-content')) {
        const cardWrapper = target.closest('.card-wrapper');
        const remover = cardWrapper.querySelector('.card-remover');
        remover.classList.remove('remove-active');
      }
    });

    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (e) => {
    const { target } = e;
    if (target.closest('.card-wrapper')) {
      this.draggedEl = target.closest('.card-wrapper');

      this.shiftX = e.offsetX;
      this.shiftY = e.offsetY;
      this.draggedEl.style.left = `${e.clientX - this.shiftX}px`;
      this.draggedEl.style.top = `${e.clientY - this.shiftY}px`;

      this.onDragged(e);
      document.addEventListener('mousemove', this.onMouseMove);
    }
  };

  onMouseUp = () => {
    if (this.draggedEl) {
      this.draggedEl.classList.remove('dragged');
      this.replaceDragging();
    }
    this.clear();
    document.removeEventListener('mousemove', this.onMouseMove);
    localStorage.setItem('task', this.parentEl.innerHTML);
  };

  onMouseMove = (e) => {
    e.preventDefault();
    const target = e.target.closest('.card-wrapper');

    if (this.draggedEl) {
      this.draggedEl.style.left = `${e.clientX - this.shiftX}px`;
      this.draggedEl.style.top = `${e.clientY - this.shiftY}px`;

      const { width } = window.getComputedStyle(this.draggedEl);
      this.draggedEl.classList.add('dragged');
      this.draggedEl.style.width = width;
      this.onDragged(e);
    }
  };

  onDragged = (e) => {
    const target = e.target.closest('.card-wrapper');
    const column = e.target.classList.contains('col');

    // если навели на карточку
    if (target) {
      const cloneEl = this.createCloneEl(target);

      const { y, height } = target.getBoundingClientRect();
      const appendPosition = y + height / 2 > e.clientY
        ? 'beforebegin'
        : 'afterend';
      if (!this.draggingClone) {
        this.draggingClone = cloneEl;
      } else {
        this.draggingClone.remove();
        target.insertAdjacentElement(appendPosition, this.draggingClone);
      }
    }

    if (column) {
      const cardsContainer = e.target.querySelector('.card_box');
      if (![...cardsContainer.children].length || cardsContainer.children.length === 1) {
        this.draggingClone.remove();
        cardsContainer.append(this.draggingClone);
      }
    }
  };

  createCloneEl(el) {
    const dragRect = el.getBoundingClientRect();
    const cloneWidth = dragRect.width;
    const cloneHeight = dragRect.height;

    const cloneEl = document.createElement('div');
    cloneEl.classList.add('clone');

    cloneEl.style.width = `${cloneWidth}px`;
    cloneEl.style.height = `${cloneHeight}px`;

    return cloneEl;
  }

  replaceDragging() {
    this.draggingClone.replaceWith(this.draggedEl);
  }

  clear() {
    this.draggedEl = null;
    this.draggingClone = null;
  }
}

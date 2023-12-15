import Card from './Card';

export default class Columns {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.cardEl = parentEl.querySelector('.card_box');
  }

  getMarkDown() {
    return `<div class="columns">
                    <div class="col todo">
                        <div class="col__header">
                            <h3 class="col__title">Todo</h3>
                            <div class="settings">...</div>  
                        </div>
                        <div class="card_box"></div>
                        <div class="box_footer">
                            <button type="button" class="btn_open-form" >+ Add another card</button>
                        </div>
                        <form name="todoadd" class="add-card">
                            <span class="error">Please, enter card content!</span>
                            <textarea name="todo" class="enter-text"></textarea>
                            <div class="add-card_btns">
                                <button type="submit" class="btn_add">Add Card</button>
                                <button class="form-remover">X</button>
                            </div>
                        </form>
                    </div>

                    <div class="col inprogress">
                        <div class="col__header">
                            <h3 class="col__title">InProgress</h3>
                            <div class="settings">...</div>  
                        </div>
                        <div class="card_box"></div>
                        <div class="box_footer">
                            <button type="button" class="btn_open-form" >+ Add another card</button>
                        </div>
                        <form name="inprogressadd" class="add-card">
                            <span class="error">Please, enter card content!</span>
                            <textarea name="inprogress" class="enter-text"></textarea>
                            <div class="add-card_btns">
                                <button type="submit" class="btn_add">Add Card</button>
                                <button class="form-remover">X</button>
                            </div>
                        </form>
                    </div>

                    <div class="col done">
                        <div class="col__header">
                            <h3 class="col__title">DONE</h3>
                            <div class="settings">...</div>  
                        </div>
                        <div class="card_box"></div>
                        <div class="box_footer">
                            <button type="button" class="btn_open-form" >+ Add another card</button>
                        </div>
                        <form name="doneadd" class="add-card">
                            <span class="error">Please, enter card content!</span>
                            <textarea name="done" class="enter-text"></textarea>
                            <div class="add-card_btns">
                                <button type="submit" class="btn_add">Add Card</button>
                                <button class="form-remover">X</button>
                            </div>
                        </form>
                    </div>
                </div>
        `;
  }

  bindToDOM(markDown) {
    this.parentEl.insertAdjacentHTML('beforeend', markDown);
    this.addListeners();
  }

  addListeners() {
    const columns = document.querySelector('.columns');
    const forms = document.querySelectorAll('.add-card');

    columns.addEventListener('click', (e) => {
      const { target } = e;
      if (target.classList.contains('btn_open-form')) {
        this.openForm(target);
      }

      if (target.classList.contains('form-remover')) {
        this.closeForm(target);
      }

      if (target.classList.contains('card-remover')) {
        const el = target.closest('.card-wrapper');
        const card = new Card();
        card.removeCard(el);
        localStorage.setItem('task', this.parentEl.innerHTML);
      }
    });

    columns.addEventListener('input', (e) => {
      const { target } = e;
      if (target.classList.contains('enter-text')) {
        this.closeError(target);
      }
    });

    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        const { target } = e;
        const parent = target.closest('.col');
        e.preventDefault();
        this.addCard(form, target, parent);
      });
    });
  }

  openForm(target) {
    target.style.display = 'none';
    const col = target.closest('.col');
    const form = col.querySelector('.add-card');
    form.classList.add('active');
  }

  closeForm(target) {
    const col = target.closest('.col');
    const form = col.querySelector('.add-card');
    const btn = col.querySelector('.btn_open-form');

    form.classList.remove('active');
    btn.style.display = 'block';
  }

  showError() {
    const err = document.querySelector('.error');
    err.classList.add('err-active');
  }

  closeError(textArea) {
    const err = textArea.previousElementSibling;
    err.classList.remove('err-active');
  }

  addCard(form, target, parent) {
    const textArea = form.querySelector('.enter-text');
    const cardsContainer = parent.querySelector('.card_box');

    if (!textArea.value) {
      this.showError();
      return;
    }

    const card = new Card(textArea.value);
    const cardCreation = card.createCard(card.content);

    cardsContainer.insertAdjacentHTML('afterbegin', cardCreation);
    textArea.value = '';
    this.closeForm(target);
    localStorage.setItem('task', this.parentEl.innerHTML);
  }
}

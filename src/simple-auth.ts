import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('simple-auth')
export class SimpleAuth extends LitElement {
  static styles = css`
    :host {
      width: 320px;
      display: block;
      container-type: inline-size;
      color-scheme: light dark;
    }

    .container {
      padding: 1.5rem;
      background-color: light-dark(hsl(0 0% 99%), hsl(0 0% 22%));
      border-radius: 0.25rem;
      box-shadow: 0 1px 3px light-dark(hsla(0 0% 40% / 0.25), hsla(0 00% 80% / 0.15));
    }

    .wrapper {
      display: flex;
      flex-direction: column;
    }

    .content:empty {
      display: none
    }

  `

render() {
    return html`
      <div class="container">
        <div class="wrapper">
          <div class="content">
            <slot></slot>
          </div>
          <form action="">
            <div class="form-field">
              <label for="username">Username</label>
              <input type="text" name="username" id="username">
            </div>
            <div class="form-field">
              <label for="username">Username</label>
              <input type="text" name="username" id="username">
            </div>
            <button type="submit">Sign In!</button>
          </form>
        </div>
      </div>
    `
  }

  
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-auth': SimpleAuth
  }
}

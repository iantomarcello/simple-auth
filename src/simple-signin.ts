import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('simple-signin')
export class SimpleJsSignin extends LitElement {
  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
    }

    
  `
  
  render() {
    return html`
      <slot></slot>
      Init
    `
  }

  
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-signin': SimpleJsSignin
  }
}

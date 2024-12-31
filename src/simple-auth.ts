import { LitElement, PropertyValues, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// TODO: alternative attribute to get hash from somewhere secure like env instead of passing via attribute.

/**
 * Simple small app auth for showcase or proof of concept. NOT FOR ACTUAL APPLICATIONS.
 *
 * @slot - This element has a slot
 */
@customElement('simple-auth')
export class SimpleAuth extends LitElement {
  @property({ type: Boolean, attribute: 'no-collapse' }) noAutoCollapse: boolean = false;
  @property() hash!: string;
  #hash!: string;
  @state() isAuthenticated: boolean = false;
  @state() isLoading: boolean = false;
  @state() statusMessage: string | null = null;
  @query('#username') username!: HTMLInputElement;
  @query('#password') password!: HTMLInputElement;
  sc: SubtleCrypto = crypto.subtle;

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      min-height: 100dvh;
      justify-content: center;
      align-items: center;
    }

    .container {
      width: 320px;
      padding: 1.5rem;
      margin-inline: 1.5rem;
      background-color: light-dark(hsl(0 0% 99%), hsl(0 0% 22%));
      border-radius: 0.5rem;
      box-shadow: 0 1px 4px light-dark(hsla(0 0% 40% / 0.55), hsla(0 00% 80% / 0.15));
      container-type: inline-size;
      color-scheme: light dark;
      box-sizing: border-box;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
    }

    .content:empty {
      display: none;
    }

    form {
      display: grid;
      gap: 1rem;
      color: light-dark(hsl(0 0% 22%), hsl(0 0% 99%));
    }

    fieldset {
      display: contents;

      &[disabled] * {
        opacity: 0.5;
      }
    }

    .form-field {
      display: grid;
      gap: 0.5rem;
      font-size: 1rem;
    }

    input {
      padding: 0.5rem 0.6rem;
    }

    button {
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      border: 0px;
      color: light-dark(hsl(0 0% 92%), hsl(0deg 0% 95%));
      background-color: light-dark(hsl(234.9deg 58% 52.85%), hsl(235.11deg 65.22% 40.59%));
      box-shadow: 0 2px 3px light-dark(hsl(235deg 100% 19% / 45%), hsl(235deg 25.75% 12.64% / 45%));
      cursor: pointer;
    }

    .status-message {
      font-style: italic;

      &:empty {
        display: none
      }
    }

  `
  render() {
    const ui = html`
      <div class="container">
        <div class="wrapper">
          <div class="content">
            <slot name="header"></slot>
          </div>
          <form @submit=${this.handleSubmit}>
            <fieldset ?disabled=${this.#hash?.length < 1}>
              <div class="form-field">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" required >
              </div>
              <div class="form-field">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" required >
              </div>
              <button type="submit" .disabled=${this.isLoading} >
                ${ this.isLoading ? 'Loading...' : 'Sign In!'}
              </button>
            </fieldset>
            <small class="status-message">${this.statusMessage}</small>
          </form>
        </div>
      </div>
      `
    ;

    if (this.noAutoCollapse) {
      return ui;
    }

    if (!this.isAuthenticated) {
      return ui;
    }

    return html`<slot></slot>`;
  }

  private async digest(cred: string) {
    const hashBuffer = await this.sc.digest(
      { name: 'SHA-512' },
      new TextEncoder().encode(cred)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.isLoading = true;
    this.statusMessage = null;
    const form: HTMLFormElement = <HTMLFormElement>event.target;
    if (!form) {
      return;
    }
    const cred = `${this.username.value}|${this.password.value}`;
    let hash;
    try {
      hash = await this.digest(cred);
    } catch {
      this.isLoading = false;
      this.dispatchEvent(new CustomEvent('auth-error'));
      return;
    }

    if (hash !== this.#hash) {
      this.isLoading = false;
      this.statusMessage = 'Incorrect credentials.';
      this.dispatchEvent(new CustomEvent('auth-error'));
      return;
    }

    this.isLoading = false;
    this.statusMessage = 'Authenticated.';
    this.isAuthenticated = true;
    this.dispatchEvent(new CustomEvent('auth-success'));
  }

  updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has('hash')) {
      if (!this.#hash) {
        this.#hash = this.hash;
        this.requestUpdate();
      }
    }
  }

  protected firstUpdated(): void {
    if (this.#hash?.length < 1) {
      this.statusMessage = 'Missing hash.';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-auth': SimpleAuth
  }
}

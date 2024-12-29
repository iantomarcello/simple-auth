import { LitElement, PropertyValues, css, html } from 'lit'
import { customElement, eventOptions, property, query, state } from 'lit/decorators.js'

// TODO: store hash somewhere secure

/**
 * Simple small app auth for showcase or proof of concept. NOT FOR ACTUAL APPLICATIONS.
 *
 * @slot - This element has a slot
 */
@customElement('simple-auth')
export class SimpleAuth extends LitElement {
  @property() hash: any;
  #hash!: string;
  @state() isLoading: boolean = false;
  @state() statusMessage: string | null = null;
  @query('#username') username!: HTMLInputElement;
  @query('#password') password!: HTMLInputElement;
  sc: SubtleCrypto = crypto.subtle;

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
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px light-dark(hsla(0 0% 40% / 0.25), hsla(0 00% 80% / 0.15));
    }

    .wrapper {
      display: flex;
      flex-direction: column;
    }

    .content:empty {
      display: none
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
      color: light-dark(hsl(0 0% 92%), hsl(0 0% 72%));
      background-color: light-dark(hsl(235 100% 70%), hsl(235deg 47.77% 30.47%));
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
    return html`
      <div class="container">
        <div class="wrapper">
          <div class="content">
            <slot></slot>
          </div>
          <form @submit=${this.handleSubmit}>
            <fieldset .disabled=${!this.hash?.length}>
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
    } catch (error) {
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
    this.dispatchEvent(new CustomEvent('auth-success'));
  }

  updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has('hash')) {
      if (!this.#hash) {
        this.#hash = this.hash;
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    if (!this.hash?.length) {
      this.statusMessage = 'Missing hash.';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-auth': SimpleAuth
  }
}

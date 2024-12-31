# Simple Auth
A simple web component that takes username/email and password, and check it against hash, on the client side. This is meant for demo site/proof of concept, **NOT FOR ANY PRODUCTION APP OR WHATSOEVER**.


# Getting started
1. The component checks `username` and `password` against a hash. So, the first step is to generate the hash:
    1. The repo comes with a simple script to generate:
        ```sh
        node digest "username|password" # someLongHashedStringThatHasSomeLength
        ```
    1. The component has a `digest()` method to generate the hash:
        ```html
        <simple-auth id="sa"></simple-auth>
        <script>
          const hash = sa.digest("username|password"); // someLongHashedStringThatHasSomeLength
        </script>
        ```
1. Import the JS, and use it in the markup, but its not ready yet.
    ```html
      <script src="/simple-auth.js"></script>
      <simple-auth></simple-auth>
    ```
    This will render the basic fields to enter the  `username` and `password`.
1. To authenticate against a `hash`, pass it via `hash` attribute or JS:
      1. via `hash` attribute:
          ```html
          <simple-auth hash="someLongHashedStringThatHasSomeLength"></simple-auth>
          ```
      1. via JS:
          ```html
          <simple-auth id="sa"></simple-auth>
          <script>
            const hash = sa.digest("username|password"); // someLongHashedStringThatHasSomeLength
            sa.hash = hash;
          </script>
          ```
          The `hash` can only be set once, so no need to worry if its changed. But this is done on the client side, so its not truely secure, hence this is why this component is meant for demo site/proof of concept, **NOT FOR ANY PRODUCTION APP OR WHATSOEVER**.
1. At this point, the `username` and `password` to be checked against the hash. After authenticated, there are two ways to show the authenticated content:
      1. via the `slot`:
          ```html
          <simple-auth hash="someLongHashedStringThatHasSomeLength">
            <!-- Authenticated Content slotted here -->
            <my-app></my-app>
          </simple-auth>
          ```
      1. via the JS and event listeners with the `no-collapse` attribute:
          ```html
          <!-- `no-collapse` tells the form to not disappear after authenticated. -->
          <simple-auth id="sa" no-collapse></simple-auth>
          <!-- Authenticated Content, hidden first -->
          <my-app id="app" hidden></my-app>

          <script>
            const hash = sa.digest("username|password"); // someLongHashedStringThatHasSomeLength
            sa.hash = hash;

            // `auth-success` fires when authenticated.
            sa.addEventListener('auth-success', () => {
              sa.style.display = 'none';
              success.style.display = 'block';
            })
          </script>
          ```
          This is less secure but more programmatically handled (e.g. via `document.createElement('my-app')`).

# Attributes
### no-collapse
Tells the form to not disappear after authenticated. May be using with `auth-success` event to handle things programmatically.

# Properties
### hash: string
The hash for the `username` and `password` to be checked against. Can only be set once, subsequent changes will not take effect.

# Methods
### digest(cred: string): string
Hashes `cred` into the `hash` property to be used.

# Events
### auth-error
Fires when authentication failed. Can be listened to display custom error dialogs.

### auth-success
Fires when authentication succeed. Can be listened to display authenticated content.
